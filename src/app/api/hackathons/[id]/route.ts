import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Hackathon from '@/models/Hackathon';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const hackathon = await Hackathon.findById(resolvedParams.id);
    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }
    return NextResponse.json({ hackathon });
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
    const hackathon = await Hackathon.findById(resolvedParams.id);

    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (hackathon.image) await deleteFromCloudinary(hackathon.image);
    if (hackathon.videoUrl) await deleteFromCloudinary(hackathon.videoUrl);
    if (hackathon.images && Array.isArray(hackathon.images)) {
      for (const img of hackathon.images) {
        await deleteFromCloudinary(img);
      }
    }

    await Hackathon.findByIdAndDelete(resolvedParams.id);

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
    const hackathonId = resolvedParams.id;
    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      content,
      demoUrl,
      githubUrl,
      tags: tagsString,
      imagePosition = 'left',
      featured = false,
      image,
      images = [],
      videoUrl = ''
    } = body;

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine old images to clean up from Cloudinary
    let oldImagesToRemove: string[] = [];
    if (image && hackathon.image && hackathon.image !== image) {
      oldImagesToRemove.push(hackathon.image);
    }
    if (videoUrl !== undefined && hackathon.videoUrl && hackathon.videoUrl !== videoUrl) {
      oldImagesToRemove.push(hackathon.videoUrl);
    }
    if (images && hackathon.images && Array.isArray(hackathon.images)) {
      for (const img of hackathon.images) {
        if (!images.includes(img)) {
          oldImagesToRemove.push(img);
        }
      }
    }

    // Clean up
    for (const imgToRemove of oldImagesToRemove) {
      try {
        await deleteFromCloudinary(imgToRemove);
      } catch (e) {
        console.error('Error deleting image from Cloudinary:', e);
      }
    }

    // Update
    hackathon.title = title;
    hackathon.description = description;
    hackathon.content = content;
    hackathon.demoUrl = demoUrl;
    hackathon.githubUrl = githubUrl;
    hackathon.tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [];
    hackathon.imagePosition = imagePosition;
    hackathon.featured = featured === true || featured === 'true';
    if (image) hackathon.image = image;
    hackathon.images = images.length > 0 ? images : [hackathon.image];
    hackathon.videoUrl = videoUrl || undefined;

    await hackathon.save();

    return NextResponse.json({ success: true, hackathon });
  } catch (error: any) {
    console.error('Error updating hackathon:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
