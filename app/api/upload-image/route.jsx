import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function blobToBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await blobToBuffer(file);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "course_banners" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      Readable.from(buffer).pipe(stream);
    });

    const secureUrl = uploadResult.secure_url;
    return NextResponse.json({ success: true, imageUrl: secureUrl });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
