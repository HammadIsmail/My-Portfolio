import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  company: string;
  location: string;
  workType: string; // Remote, Hybrid, Onsite
  period: string;
  description: string;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    workType: { type: String, required: true, default: 'Remote' },
    period: { type: String, required: true },
    description: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Experience || model<IExperience>('Experience', ExperienceSchema);
