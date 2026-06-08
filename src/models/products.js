import mongoose from 'mongoose'
import { DEFAULT_CATEGORY, PRODUCT_CATEGORIES } from '../constants/categories.js'

const productSchema = new mongoose.Schema(
  {
    nomi: {
      type: String,
      required: true,
      trim: true,
    },
    narxi: {
      type: Number,
      required: true,
    },
    birlik: {
      type: String,
      enum: ['kg', 'litr', 'dona'],
      required: true,
    },
    kategoriya: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      default: DEFAULT_CATEGORY,
      index: true,
    },
    rasm: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'products',
  }
)

export default mongoose.model('Product', productSchema)
