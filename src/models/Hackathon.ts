import mongoose from 'mongoose';

const HackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    videoUrl: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    demoUrl: { type: String },
    githubUrl: { type: String },
    imagePosition: { type: String, enum: ['left', 'right'], default: 'left' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Hackathon || mongoose.model('Hackathon', HackathonSchema);
