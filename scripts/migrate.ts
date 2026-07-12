import { projects } from "../src/data/projects";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

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

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    console.log("Clearing existing projects...");
    await Project.deleteMany({});
    
    console.log(`Migrating ${projects.length} projects...`);
    
    for (const p of projects) {
      const newProject = new Project({
        title: p.title,
        description: p.description,
        image: p.image,
        images: p.images,
        videoUrl: p.videoUrl,
        content: p.content,
        tags: p.tags,
        demoUrl: p.demoUrl,
        imagePosition: p.imagePosition,
        featured: p.featured,
      });
      await newProject.save();
      console.log(`Migrated: ${p.title}`);
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
