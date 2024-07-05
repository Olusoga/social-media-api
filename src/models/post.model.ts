// src/models/Post.ts
import { Schema, model, Document } from 'mongoose';

interface IPost extends Document {
  author: Schema.Types.ObjectId;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: Schema.Types.ObjectId[];
  comments: { user: Schema.Types.ObjectId; text: string }[];
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
    },
  ],
}, { timestamps: true });

const Post = model<IPost>('Post', PostSchema);
export default Post;
