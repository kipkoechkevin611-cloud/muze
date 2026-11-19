import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = await request.json();
    const {
      bookingReference,
      customerName,
      customerEmail,
      customerPhone,
      promptNumber,
      eventName,
      eventDate,
      eventVenue,
      ticketCategory,
      quantity,
      totalPrice,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !eventName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'raicement33@gmail.com';
    const emailFrom = process.env.EMAIL_FROM || 'noreply@muze-events.com';

    await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      subject: `New Booking: ${bookingReference} - ${eventName}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Booking Reference:</strong> ${bookingReference}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Customer Phone:</strong> ${customerPhone}</p>
        <p><strong>Prompt Number:</strong> ${promptNumber}</p>
        <hr>
        <h3>Event Details</h3>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Venue:</strong> ${eventVenue}</p>
        <hr>
        <h3>Ticket Details</h3>
        <p><strong>Tickets:</strong></p>
        <p>${ticketCategory}</p>
        <p><strong>Total Quantity:</strong> ${quantity}</p>
        <p><strong>Total Amount:</strong> KES ${totalPrice.toLocaleString()}</p>
        <hr>
        <p><strong>Payment Status:</strong> PENDING PAYMENT</p>
        <p><em>Please verify payment and mark as confirmed.</em></p>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: emailFrom,
      to: customerEmail,
      subject: `Booking Confirmation: ${bookingReference} - ${eventName}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Thank you for your booking, ${customerName}!</p>
        <p><strong>Booking Reference:</strong> ${bookingReference}</p>
        <hr>
        <h3>Event Details</h3>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Venue:</strong> ${eventVenue}</p>
        <hr>
        <h3>Ticket Details</h3>
        <p><strong>Tickets:</strong></p>
        <p>${ticketCategory}</p>
        <p><strong>Total Amount:</strong> KES ${totalPrice.toLocaleString()}</p>
        <hr>
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">
          <h3>Important</h3>
          <p>Please wait for a payment prompt on the phone number you provided: <strong>${promptNumber}</strong></p>
          <p>Once you receive the prompt, follow the instructions on your phone to complete your payment.</p>
          <p>Your booking is awaiting payment confirmation. Please keep your booking reference for future communication.</p>
        </div>
        <hr>
        <p><strong>Payment Status:</strong> PENDING PAYMENT</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
