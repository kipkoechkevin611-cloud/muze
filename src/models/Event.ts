import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicketCategory {
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
  soldQuantity: number;
  active: boolean;
}

export interface IEvent extends Document {
  name: string;
  slug: string;
  description: string;
  posterImage: string;
  date: Date;
  time: string;
  venue: string;
  location: string;
  category: string;
  ticketCategories: ITicketCategory[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const TicketCategorySchema = new Schema<ITicketCategory>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, required: true, default: 0 },
  soldQuantity: { type: Number, required: true, default: 0 },
  active: { type: Boolean, required: true, default: true },
});

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    posterImage: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true, enum: ['Nairobi', 'Coast', 'Other'] },
    ticketCategories: [TicketCategorySchema],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ slug: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ featured: 1 });
EventSchema.index({ date: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
