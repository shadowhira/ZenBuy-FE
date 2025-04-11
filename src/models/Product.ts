import mongoose, { Schema, Document } from 'mongoose';

export interface ProductVariant {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  shop: mongoose.Types.ObjectId;
  rating: number;
  reviews: number;
  featured: boolean;
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  attributes: { type: Map, of: String, default: {} },
}, { _id: true });

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    variants: [ProductVariantSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
