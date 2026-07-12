import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    videoUrl: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    demoUrl: { type: String },
    imagePosition: { type: String, enum: ['left', 'right'], default: 'left' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
