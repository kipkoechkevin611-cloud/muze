import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { sendAdminBookingEmail, sendCustomerAcknowledgementEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      promptNumber,
      eventId,
      ticketCategory,
      quantity,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !customerEmail || !promptNumber || !eventId || !ticketCategory || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^(07|01|2547|2541)\d{8}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Fetch event and ticket category
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const ticketCat = event.ticketCategories.find(
      (tc: any) => tc.name === ticketCategory && tc.active
    );

    if (!ticketCat) {
      return NextResponse.json(
        { success: false, error: 'Ticket category not found or inactive' },
        { status: 404 }
      );
    }

    // Check availability
    if (ticketCat.availableQuantity - ticketCat.soldQuantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Not enough tickets available' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const pricePerTicket = ticketCat.price;
    const totalAmount = pricePerTicket * quantity;

    // Generate unique booking reference
    const prefix = process.env.BOOKING_REFERENCE_PREFIX || 'MUZ';
    const year = new Date().getFullYear();
    const count = await Booking.countDocuments();
    const referenceNumber = String(count + 1).padStart(5, '0');
    const bookingReference = `${prefix}-${year}-${referenceNumber}`;

    // Create booking
    const booking = await Booking.create({
      bookingReference,
      customerName,
      customerPhone,
      customerEmail,
      promptNumber,
      eventId,
      eventName: event.name,
      eventDate: event.date,
      eventVenue: event.venue,
      ticketCategory,
      quantity,
      pricePerTicket,
      totalAmount,
      paymentStatus: 'PENDING PAYMENT',
      bookingStatus: 'pending',
      emailNotificationStatus: 'pending',
      customerEmailStatus: 'pending',
    });

    // Update ticket availability
    ticketCat.soldQuantity += quantity;
    await event.save();

    // Send emails (don't fail booking if emails fail)
    const emailPromises = [
      sendAdminBookingEmail({
        ...booking.toObject(),
        eventTime: event.time,
        eventLocation: event.location,
      }),
      sendCustomerAcknowledgementEmail(booking.toObject()),
    ];

    const emailResults = await Promise.allSettled(emailPromises);

    // Update email status
    if (emailResults[0].status === 'fulfilled' && emailResults[0].value.success) {
      booking.emailNotificationStatus = 'sent';
    } else {
      booking.emailNotificationStatus = 'failed';
    }

    if (emailResults[1].status === 'fulfilled' && emailResults[1].value.success) {
      booking.customerEmailStatus = 'sent';
    } else {
      booking.customerEmailStatus = 'failed';
    }

    await booking.save();

    return NextResponse.json({
      success: true,
      booking: {
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        eventName: booking.eventName,
        eventDate: booking.eventDate,
        eventVenue: booking.eventVenue,
        ticketCategory: booking.ticketCategory,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        promptNumber: booking.promptNumber,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    // Handle duplicate booking reference
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate booking. Please try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
