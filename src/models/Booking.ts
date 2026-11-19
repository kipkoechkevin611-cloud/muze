import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  promptNumber: string;
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  eventDate: Date;
  eventVenue: string;
  ticketCategory: string;
  quantity: number;
  pricePerTicket: number;
  totalAmount: number;
  paymentStatus: 'PENDING PAYMENT' | 'PAYMENT CONFIRMED' | 'PAYMENT FAILED' | 'CANCELLED' | 'REFUND PROCESSING' | 'REFUNDED';
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  adminNotes?: string;
  emailNotificationStatus: 'pending' | 'sent' | 'failed';
  customerEmailStatus: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    promptNumber: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    ticketCategory: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerTicket: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING PAYMENT', 'PAYMENT CONFIRMED', 'PAYMENT FAILED', 'CANCELLED', 'REFUND PROCESSING', 'REFUNDED'],
      default: 'PENDING PAYMENT',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    adminNotes: { type: String, required: false },
    emailNotificationStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    customerEmailStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ createdAt: -1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
