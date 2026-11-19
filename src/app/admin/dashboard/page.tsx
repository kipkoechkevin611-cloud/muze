'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  pendingPayments: number;
  confirmedPayments: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface Booking {
  _id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  promptNumber: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  ticketCategory: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch bookings
      const bookingsRes = await fetch('/api/admin/bookings');
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleBookingAction = async (bookingId: string, action: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery) ||
      booking.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || booking.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total Events" value={stats.totalEvents} color="blue" />
              <StatCard label="Active Events" value={stats.activeEvents} color="green" />
              <StatCard label="Total Bookings" value={stats.totalBookings} color="purple" />
              <StatCard label="Pending Payments" value={stats.pendingPayments} color="yellow" />
              <StatCard label="Confirmed Payments" value={stats.confirmedPayments} color="green" />
              <StatCard label="Cancelled Bookings" value={stats.cancelledBookings} color="red" />
              <StatCard
                label="Total Revenue"
                value={`KES ${stats.totalRevenue.toLocaleString()}`}
                color="blue"
              />
            </div>

            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Reference</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id} className="border-b">
                        <td className="py-3 px-4">{booking.bookingReference}</td>
                        <td className="py-3 px-4">{booking.customerName}</td>
                        <td className="py-3 px-4">{booking.eventName}</td>
                        <td className="py-3 px-4">KES {booking.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.paymentStatus === 'PAYMENT CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : booking.paymentStatus === 'PENDING PAYMENT'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex flex-wrap gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING PAYMENT">Pending Payment</option>
                  <option value="PAYMENT CONFIRMED">Payment Confirmed</option>
                  <option value="PAYMENT FAILED">Payment Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUND PROCESSING">Refund Processing</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Reference</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Phone</th>
                      <th className="text-left py-3 px-4">Prompt #</th>
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Tickets</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b">
                        <td className="py-3 px-4 font-semibold">{booking.bookingReference}</td>
                        <td className="py-3 px-4">
                          <div>{booking.customerName}</div>
                          <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                        </td>
                        <td className="py-3 px-4">{booking.customerPhone}</td>
                        <td className="py-3 px-4">{booking.promptNumber}</td>
                        <td className="py-3 px-4">
                          <div>{booking.eventName}</div>
                          <div className="text-xs text-gray-500">{new Date(booking.eventDate).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{booking.ticketCategory}</div>
                          <div className="text-xs text-gray-500">Qty: {booking.quantity}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          KES {booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.paymentStatus === 'PAYMENT CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : booking.paymentStatus === 'PENDING PAYMENT'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {booking.paymentStatus === 'PENDING PAYMENT' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'confirm_payment')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-1"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => handleBookingAction(booking._id, 'cancel_booking')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
      <p className="text-gray-700 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses]} text-white p-3 rounded`}>
        {value}
      </p>
    </div>
  );
}
