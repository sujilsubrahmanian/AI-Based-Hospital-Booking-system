import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, query, where,
  getDocs, doc, updateDoc, orderBy
} from 'firebase/firestore'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  approved:  'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
}

const MyBooking = () => {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const { user } = useAuth()

  const fetchBookings = async () => {
  setLoading(true)
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    )
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    // Sort by bookedAt in JS instead of Firestore
    data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    setBookings(data)
  } catch (err) {
    console.error('Error fetching bookings:', err)
  }
  setLoading(false)
}
  useEffect(() => {
    if (user) fetchBookings()
  }, [user])

  const handleCancel = async (bookingId) => {
    const confirm = window.confirm('Are you sure you want to cancel this appointment?')
    if (!confirm) return

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' })
      setBookings((prev) =>
        prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      )
    } catch (err) {
      console.error('Cancel failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your bookings...</p>
      </div>
    )
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h2>
        <p className="text-gray-500 text-sm mb-8">All your appointment history.</p>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-gray-600 font-medium mb-2">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Book an appointment with one of our doctors.
            </p>
            <Link
              to="/doctors"
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{booking.doctorName}</p>
                    <p className="text-blue-600 text-sm">{booking.specialty}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-xs">📅 {booking.date}</span>
                      <span className="text-gray-500 text-xs">🕐 {booking.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right — status + cancel */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Cancel appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyBooking