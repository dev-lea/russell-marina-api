import mongoose from 'mongoose';

const CatwaySchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, unique: true, min: 1 },
    catwayType: { type: String, required: true, enum: ['long', 'short'] },
    catwayState: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);


export const Catway = mongoose.model('Catway', CatwaySchema);

