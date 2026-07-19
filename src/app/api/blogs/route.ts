import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ blogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const body = await request.json();
    const {
      title,
      description,
      content,
      tags: tagsString,
      featured = false,
      image
    } = body;

    if (!title || !description || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Database
    const newBlog = new Blog({
      title,
      description,
      content,
      tags: tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [],
      featured: featured === true || featured === 'true',
      image,
    });

    await newBlog.save();

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
