import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  owner: mongoose.Types.ObjectId;
  followers: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followers: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);
