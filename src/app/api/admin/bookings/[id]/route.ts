import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { action, notes } = body;

    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (action === 'confirm_payment') {
      booking.paymentStatus = 'PAYMENT CONFIRMED';
      booking.bookingStatus = 'confirmed';
    } else if (action === 'cancel_booking') {
      booking.paymentStatus = 'CANCELLED';
      booking.bookingStatus = 'cancelled';
    } else if (action === 'mark_failed') {
      booking.paymentStatus = 'PAYMENT FAILED';
    } else if (action === 'refund') {
      booking.paymentStatus = 'REFUND PROCESSING';
    } else if (action === 'refund_complete') {
      booking.paymentStatus = 'REFUNDED';
      booking.bookingStatus = 'refunded';
    }

    if (notes) {
      booking.adminNotes = notes;
    }

    await booking.save();

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
