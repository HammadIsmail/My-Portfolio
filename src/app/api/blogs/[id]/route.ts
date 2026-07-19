import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
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
    const blog = await Blog.findById(resolvedParams.id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ blog });
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
    const blog = await Blog.findById(resolvedParams.id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (blog.image) await deleteFromCloudinary(blog.image);

    await Blog.findByIdAndDelete(resolvedParams.id);

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
    const blogId = resolvedParams.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      content,
      tags: tagsString,
      featured = false,
      image
    } = body;

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Clean up old image if a new one is set
    if (image && blog.image && blog.image !== image) {
      try {
        await deleteFromCloudinary(blog.image);
      } catch (e) {
        console.error('Error deleting image from Cloudinary:', e);
      }
    }

    // Update
    blog.title = title;
    blog.description = description;
    blog.content = content;
    blog.tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [];
    blog.featured = featured === true || featured === 'true';
    if (image) blog.image = image;

    await blog.save();

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
