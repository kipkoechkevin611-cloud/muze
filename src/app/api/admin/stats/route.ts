import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'published' });
    const totalBookings = await Booking.countDocuments();
    const pendingPayments = await Booking.countDocuments({ paymentStatus: 'PENDING PAYMENT' });
    const confirmedPayments = await Booking.countDocuments({ paymentStatus: 'PAYMENT CONFIRMED' });
    const cancelledBookings = await Booking.countDocuments({ paymentStatus: 'CANCELLED' });

    const confirmedBookings = await Booking.find({ paymentStatus: 'PAYMENT CONFIRMED' });
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        activeEvents,
        totalBookings,
        pendingPayments,
        confirmedPayments,
        cancelledBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
