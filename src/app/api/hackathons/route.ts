import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Hackathon from '@/models/Hackathon';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const hackathons = await Hackathon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ hackathons });
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
      demoUrl,
      githubUrl,
      tags: tagsString,
      imagePosition = 'left',
      featured = false,
      image,
      images = [],
      videoUrl = ''
    } = body;

    if (!title || !description || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Database
    const newHackathon = new Hackathon({
      title,
      description,
      content,
      demoUrl,
      githubUrl,
      tags: tagsString ? tagsString.split(',').map((tag: string) => tag.trim()) : [],
      imagePosition,
      featured: featured === true || featured === 'true',
      image,
      images: images.length > 0 ? images : [image],
      videoUrl: videoUrl || undefined,
    });

    await newHackathon.save();

    return NextResponse.json({ success: true, hackathon: newHackathon }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
