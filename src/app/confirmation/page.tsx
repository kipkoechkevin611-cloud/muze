'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Booking {
  bookingReference: string;
  customerName: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  ticketCategory: string;
  quantity: number;
  totalAmount: number;
  promptNumber: string;
  paymentStatus: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference = searchParams.get('reference');
    const event = searchParams.get('event');
    const date = searchParams.get('date');
    const venue = searchParams.get('venue');
    const ticket = searchParams.get('ticket');
    const quantity = searchParams.get('quantity');
    const total = searchParams.get('total');
    const prompt = searchParams.get('prompt');
    
    if (reference) {
      setBooking({
        bookingReference: reference,
        customerName: 'Customer',
        eventName: event || 'Your selected event',
        eventDate: date || new Date().toISOString(),
        eventVenue: venue || 'Event venue',
        ticketCategory: ticket || 'Selected ticket',
        quantity: quantity ? parseInt(quantity) : 1,
        totalAmount: total ? parseInt(total) : 0,
        promptNumber: prompt || 'Your provided number',
        paymentStatus: 'PENDING PAYMENT',
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">BOOKING RECEIVED SUCCESSFULLY!</h1>
            <p className="text-gray-800">Thank you for choosing us.</p>
          </div>

          {/* Booking Reference */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center mb-8">
            <p className="text-sm text-gray-600 mb-2">YOUR BOOKING REFERENCE:</p>
            <p className="text-3xl font-bold text-blue-600">{booking?.bookingReference}</p>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">Event:</span>
              <span className="font-semibold text-black">{booking?.eventName || 'Your selected event'}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">Event Date:</span>
              <span className="font-semibold text-black">{formatDate(booking?.eventDate || '')}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">Venue:</span>
              <span className="font-semibold text-black">{booking?.eventVenue || 'Event venue'}</span>
            </div>
            <div className="py-3 border-b">
              <span className="text-gray-800 block mb-2">Tickets:</span>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800 whitespace-pre-line">{booking?.ticketCategory || 'Selected ticket'}</p>
              </div>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">Total Quantity:</span>
              <span className="font-semibold text-black">{booking?.quantity || 0}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">Total Amount:</span>
              <span className="font-bold text-xl text-blue-600">
                KES {booking?.totalAmount?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-800">M-Pesa Prompt Number:</span>
              <span className="font-semibold text-black">{booking?.promptNumber || 'Your provided number'}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-800">Booking Status:</span>
              <span className="font-bold text-yellow-600">{booking?.paymentStatus}</span>
            </div>
          </div>

          {/* Important Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p className="mb-2">
                    Thank you for your booking. Please wait for a payment prompt on the phone number you provided. Once you receive the prompt, follow the instructions on your phone to complete your payment.
                  </p>
                  <p>
                    Your booking is awaiting payment confirmation. Please keep your booking reference for future communication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/events"
              className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse More Events
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
