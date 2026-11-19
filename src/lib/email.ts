import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminBookingEmail(bookingData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@muze-events.com',
      to: process.env.ADMIN_EMAIL || '',
      subject: `NEW EVENT BOOKING - ${bookingData.bookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Event Booking</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #0ea5e9; }
            .label { font-weight: bold; color: #555; }
            .value { margin-bottom: 10px; }
            .reference { font-size: 24px; font-weight: bold; color: #0ea5e9; background: #e0f2fe; padding: 10px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NEW EVENT BOOKING RECEIVED</h1>
          </div>
          
          <div class="reference">
            ${bookingData.bookingReference}
          </div>

          <div class="section">
            <h2>BOOKING INFORMATION</h2>
            <p><span class="label">Booking Reference:</span> <span class="value">${bookingData.bookingReference}</span></p>
            <p><span class="label">Booking Date:</span> <span class="value">${new Date(bookingData.createdAt).toLocaleString()}</span></p>
            <p><span class="label">Booking Status:</span> <span class="value">${bookingData.paymentStatus}</span></p>
          </div>

          <div class="section">
            <h2>CUSTOMER INFORMATION</h2>
            <p><span class="label">Full Name:</span> <span class="value">${bookingData.customerName}</span></p>
            <p><span class="label">Phone Number:</span> <span class="value">${bookingData.customerPhone}</span></p>
            <p><span class="label">Email Address:</span> <span class="value">${bookingData.customerEmail}</span></p>
            <p><span class="label">M-Pesa Prompt Number:</span> <span class="value">${bookingData.promptNumber}</span></p>
          </div>

          <div class="section">
            <h2>EVENT INFORMATION</h2>
            <p><span class="label">Event Name:</span> <span class="value">${bookingData.eventName}</span></p>
            <p><span class="label">Event Date:</span> <span class="value">${new Date(bookingData.eventDate).toLocaleDateString()}</span></p>
            <p><span class="label">Event Time:</span> <span class="value">${bookingData.eventTime || 'N/A'}</span></p>
            <p><span class="label">Venue:</span> <span class="value">${bookingData.eventVenue}</span></p>
            <p><span class="label">Location:</span> <span class="value">${bookingData.eventLocation || 'N/A'}</span></p>
          </div>

          <div class="section">
            <h2>TICKET INFORMATION</h2>
            <p><span class="label">Ticket Category:</span> <span class="value">${bookingData.ticketCategory}</span></p>
            <p><span class="label">Number of Tickets:</span> <span class="value">${bookingData.quantity}</span></p>
            <p><span class="label">Price per Ticket:</span> <span class="value">KES ${bookingData.pricePerTicket.toLocaleString()}</span></p>
            <p><span class="label">Total Amount:</span> <span class="value">KES ${bookingData.totalAmount.toLocaleString()}</span></p>
          </div>

          <div class="section">
            <h2>PAYMENT INFORMATION</h2>
            <p><span class="label">Payment Status:</span> <span class="value">${bookingData.paymentStatus}</span></p>
            <p><span class="label">Prompt Number:</span> <span class="value">${bookingData.promptNumber}</span></p>
            <p><span class="label">Booking Reference:</span> <span class="value">${bookingData.bookingReference}</span></p>
          </div>

          <p style="text-align: center; margin-top: 30px; color: #666;">
            Please verify the payment independently and confirm it in the admin dashboard.
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Admin email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Admin email error:', error);
    return { success: false, error };
  }
}

export async function sendCustomerAcknowledgementEmail(bookingData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@muze-events.com',
      to: bookingData.customerEmail,
      subject: `YOUR EVENT BOOKING HAS BEEN RECEIVED - ${bookingData.bookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Acknowledgement</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #0ea5e9; }
            .label { font-weight: bold; color: #555; }
            .value { margin-bottom: 10px; }
            .reference { font-size: 24px; font-weight: bold; color: #0ea5e9; background: #e0f2fe; padding: 10px; text-align: center; margin: 20px 0; }
            .message { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BOOKING ACKNOWLEDGEMENT</h1>
          </div>
          
          <p>Dear ${bookingData.customerName},</p>
          
          <div class="reference">
            ${bookingData.bookingReference}
          </div>

          <div class="section">
            <h2>BOOKING DETAILS</h2>
            <p><span class="label">Event:</span> <span class="value">${bookingData.eventName}</span></p>
            <p><span class="label">Event Date:</span> <span class="value">${new Date(bookingData.eventDate).toLocaleDateString()}</span></p>
            <p><span class="label">Venue:</span> <span class="value">${bookingData.eventVenue}</span></p>
            <p><span class="label">Ticket Category:</span> <span class="value">${bookingData.ticketCategory}</span></p>
            <p><span class="label">Quantity:</span> <span class="value">${bookingData.quantity}</span></p>
            <p><span class="label">Total Amount:</span> <span class="value">KES ${bookingData.totalAmount.toLocaleString()}</span></p>
            <p><span class="label">M-Pesa Prompt Number:</span> <span class="value">${bookingData.promptNumber}</span></p>
            <p><span class="label">Booking Status:</span> <span class="value">${bookingData.paymentStatus}</span></p>
          </div>

          <div class="message">
            <h3>IMPORTANT</h3>
            <p>Thank you for booking with us. Your booking request has been received successfully.</p>
            <p>Please wait for a payment prompt on the M-Pesa phone number you provided. Once you receive the prompt, follow the instructions on your phone to complete your payment.</p>
            <p>Your booking is currently awaiting payment confirmation.</p>
          </div>

          <p style="text-align: center; margin-top: 30px; color: #666;">
            Please keep your booking reference for future communication.
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Customer email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Customer email error:', error);
    return { success: false, error };
  }
}
