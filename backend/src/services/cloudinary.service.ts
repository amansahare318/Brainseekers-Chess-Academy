import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateImageFile(mimetype: string, size: number) {
  if (!ALLOWED_MIME.has(mimetype)) {
    throw { status: 400, message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
  }
  if (size > MAX_BYTES) {
    throw { status: 400, message: 'File too large. Maximum size is 5MB' };
  }
}

export async function uploadImage(
  buffer: Buffer,
  folder: string,
  mimetype: string
): Promise<{ url: string; publicId: string }> {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw { status: 503, message: 'Cloudinary is not configured' };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `brainseekers/${folder}`,
        resource_type: 'image',
        format: mimetype.split('/')[1] === 'jpeg' ? 'jpg' : mimetype.split('/')[1],
      },
      (err, result) => {
        if (err || !result) {
          reject({ status: 500, message: err?.message || 'Upload failed' });
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  if (!publicId) {
    throw { status: 400, message: 'publicId is required' };
  }
  if (!env.cloudinaryCloudName) {
    throw { status: 503, message: 'Cloudinary is not configured' };
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
