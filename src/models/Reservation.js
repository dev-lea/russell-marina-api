import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, min: 1 },
    clientName: { type: String, required: true, trim: true },
    boatName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

ReservationSchema.index({ catwayNumber: 1, startDate: 1, endDate: 1 });

export const Reservation = mongoose.model('Reservation', ReservationSchema);
