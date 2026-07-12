import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    
    // Extracted File
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 3. Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check if it's an image or video
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    
    const uploadedFile = await uploadToCloudinary(buffer, 'portfolio/editor', resourceType);

    return NextResponse.json({ 
      success: true, 
      url: uploadedFile.secure_url,
      resourceType
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
