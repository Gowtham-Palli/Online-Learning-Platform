import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { db } from "@/config/db";
import { courseTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import retry from 'async-retry';
import JSON5 from 'json5'; // Make sure to install: npm install json5

const PROMPT = `
You're a course generator. Based on the input chapter name and topics, generate rich HTML content for each topic.

⚠️ Output strictly valid JSON (double quotes, no trailing commas, no markdown or code blocks).

Schema:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string",
      "content": "HTML string"
    }
  ]
}

User Input:
`;

const AI_RETRY_CONFIG = {
  retries: 3,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 5000,
  randomize: true,
};

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    const promises = courseJson?.chapters?.map(async (chapter) => {
      let JSONResp;
      try {
        const response = await retry(async (bail) => {
          try {
            const config = { responseMimeType: 'text/plain' };
            const model = 'gemini-1.5-flash';
            const contents = [{
              role: 'user',
              parts: [{ text: PROMPT + JSON.stringify(chapter) }]
            }];

            const result = await ai.models.generateContent({ model, config, contents });
            return result;
          } catch (error) {
            if (error.response?.status === 503) throw error;
            bail(error);
          }
        }, AI_RETRY_CONFIG);

        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanedText = rawText
          .replace(/```(?:json)?/gi, '') // removes ```json or ```
          .replace(/[\u2018\u2019]/g, "'") // curly single quotes to straight
          .replace(/[\u201C\u201D]/g, '"') // curly double quotes to straight
          .trim();

        try {
          JSONResp = JSON5.parse(cleanedText);
        } catch (parseError) {
          console.error('Failed to parse AI JSON:', cleanedText);
          throw new Error(`Invalid JSON format for chapter "${chapter.chapterName}": ${parseError.message}`);
        }

      } catch (error) {
        console.error('Chapter processing failed:', error);
        throw new Error(`Failed to process chapter "${chapter.chapterName}": ${error.message}`);
      }

      try {
        const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
        return {
          courseData: JSONResp,
          youtubeVideo: youtubeData
        };
      } catch (youtubeError) {
        console.error('YouTube API failed:', youtubeError);
        return {
          courseData: JSONResp,
          youtubeVideo: []
        };
      }
    });

    const CourseContent = await Promise.all(promises);

    await db.update(courseTable).set({
      courseContent: CourseContent
    }).where(eq(courseTable?.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      CourseContent
    });

  } catch (error) {
    console.error('Global error handler:', error);
    return NextResponse.json(
      {
        error: error.message,
        retriesExhausted: error.attempts ? `Failed after ${error.attempts} attempts` : undefined
      },
      { status: error.status || 500 }
    );
  }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const GetYoutubeVideo = async (topic) => {
  try {
    const params = {
      part: 'snippet',
      q: topic,
      maxResults: 4,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    return resp.data.items.map(item => ({
      videoId: item?.id?.videoId,
      title: item?.snippet?.title
    }));

  } catch (error) {
    console.error('YouTube API Error:', error.message);
    throw error;
  }
};
