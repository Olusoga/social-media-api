import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
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
  
},
 { timestamps: true },
 
);

//remove version key from the schema
PostSchema.set('versionKey', false);

const Post = model<IPost>('Post', PostSchema);
export default Post;