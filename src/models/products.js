import mongoose from 'mongoose'

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
