import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Experience from '@/models/Experience';
import { verifyToken } from '@/lib/auth';

const DEFAULT_EXPERIENCES = [
  {
    role: "Junior Full Stack Developer",
    company: "Infoquestpro",
    location: "Poland",
    workType: "Remote",
    period: "2025 - Present",
    description: "Transitioned to advanced development role working with microservices architecture and distributed systems. Building and maintaining independent services using modern tech stack, implementing inter-service communication, and contributing to large-scale application ecosystems.",
    visible: true,
    order: 1
  },
  {
    role: "Junior Full Stack Developer",
    company: "Hive Technologies",
    location: "Pakistan",
    workType: "Hybrid",
    period: "2025 - 3 Months",
    description: "Promoted from intern to full-time developer, taking ownership of feature development and maintenance across multiple client projects. Built scalable web applications using React, Next.js, and Node.js/Express, while collaborating with cross-functional teams to deliver high-quality solutions on schedule.",
    visible: true,
    order: 2
  },
  {
    role: "Full-Stack Intern",
    company: "Hive Technologies",
    location: "Pakistan",
    workType: "Onsite",
    period: "2025 - 3 Months",
    description: "Contributed to live production applications serving real users, developing features using React, Next.js, and Node.js with Express. Gained hands-on experience in full-stack development within an enterprise environment, collaborating on client-facing projects and learning industry best practices.",
    visible: true,
    order: 3
  }
];

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('all') === 'true';

    const count = await Experience.countDocuments();
    if (count === 0) {
      await Experience.insertMany(DEFAULT_EXPERIENCES);
    }

    const experiences = await Experience.find(includeHidden ? {} : { visible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ experiences });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { role, company, location, workType, period, description, visible = true, order = 0 } = body;

    if (!role || !company || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newExp = await Experience.create({
      role,
      company,
      location: location || 'Remote',
      workType: workType || 'Remote',
      period: period || 'Present',
      description,
      visible: visible === true || visible === 'true',
      order: Number(order) || 0,
    });

    return NextResponse.json({ success: true, experience: newExp }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
