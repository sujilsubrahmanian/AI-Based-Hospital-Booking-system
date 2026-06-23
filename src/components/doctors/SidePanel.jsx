import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { timeSlots } from '../../assets/data/doctors'

const SidePanel = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedSlots,  setBookedSlots]  = useState([])
  const [loading,      setLoading]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState('')
  const [currentUser,  setCurrentUser]  = useState(null)

  const navigate = useNavigate()

  // Directly use Firebase auth instead of context
  useEffect(() => {
    const auth = getAuth()
    const user = auth.currentUser
    console.log('SidePanel auth.currentUser:', user)
    setCurrentUser(user)
  }, [])

  const handleDateChange = async (e) => {
    const date = e.target.value
    setSelectedDate(date)
    setSelectedTime('')
    setError('')
    if (!date) return
    try {
      const q = query(
        collection(db, 'bookings'),
        where('doctorId', '==', doctor.id),
        where('date',     '==', date)
      )
      const snapshot = await getDocs(q)
      const taken = snapshot.docs
        .map((d) => d.data())
        .filter((d) => d.status !== 'cancelled')
        .map((d) => d.time)
      setBookedSlots(taken)
    } catch (err) {
      console.error('Error fetching slots:', err)
    }
  }

  const handleBooking = async () => {
    // Re-check auth at booking time
    const auth = getAuth()
    const user = auth.currentUser

    console.log('Booking attempt, user:', user)

    if (!user) {
      navigate('/login')
      return
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and a time slot.')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (selectedDate < today) {
      setError('Please select a future date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await addDoc(collection(db, 'bookings'), {
        doctorId:   doctor.id,
        doctorName: doctor.name,
        specialty:  doctor.specialty,
        userId:     user.uid,
        userName:   user.displayName || user.email,
        userEmail:  user.email,
        date:       selectedDate,
        time:       selectedTime,
        status:     'pending',
        bookedAt:   new Date().toISOString(),
      })
      setSuccess(true)
      setSelectedDate('')
      setSelectedTime('')
      setBookedSlots([])
    } catch (err) {
      setError('Booking failed. Please try again.')
      console.error('Booking error:', err)
    }
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">Consultation fee</p>
        <p className="text-blue-600 font-bold text-lg">₹500</p>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">✅</div>
          <p className="font-semibold text-gray-800 mb-1">Booking Confirmed!</p>
          <p className="text-gray-500 text-sm mb-4">Your appointment has been booked successfully.</p>
          <button
            onClick={() => navigate('/user/profile/bookings')}
            className="w-full py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>
          <button
            onClick={() => setSuccess(false)}
            className="w-full mt-2 py-2 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition"
          >
            Book Another Slot
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {selectedDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time)
                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-xs rounded-lg border transition
                        ${isBooked
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          {selectedDate && selectedTime && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
              <p className="text-blue-700 font-medium">Booking summary</p>
              <p className="text-blue-600 text-xs mt-1">📅 {selectedDate}</p>
              <p className="text-blue-600 text-xs">🕐 {selectedTime}</p>
              <p className="text-blue-600 text-xs">👨‍⚕️ {doctor.name}</p>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Booking...' : currentUser ? 'Book Appointment' : 'Login to Book'}
          </button>

          {!currentUser && (
            <p className="text-center text-xs text-gray-400 mt-2">
              You need to be logged in to book an appointment.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default SidePanel
