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
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    // Load event from static data
    const eventData = getEventBySlug(params.slug as string);
    if (eventData) {
      setEvent(eventData);
      // Select first available ticket by default
      if (eventData.ticketCategories.length > 0) {
        const firstAvailable = eventData.ticketCategories.find(
          (tc) => tc.availableQuantity > 0
        );
        if (firstAvailable) {
          setSelectedTicket(firstAvailable.name);
        }
      }
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

  const getSelectedTicketCategory = () => {
    if (!event || !selectedTicket) return null;
    return event.ticketCategories.find((tc) => tc.name === selectedTicket);
  };

  const selectedTicketCategory = getSelectedTicketCategory();
  const availableQuantity = selectedTicketCategory
    ? selectedTicketCategory.availableQuantity
    : 0;
  const totalPrice = selectedTicketCategory ? selectedTicketCategory.price * quantity : 0;

  const handleBookTicket = () => {
    if (!selectedTicket || quantity < 1 || quantity > availableQuantity) {
      alert('Please select a valid ticket and quantity');
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
              
              <div className="space-y-3 mb-6">
                {event.ticketCategories.map((ticket) => {
                  const available = ticket.availableQuantity;
                  const isAvailable = available > 0;
                  
                  return (
                    <div
                      key={ticket.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTicket === ticket.name
                          ? 'border-blue-600 bg-blue-50'
                          : isAvailable
                          ? 'border-gray-300 hover:border-blue-400'
                          : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && setSelectedTicket(ticket.name)}
                    >
                      <div className="flex justify-between items-start">
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
                    </div>
                  );
                })}
              </div>

              {selectedTicketCategory && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-semibold text-black">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                        className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      KES {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleBookTicket}
                    disabled={quantity < 1 || quantity > availableQuantity}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    BOOK TICKET
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
                ticketCategory={selectedTicket}
                quantity={quantity}
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
  ticketCategory,
  quantity,
  totalPrice,
  onClose,
}: {
  event: Event;
  ticketCategory: string;
  quantity: number;
  totalPrice: number;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    promptNumber: '',
    notes: '',
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

      // Simulate booking - redirect to confirmation
      router.push(`/confirmation?reference=${bookingReference}&event=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.date)}&venue=${encodeURIComponent(event.venue)}&ticket=${encodeURIComponent(ticketCategory)}&quantity=${quantity}&total=${totalPrice}&prompt=${encodeURIComponent(formData.promptNumber)}`);
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
          <p><span className="text-gray-700">Ticket:</span> {ticketCategory}</p>
          <p><span className="text-gray-700">Quantity:</span> {quantity}</p>
          <p><span className="text-gray-700">Price per ticket:</span> KES {(totalPrice / quantity).toLocaleString()}</p>
          <p className="font-bold text-lg text-black"><span className="text-gray-700">Total:</span> KES {totalPrice.toLocaleString()}</p>
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

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
          />
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
