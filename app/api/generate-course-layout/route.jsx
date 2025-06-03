import { db } from "@/config/db";
import { courseTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const PROMPT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only

Schema:

{
    "course:{
        "name":"string",
        "description":"string",
        "category":"string",
        "level":"string",
        "includeVideo":"boolean",
        "noOfChapters":"number",
        "courseBannerImagePrompt": "string",
        "chapters":[
            {
                "chapterName":"string",
                "duration":"string",
                "topics":[
                    "string"
                ],
                "imagePrompt":"string"
        }
        ]
    }
},

User Input:
`

export const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

export async function POST(req) {
    const { courseId, ...formData } = await req.json();
    const user = await currentUser();
    
    const config = {
        responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.0-flash';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: PROMPT + JSON.stringify(formData),
                },
            ],
        },
    ];


    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });
    console.log(response.candidates[0].content.parts[0].text);
    const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
    const RawJson = RawResp.replace('```json', '').replace('```', '');
    const JSONResp = JSON.parse(RawJson);
    const ImagePrompt = JSONResp.course?.courseBannerImagePrompt
    const bannerImageUrl = await GenerateImage(ImagePrompt);
    const result = await db.insert(courseTable).values({
        ...formData,
        courseJson: JSONResp,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        cid: courseId,
        bannerImageUrl:bannerImageUrl
    })

    return NextResponse.json({ courseId: courseId });
}


const GenerateImage = async (imagePrompt) => {
  const API_URL = "https://api.replicate.com/v1/predictions";
  const API_KEY = process.env.REPLICATE_API_KEY;

  try {
    const prediction = await axios.post(API_URL,
      {
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // ✅ CORRECT version
        input: { prompt: imagePrompt }
      },
      {
        headers: {
          "Authorization": `Token ${API_KEY}`,
          "Content-Type": "application/json"
        }
      });

    if (prediction.status !== 201) throw new Error("Failed to start image generation.");

    let imageUrl = "";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    for (let i = 0; i < 10; i++) {
      await delay(1500);
      const statusRes = await axios.get(prediction.data.urls.get, {
        headers: { "Authorization": `Token ${API_KEY}` }
      });

      const output = statusRes.data.output;
      if (output) {
        imageUrl = Array.isArray(output) ? output[0] : output;
        break;
      }
    }

    if (!imageUrl) {
      console.warn("Image generation timed out or failed.");
    }

    return imageUrl;
  } catch (err) {
    console.error("Image generation error:", err?.message || err);
    return "";
  }
};
