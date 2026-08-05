import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  title: string;
  bio: string[];
  coverImage: string;
  profileImage: string;
  linkedinUrl: string;
  githubUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: [String], required: true },
    coverImage: { type: String, required: true },
    profileImage: { type: String, required: true },
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.Profile || model<IProfile>('Profile', ProfileSchema);
