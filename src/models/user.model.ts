import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

 export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  following: Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    versionKey: false 
  });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', UserSchema);
export default User;
