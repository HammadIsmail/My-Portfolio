import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
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

    await connectDB();

    // 2. Parse FormData
    const formData = await request.formData();
    
    // Extracted Fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const tagsString = formData.get('tags') as string;
    const imagePosition = formData.get('imagePosition') as string || 'left';
    const featured = formData.get('featured') === 'true';

    // Extracted Files
    const imageFile = formData.get('image') as File | null;
    const sliderFiles = formData.getAll('images') as File[];
    const videoFile = formData.get('video') as File | null;

    if (!title || !description || !content || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Upload Thumbnail
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadedImage = await uploadToCloudinary(imageBuffer, 'portfolio/projects', 'image');
    const imageUrl = uploadedImage.secure_url;

    // 4. Upload Slider Images
    const imageUrls: string[] = [];
    for (const file of sliderFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const upload = await uploadToCloudinary(buffer, 'portfolio/projects/slider', 'image');
        imageUrls.push(upload.secure_url);
      }
    }

    // 5. Upload Video (Optional)
    let videoUrl = '';
    if (videoFile && videoFile.size > 0) {
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      const upload = await uploadToCloudinary(videoBuffer, 'portfolio/projects/video', 'video');
      videoUrl = upload.secure_url;
    }

    // 6. Save to Database
    const newProject = new Project({
      title,
      description,
      content,
      demoUrl,
      tags: tagsString ? tagsString.split(',').map(tag => tag.trim()) : [],
      imagePosition,
      featured,
      image: imageUrl,
      images: imageUrls.length > 0 ? imageUrls : [imageUrl],
      videoUrl: videoUrl || undefined,
    });

    await newProject.save();

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
