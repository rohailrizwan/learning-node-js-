import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    notes: {
      type: [String],
      required: true,
      default: [],
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    // new keys can be added here
    isAvailable: {
      type: Boolean,
      default: true,
    },
    cover_images: {
      type: [String],
      default: [],
    },
    sillage: {
      type: String,
    },
    longevity: {
      type: String,
    },
    occasion: {
      type: [String],
      default: [],
    },
    season: {
      type: [String],
      default: [],
    },
    shareLinks: {
      facebook: { type: String },
      twitter: { type: String },
      whatsapp: { type: String },
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Products', productSchema);
