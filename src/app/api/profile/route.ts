import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import { verifyToken } from '@/lib/auth';

const DEFAULT_PROFILE = {
  name: "Hammad",
  title: "FullStack & AI Developer",
  coverImage: "/cover.webp",
  profileImage: "/profile.webp",
  linkedinUrl: "https://www.linkedin.com/in/muhammad-hammad-uet/",
  githubUrl: "https://github.com/HammadIsmail",
  bio: [
    "I'm a Full-Stack Developer passionate about building scalable, high-performance web and mobile applications. I specialize in React, Next.js, React Native, Node.js (Express), FastAPI, and NestJS, with experience designing backend systems using MongoDB, PostgreSQL, MySQL, and Neo4j.",
    "I also build AI-powered applications, integrating large language models and intelligent workflows into production-ready software. My experience includes developing REST and GraphQL APIs, real-time applications with Socket.IO, cloud deployment, and modern software architecture.",
    "Through hackathons, collaborative projects, and real-world development, I've built solutions ranging from AI platforms to enterprise applications. I enjoy solving challenging problems, writing clean and maintainable code, and creating software that delivers meaningful value to users and businesses."
  ]
};

export async function GET() {
  try {
    await connectDB();
    let profile = await Profile.findOne({});
    if (!profile) {
      profile = await Profile.create(DEFAULT_PROFILE);
    }
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, title, bio, coverImage, profileImage, linkedinUrl, githubUrl } = body;

    if (!name || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bioArray = Array.isArray(bio)
      ? bio
      : typeof bio === 'string'
      ? bio.split('\n\n').filter((p: string) => p.trim() !== '')
      : [];

    let profile = await Profile.findOne({});
    if (profile) {
      profile.name = name;
      profile.title = title;
      profile.bio = bioArray;
      if (coverImage) profile.coverImage = coverImage;
      if (profileImage) profile.profileImage = profileImage;
      if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
      if (githubUrl !== undefined) profile.githubUrl = githubUrl;
      await profile.save();
    } else {
      profile = await Profile.create({
        name,
        title,
        bio: bioArray,
        coverImage: coverImage || DEFAULT_PROFILE.coverImage,
        profileImage: profileImage || DEFAULT_PROFILE.profileImage,
        linkedinUrl: linkedinUrl || DEFAULT_PROFILE.linkedinUrl,
        githubUrl: githubUrl || DEFAULT_PROFILE.githubUrl,
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
