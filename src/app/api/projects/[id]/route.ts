import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Define the route for GET (fetch single project), PUT (update), and DELETE
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const project = await Project.findById(resolvedParams.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;
    const project = await Project.findById(resolvedParams.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (project.image) await deleteFromCloudinary(project.image);
    if (project.videoUrl) await deleteFromCloudinary(project.videoUrl);
    if (project.images && Array.isArray(project.images)) {
      for (const img of project.images) {
        await deleteFromCloudinary(img);
      }
    }

    await Project.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    let title, description, content, demoUrl, githubUrl, tagsString, imagePosition, featured;
    let imageUrl = project.image;
    let videoUrl = project.videoUrl || '';
    let finalSliderImages: string[] = [];
    let oldImagesToRemove: string[] = [];

    if (contentType.includes('application/json')) {
      const body = await request.json();
      title = body.title;
      description = body.description;
      content = body.content;
      demoUrl = body.demoUrl;
      githubUrl = body.githubUrl;
      tagsString = body.tags;
      imagePosition = body.imagePosition || 'left';
      featured = body.featured === true || body.featured === 'true';
      
      if (body.image) imageUrl = body.image;
      if (body.videoUrl !== undefined) videoUrl = body.videoUrl;
      
      finalSliderImages = body.images || [];

      // Find images to delete
      if (project.images && Array.isArray(project.images)) {
        oldImagesToRemove = project.images.filter((oldImg: string) => !finalSliderImages.includes(oldImg));
      }
      if (project.image && project.image !== imageUrl) {
        oldImagesToRemove.push(project.image);
      }
      if (project.videoUrl && project.videoUrl !== videoUrl) {
        oldImagesToRemove.push(project.videoUrl);
      }
    } else {
      const formData = await request.formData();

      // Text fields
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      content = formData.get('content') as string;
      demoUrl = formData.get('demoUrl') as string;
      githubUrl = formData.get('githubUrl') as string;
      tagsString = formData.get('tags') as string;
      imagePosition = formData.get('imagePosition') as string || 'left';
      featured = formData.get('featured') === 'true';

      // File fields
      const imageFile = formData.get('image') as File | null;
      const videoFile = formData.get('video') as File | null;
      
      // Existing image URLs that should be kept in the order specified
      const existingImagesRaw = formData.getAll('existingImages') as string[];
      // New slider files
      const newSliderFiles = formData.getAll('newImages') as File[];
      // Order of all slider items
      const sliderOrder = formData.getAll('sliderOrder') as string[]; 

      if (imageFile && imageFile.size > 0) {
        oldImagesToRemove.push(project.image);
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadToCloudinary(imageBuffer, 'portfolio/projects', 'image');
        imageUrl = uploadedImage.secure_url;
      }

      if (videoFile && videoFile.size > 0) {
        if (project.videoUrl) oldImagesToRemove.push(project.videoUrl);
        const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
        const upload = await uploadToCloudinary(videoBuffer, 'portfolio/projects/video', 'video');
        videoUrl = upload.secure_url;
      }

      // Process new slider images
      const newImageUrls: Record<string, string> = {};
      for (let i = 0; i < newSliderFiles.length; i++) {
        const file = newSliderFiles[i];
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const upload = await uploadToCloudinary(buffer, 'portfolio/projects/slider', 'image');
          newImageUrls[file.name] = upload.secure_url;
        }
      }

      // Determine final slider images array in the correct order
      if (sliderOrder && sliderOrder.length > 0) {
        for (const item of sliderOrder) {
          if (item.startsWith('existing:')) {
            finalSliderImages.push(item.replace('existing:', ''));
          } else if (item.startsWith('new:')) {
            const fileName = item.replace('new:', '');
            if (newImageUrls[fileName]) {
              finalSliderImages.push(newImageUrls[fileName]);
            }
          }
        }
      } else {
        // Fallback if no order is provided
        finalSliderImages.push(...existingImagesRaw);
        finalSliderImages.push(...Object.values(newImageUrls));
      }
      
      // Cleanup any existing images that were removed
      if (project.images && Array.isArray(project.images)) {
        for (const oldImg of project.images) {
          if (!finalSliderImages.includes(oldImg)) {
            oldImagesToRemove.push(oldImg);
          }
        }
      }
    }

    // Cleanup images in Cloudinary
    for (const imgToRemove of oldImagesToRemove) {
      await deleteFromCloudinary(imgToRemove);
    }

    // Ensure we have at least one image if the slider is somehow empty but we have a main image
    if (finalSliderImages.length === 0 && imageUrl) {
      finalSliderImages.push(imageUrl);
    }

    project.title = title;
    project.description = description;
    project.content = content;
    project.demoUrl = demoUrl;
    project.githubUrl = githubUrl;
    project.tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [];
    project.imagePosition = imagePosition;
    project.featured = featured;
    project.image = imageUrl;
    project.images = finalSliderImages;
    project.videoUrl = videoUrl;

    await project.save();

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
