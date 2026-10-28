
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@vignify/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TITLE_MAX_LENGTH = 25;
const DESCRIPTION_MAX_LENGTH = 500;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_TEXT_PATTERN = /^[A-Za-z\s\p{P}\p{S}]*$/u;

function detectImageType(bytes: Uint8Array): string | null {
  // JPEG
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let uploadedImagePath: string | null = null;

  try {
    const supabase = await createClient();

    // Verify the actual authenticated user on the server.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Please log in to upload wallpapers.", 401);
    }

    const formData = await request.formData();
    const titleValue = formData.get("title");
    const descriptionValue = formData.get("description");
    const imageValue = formData.get("image");

    if (
      typeof titleValue !== "string" ||
      typeof descriptionValue !== "string" ||
      !(imageValue instanceof File)
    ) {
      return errorResponse(
        "Please provide a title, description, and image.",
        400,
      );
    }

    const title = titleValue.trim();
    const description = descriptionValue.trim();

    if (!title) {
      return errorResponse("Please provide a wallpaper title.", 400);
    }

    if (title.length > TITLE_MAX_LENGTH) {
      return errorResponse(
        `Title cannot exceed ${TITLE_MAX_LENGTH} characters.`,
        400,
      );
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
      return errorResponse(
        `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
        400,
      );
    }

    if (
      !ALLOWED_TEXT_PATTERN.test(title) ||
      !ALLOWED_TEXT_PATTERN.test(description)
    ) {
      return errorResponse(
        "Title and description may contain English letters, spaces, and special characters only. Numbers are not allowed.",
        400,
      );
    }

    if (imageValue.size === 0 || imageValue.size > MAX_FILE_SIZE) {
      return errorResponse(
        "Image must be larger than 0 bytes and no more than 10 MB.",
        400,
      );
    }

    if (!ALLOWED_TYPES.has(imageValue.type)) {
      return errorResponse(
        "Only JPEG, PNG, and WebP images are allowed.",
        400,
      );
    }

    const bytes = new Uint8Array(await imageValue.arrayBuffer());
    const detectedType = detectImageType(bytes);

    if (!detectedType || detectedType !== imageValue.type) {
      return errorResponse(
        "The file content does not match a supported image type.",
        400,
      );
    }

    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const imagePath =
      `${user.id}/${randomUUID()}.${extensionByType[detectedType]}`;

    const { error: uploadError } = await supabase.storage
      .from("wallpapers")
      .upload(imagePath, bytes, {
        contentType: detectedType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "Wallpaper storage upload failed:",
        uploadError.message,
      );

      return errorResponse(
        "Image upload failed. Please try again.",
        500,
      );
    }

    uploadedImagePath = imagePath;

    const { data: wallpaper, error: databaseError } = await supabase
      .from("wallpapers")
      .insert({
        creator_id: user.id,
        title,
        description,
        image_path: imagePath,
        status: "pending",
      })
      .select("id, title, description, image_path, status, created_at")
      .single();

    if (databaseError) {
      const { error: cleanupError } = await supabase.storage
        .from("wallpapers")
        .remove([imagePath]);

      if (cleanupError) {
        console.error(
          "Failed to clean up uploaded image:",
          cleanupError.message,
        );
      } else {
        uploadedImagePath = null;
      }

      console.error(
        "Wallpaper metadata insert failed:",
        databaseError.message,
      );

      return errorResponse(
        "Image was uploaded, but its record could not be saved.",
        500,
      );
    }

    uploadedImagePath = null;

    return NextResponse.json(
      {
        message: "Wallpaper submitted for review.",
        wallpaper,
        publicUrl: null,
        previewAvailableAfterApproval: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Wallpaper upload request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    // Best-effort cleanup if an unexpected error occurs after upload.
    if (uploadedImagePath) {
      try {
        const supabase = await createClient();

        await supabase.storage
          .from("wallpapers")
          .remove([uploadedImagePath]);
      } catch (cleanupError) {
        console.error(
          "Unexpected upload cleanup failure:",
          cleanupError,
        );
      }
    }

    return errorResponse(
      "Unable to process the upload request.",
      500,
    );
  }
}
