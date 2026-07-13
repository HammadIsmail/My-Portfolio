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

    const contentType = request.headers.get('content-type') || '';
    
    let title, description, content, demoUrl, tagsString, imagePosition, featured;
    let imageUrl = '';
    let imageUrls: string[] = [];
    let videoUrl = '';

    if (contentType.includes('application/json')) {
      // Handle JSON payload (client-side upload)
      const body = await request.json();
      title = body.title;
      description = body.description;
      content = body.content;
      demoUrl = body.demoUrl;
      tagsString = body.tags;
      imagePosition = body.imagePosition || 'left';
      featured = body.featured === true || body.featured === 'true';
      imageUrl = body.image;
      imageUrls = body.images || [];
      videoUrl = body.videoUrl || '';

      if (!title || !description || !content || !imageUrl) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
    } else {
      // Handle FormData payload (legacy/server-side upload)
      const formData = await request.formData();
      
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      content = formData.get('content') as string;
      demoUrl = formData.get('demoUrl') as string;
      tagsString = formData.get('tags') as string;
      imagePosition = formData.get('imagePosition') as string || 'left';
      featured = formData.get('featured') === 'true';

      const imageFile = formData.get('image') as File | null;
      const sliderFiles = formData.getAll('images') as File[];
      const videoFile = formData.get('video') as File | null;

      if (!title || !description || !content || !imageFile) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToCloudinary(imageBuffer, 'portfolio/projects', 'image');
      imageUrl = uploadedImage.secure_url;

      for (const file of sliderFiles) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const upload = await uploadToCloudinary(buffer, 'portfolio/projects/slider', 'image');
          imageUrls.push(upload.secure_url);
        }
      }

      if (videoFile && videoFile.size > 0) {
        const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
        const upload = await uploadToCloudinary(videoBuffer, 'portfolio/projects/video', 'video');
        videoUrl = upload.secure_url;
      }
    }

    // 6. Save to Database
    const newProject = new Project({
      title,
      description,
      content,
      demoUrl,
      tags: tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [],
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
