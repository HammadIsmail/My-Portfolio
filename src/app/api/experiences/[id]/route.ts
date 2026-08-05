import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Experience from '@/models/Experience';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const experience = await Experience.findById(id);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    if (body.role !== undefined) experience.role = body.role;
    if (body.company !== undefined) experience.company = body.company;
    if (body.location !== undefined) experience.location = body.location;
    if (body.workType !== undefined) experience.workType = body.workType;
    if (body.period !== undefined) experience.period = body.period;
    if (body.description !== undefined) experience.description = body.description;
    if (body.visible !== undefined) experience.visible = body.visible === true || body.visible === 'true';
    if (body.order !== undefined) experience.order = Number(body.order);

    await experience.save();

    return NextResponse.json({ success: true, experience });
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const deleted = await Experience.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
