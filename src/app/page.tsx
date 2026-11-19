'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { events, getFeaturedEvent, type Event } from '@/data/events';

export default function Home() {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load static data
    setFeaturedEvent(getFeaturedEvent() || null);
    setAllEvents(events);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLowestPrice = (ticketCategories: any[]) => {
    if (!ticketCategories || ticketCategories.length === 0) return 0;
    return Math.min(...ticketCategories.map((tc) => tc.price));
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

      {/* Hero Section with Featured Event */}
      {featuredEvent && (
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  FEATURED EVENT
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{featuredEvent.name}</h1>
                <p className="text-xl mb-6 text-blue-100">{featuredEvent.description}</p>
                <div className="space-y-2 mb-6">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(featuredEvent.date)}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredEvent.time}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {featuredEvent.venue}, {featuredEvent.location}
                  </p>
                </div>
                <p className="text-2xl font-bold mb-6">
                  From KES {getLowestPrice(featuredEvent.ticketCategories).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/events/${featuredEvent.slug}`}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    BUY TICKET
                  </Link>
                  <Link
                    href="/events"
                    className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    VIEW ALL EVENTS
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src={featuredEvent.posterImage}
                  alt={featuredEvent.name}
                  className="rounded-lg shadow-2xl w-full object-cover"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Listing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          
          {allEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/events/${event.slug}`}>
                    <img
                      src={event.posterImage}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                      {event.category}
                    </span>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-black">{event.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{formatDate(event.date)}</p>
                    <p className="text-gray-600 text-sm mb-2">{event.venue}</p>
                    <p className="text-blue-600 font-bold mb-3">
                      From KES {getLowestPrice(event.ticketCategories).toLocaleString()}
                    </p>
                    <Link
                      href={`/events/${event.slug}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      BUY TICKET
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Good to Know Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Good to Know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">How Buying Tickets Works</h3>
              <p className="text-gray-600 text-sm">
                Browse our events, select your preferred event, choose your ticket category, and complete the booking process. You&apos;ll receive a unique booking reference.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Payment Instructions</h3>
              <p className="text-gray-600 text-sm">
                After booking, you&apos;ll receive a payment prompt on your M-Pesa number. Follow the instructions on your phone to complete payment. The administrator will verify and confirm your payment.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Refunds and Changes</h3>
              <p className="text-gray-600 text-sm">
                Refund requests are handled on a case-by-case basis. Please contact our support team for any changes or refund inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
