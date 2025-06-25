import { db } from "@/config/db";
import { courseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";

const PROMPT = `Generate Learning Course based on the following details. Include:
- Course Name
- Description
- Course Banner Image Prompt (modern, flat-style 2D digital illustration representing the user's topic with creative UI/UX elements, colorful, professional, in 3D format)
- Chapter Name
- Topics under each chapter
- Duration for each chapter
Return output in JSON format only.

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "courseBannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"],
        "imagePrompt": "string"
      }
    ]
  }
},

User Input:
`;

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { courseId, bannerImageUrl: clientBannerUrl, ...formData } = await req.json();
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const model = "gemini-2.0-flash";
    const config = { responseMimeType: "text/plain" };
    const contents = [{ role: "user", parts: [{ text: PROMPT + JSON.stringify(formData) }] }];

    const response = await ai.models.generateContent({ model, config, contents });
    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    let rawJson = rawText;

    // Remove markdown code block syntax if it exists
    if (rawJson.startsWith("```json")) {
      rawJson = rawJson.replace("```json", "").trim();
    }
    if (rawJson.endsWith("```")) {
      rawJson = rawJson.replace(/```$/, "").trim();
    }

    let jsonResp = {};
    try {
      jsonResp = JSON.parse(rawJson);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", rawJson);
      throw new Error("Invalid JSON format from Gemini");
    }


    const imagePrompt = jsonResp.course?.courseBannerImagePrompt;
    let bannerImageUrl = clientBannerUrl || "";

    // Attempt AI image generation if needed
    if (!bannerImageUrl && imagePrompt) {
      try {
        bannerImageUrl = await GenerateImage(imagePrompt);
      } catch (err) {
        console.error("Image generation error:", err);
        // Return specific error for frontend handling
        return NextResponse.json(
          {
            error: "IMAGE_GENERATION_FAILED",
            message: "Banner image generation failed. Please upload an image manually."
          },
          { status: 400 }
        );
      }
    }

    // Validate we have a banner image URL
    if (!bannerImageUrl) {
      return NextResponse.json(
        {
          error: "MISSING_BANNER_IMAGE",
          message: "Course banner image is required"
        },
        { status: 400 }
      );
    }

    // Insert course into database
    await db.insert(courseTable).values({
      ...formData,
      courseJson: jsonResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl,
    });

    return NextResponse.json({
      success: true,
      courseId,
      bannerImageUrl
    });

  } catch (error) {
    console.error("Course generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const GenerateImage = async (imagePrompt) => {
  const API_URL = "https://api.replicate.com/v1/predictions";
  const API_KEY = process.env.REPLICATE_API_KEY;

  try {
    const prediction = await axios.post(
      API_URL,
      {
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: { prompt: imagePrompt },
      },
      {
        headers: {
          Authorization: `Token ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (prediction.status !== 201) {
      throw new Error(`API returned status ${prediction.status}`);
    }

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let imageUrl = "";
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds timeout

    while (Date.now() - startTime < timeout) {
      await delay(1500);
      const statusRes = await axios.get(prediction.data.urls.get, {
        headers: { Authorization: `Token ${API_KEY}` },
      });

      if (statusRes.data.output) {
        imageUrl = Array.isArray(statusRes.data.output)
          ? statusRes.data.output[0]
          : statusRes.data.output;
        break;
      }

      if (statusRes.data.status === "failed") {
        throw new Error("Image generation failed on server");
      }
    }

    if (!imageUrl) {
      throw new Error("Image generation timed out");
    }

    return imageUrl;
  } catch (err) {
    console.error("Image generation failed:", err.message);
    throw err; // Propagate error to caller
  }
};
