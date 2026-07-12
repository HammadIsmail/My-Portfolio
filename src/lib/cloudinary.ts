import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: resourceType,
        format: resourceType === 'image' ? 'webp' : undefined // Auto convert images to webp
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (url: string): Promise<any> => {
  try {
    // Extract public_id from Cloudinary URL
    // e.g. https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    
    // We also need the folder path. Let's find 'upload' and get everything after it, minus extension
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Sometimes there is a version string like 'v123456789' right after 'upload'
    let startIndex = uploadIndex + 1;
    if (parts[startIndex]?.match(/^v\d+$/)) {
      startIndex++;
    }
    
    // Join the rest and remove extension
    const fullPathWithExt = parts.slice(startIndex).join('/');
    const publicId = fullPathWithExt.substring(0, fullPathWithExt.lastIndexOf('.'));
    
    if (!publicId) return null;

    // We assume image by default, but it could be a video. 
    // Usually destroy works across resource types if you specify it, but we'll try image first.
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: url.includes('/video/') ? 'video' : 'image' }, (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export default cloudinary;
