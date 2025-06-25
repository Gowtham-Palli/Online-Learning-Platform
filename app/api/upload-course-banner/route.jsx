// File: /app/api/upload-course-banner/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { courseTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

// Enable Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable default body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert File to buffer
async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const courseId = formData.get("courseId");

    if (!file || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing file or courseId" },
        { status: 400 }
      );
    }

    // Convert file to buffer and upload to Cloudinary
    const buffer = await fileToBuffer(file);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "course_banners" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const bannerImageUrl = uploadResult.secure_url;

    // Update course in Neon DB
    await db
      .update(courseTable)
      .set({ bannerImageUrl })
      .where(eq(courseTable.cid, courseId));

    return NextResponse.json({ success: true, bannerImageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}
