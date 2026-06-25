import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore'

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  approved:  'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'bookings'))
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
        setBookings(data)
      } catch (err) {
        console.error('Error fetching bookings:', err)
      }
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus })
      setBookings((prev) =>
        prev.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b)
      )
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  if (loading) return <p className="text-gray-500 py-10 text-center">Loading bookings...</p>

  return (
    <div>
      {/* Stats row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'1.5rem'}}>
        {[
          { label: 'Total',     value: bookings.length,                                          color: 'text-gray-800'  },
          { label: 'Pending',   value: bookings.filter(b => b.status === 'pending').length,   color: 'text-yellow-600' },
          { label: 'Approved',  value: bookings.filter(b => b.status === 'approved').length,  color: 'text-green-600'  },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-500'    },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition capitalize
              ${filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No bookings found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">{booking.doctorName}</p>
                <p className="text-blue-600 text-sm">{booking.specialty}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Patient: {booking.userName} ({booking.userEmail})
                </p>
                <p className="text-gray-500 text-xs">
                  📅 {booking.date} &nbsp; 🕐 {booking.time}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                  {booking.status}
                </span>
                <div className="flex gap-2">
                  {booking.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'approved')}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                    >
                      Approve
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="text-xs px-3 py-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBookings