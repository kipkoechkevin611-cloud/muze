'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEventBySlug, type Event } from '@/data/events';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    // Load event from static data
    const eventData = getEventBySlug(params.slug as string);
    if (eventData) {
      setEvent(eventData);
      // Initialize ticket quantities to 0
      const initialQuantities: Record<string, number> = {};
      eventData.ticketCategories.forEach((tc) => {
        initialQuantities[tc.name] = 0;
      });
      setTicketQuantities(initialQuantities);
    }
    setLoading(false);
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    let total = 0;
    event.ticketCategories.forEach((tc) => {
      const qty = ticketQuantities[tc.name] || 0;
      total += tc.price * qty;
    });
    return total;
  };

  const getTotalQuantity = () => {
    return Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getSelectedTickets = () => {
    if (!event) return [];
    return event.ticketCategories
      .filter((tc) => ticketQuantities[tc.name] > 0)
      .map((tc) => ({
        name: tc.name,
        quantity: ticketQuantities[tc.name],
        price: tc.price,
        total: tc.price * ticketQuantities[tc.name],
      }));
  };

  const selectedTickets = getSelectedTickets();
  const totalPrice = getTotalPrice();
  const totalQuantity = getTotalQuantity();

  const handleBookTicket = () => {
    if (totalQuantity < 1) {
      alert('Please select at least one ticket');
      return;
    }
    setShowBookingForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Event Not Found</h1>
            <Link href="/events" className="text-blue-600 hover:underline">
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/events" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Image */}
          <div>
            <img
              src={event.posterImage}
              alt={event.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Event Details */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{event.name}</h1>
            
            <div className="space-y-3 mb-6">
              <p className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </p>
              <p className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </p>
              <p className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.venue}, {event.location}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 text-black">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Ticket Selection */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-black">Select Tickets</h2>
              
              <div className="space-y-4 mb-6">
                {event.ticketCategories.map((ticket) => {
                  const available = ticket.availableQuantity;
                  const isAvailable = available > 0;
                  const qty = ticketQuantities[ticket.name] || 0;
                  
                  return (
                    <div
                      key={ticket.name}
                      className={`p-4 border rounded-lg transition-colors ${
                        qty > 0
                          ? 'border-blue-600 bg-blue-50'
                          : isAvailable
                          ? 'border-gray-300 hover:border-blue-400'
                          : 'border-gray-200 bg-gray-100 opacity-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-black">{ticket.name}</h3>
                          {ticket.description && (
                            <p className="text-sm text-gray-700 mt-1">{ticket.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            KES {ticket.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {available} available
                          </p>
                        </div>
                      </div>
                      
                      {isAvailable && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (qty > 0) {
                                  setTicketQuantities({ ...ticketQuantities, [ticket.name]: qty - 1 });
                                }
                              }}
                              className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-black"
                              disabled={qty === 0}
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-semibold text-black">{qty}</span>
                            <button
                              onClick={() => {
                                if (qty < available) {
                                  setTicketQuantities({ ...ticketQuantities, [ticket.name]: qty + 1 });
                                }
                              }}
                              className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-black"
                              disabled={qty >= available}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalQuantity > 0 && (
                <div className="border-t pt-4 space-y-3">
                  {/* Selected Tickets Summary */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-black mb-3">Your Selection:</h3>
                    {selectedTickets.map((ticket) => (
                      <div key={ticket.name} className="flex justify-between text-sm mb-2">
                        <span className="text-gray-800">
                          {ticket.quantity}x {ticket.name}
                        </span>
                        <span className="font-semibold text-black">
                          KES {ticket.total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-black">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      KES {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleBookTicket}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    BOOK TICKETS ({totalQuantity})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Your Booking</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <BookingForm
                event={event}
                selectedTickets={selectedTickets}
                totalPrice={totalPrice}
                onClose={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function BookingForm({
  event,
  selectedTickets,
  totalPrice,
  onClose,
}: {
  event: Event;
  selectedTickets: Array<{ name: string; quantity: number; price: number; total: number }>;
  totalPrice: number;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    promptNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generate unique booking reference without database
      const prefix = 'MUZ';
      const year = new Date().getFullYear();
      const referenceNumber = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
      const bookingReference = `${prefix}-${year}-${referenceNumber}`;

      // Format selected tickets for email
      const ticketsSummary = selectedTickets.map(t => `${t.quantity}x ${t.name} (KES ${t.total.toLocaleString()})`).join(', ');

      // Send email notification
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingReference,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            promptNumber: formData.promptNumber,
            eventName: event.name,
            eventDate: event.date,
            eventVenue: event.venue,
            ticketCategory: ticketsSummary,
            quantity: selectedTickets.reduce((sum, t) => sum + t.quantity, 0),
            totalPrice,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email API error:', errorData);
          alert(`Email notification failed: ${errorData.error || 'Unknown error'}. Your booking is still confirmed.`);
          // Continue with booking even if email fails
        } else {
          const successData = await emailResponse.json();
          console.log('Email sent successfully:', successData);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        alert(`Email notification failed to send. Your booking is still confirmed.`);
        // Continue with booking even if email fails
      }

      // Redirect to confirmation
      router.push(`/confirmation?reference=${bookingReference}&event=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.date)}&venue=${encodeURIComponent(event.venue)}&ticket=${encodeURIComponent(ticketsSummary)}&quantity=${selectedTickets.reduce((sum, t) => sum + t.quantity, 0)}&total=${totalPrice}&prompt=${encodeURIComponent(formData.promptNumber)}`);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContactNumber = () => {
    setFormData((prev) => ({ ...prev, promptNumber: prev.customerPhone }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-semibold mb-3 text-black">Booking Summary</h3>
        <div className="space-y-2 text-sm text-gray-800">
          <p><span className="text-gray-700">Event:</span> {event.name}</p>
          <p><span className="text-gray-700">Date:</span> {formatDate(event.date)}</p>
          <p><span className="text-gray-700">Venue:</span> {event.venue}</p>
          <div className="border-t pt-2 mt-2">
            <p className="font-semibold text-black mb-2">Tickets:</p>
            {selectedTickets.map((ticket) => (
              <p key={ticket.name} className="text-gray-800">
                <span className="text-gray-700">{ticket.quantity}x {ticket.name}</span> - KES {ticket.total.toLocaleString()}
              </p>
            ))}
          </div>
          <p className="font-bold text-lg text-black mt-2"><span className="text-gray-700">Total:</span> KES {totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            M-Pesa Prompt Number *
          </label>
          <p className="text-xs text-gray-800 mb-1">
            Enter the M-Pesa phone number on which you expect to receive your payment prompt.
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              required
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              value={formData.promptNumber}
              onChange={(e) => setFormData({ ...formData, promptNumber: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
            />
            {formData.customerPhone && (
              <button
                type="button"
                onClick={handleCopyContactNumber}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Use Contact Number
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'PROCEED TO BOOKING'}
      </button>
    </form>
  );
}
