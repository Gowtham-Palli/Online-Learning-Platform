import { db } from "@/config/db";
import { courseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const PROMPT = `
Generate a unique learning course idea with:
- name
- description
- category (random)
- level (random)
- includeVideo (boolean)
- noOfChapters
- courseBannerImagePrompt (for a 3D flat-style UI/UX concept art illustration)
- chapters (with chapterName, duration, topics[], imagePrompt)

Return JSON in this format:
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
}
`;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  const user = await currentUser();
  const count = 3; // Number of unique courses to generate

  // Get existing course names for the user
  const existingCourses = await db.select().from(courseTable)
    .where(eq(courseTable.userEmail, user?.primaryEmailAddress?.emailAddress));
  const existingNames = new Set(
    existingCourses.map(course => course.courseJson?.course?.name?.toLowerCase())
  );

  const createdCourses = [];
  const attemptedNames = new Set();

  while (createdCourses.length < count && attemptedNames.size < count * 5) {
    attemptedNames.add(attemptedNames.size);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: { responseMimeType: 'text/plain' },
      contents: [{ role: 'user', parts: [{ text: PROMPT }] }]
    });

    const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = raw.replace(/```json|```/g, '');

    let json;
    try {
      json = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Invalid JSON from AI:", cleanJson);
      continue;
    }

    const name = json.course?.name?.toLowerCase();
    if (!name || existingNames.has(name)) continue;

    const courseId = uuidv4();
    const imagePrompt = json.course.courseBannerImagePrompt;
    console.log(imagePrompt);

    let bannerImageUrl = '';
    try {
      bannerImageUrl = await GenerateImage(imagePrompt);
    } catch (err) {
      console.warn("Image generation failed:", err?.message || err);
      continue;
    }

    createdCourses.push({
      courseId,
      bannerImageUrl,
      courseJson: json
    });

    existingNames.add(name);
  }

  return NextResponse.json({
    created: createdCourses.length,
    courses: createdCourses
  });
}

const GenerateImage = async(imagePrompt) => {
    const BASE_URL = 'https://aigurulab.tech';
    const result = await axios.post(BASE_URL + '/api/generate-image',
        {
            // width: 1024,
            // height: 1024,
            input: imagePrompt,
            model: 'flux',//'flux'
            aspectRatio: "16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
    console.log(result.data.image) //Output Result: Base 64 Image
    return result.data.image;
}
