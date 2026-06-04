import { useParams, Link } from 'react-router-dom'
import { doctors } from '../../assets/data/doctors'

const DoctorDetails = () => {
  const { id } = useParams()
  const doctor  = doctors.find((d) => d.id === parseInt(id))

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-xl">Doctor not found.</p>
        <Link to="/doctors" className="text-blue-600 mt-4 inline-block hover:underline">
          ← Back to Doctors
        </Link>
      </div>
    )
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">

        <Link to="/doctors" className="text-blue-600 text-sm hover:underline mb-6 inline-block">
          ← Back to Doctors
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-8">

          {/* Photo */}
          <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center text-7xl flex-shrink-0 mx-auto md:mx-0">
            👨‍⚕️
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              {doctor.specialty}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{doctor.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-500">⭐ {doctor.rating}</span>
              <span className="text-gray-400 text-sm">({doctor.totalRating} reviews)</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{doctor.bio}</p>

            {/* Stats row */}
            <div className="flex gap-6 flex-wrap mb-6">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{doctor.experience}+</p>
                <p className="text-gray-500 text-xs">Years Exp.</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{doctor.totalRating}+</p>
                <p className="text-gray-500 text-xs">Patients</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{doctor.rating}</p>
                <p className="text-gray-500 text-xs">Rating</p>
              </div>
            </div>

            {/* Booking button — will be wired to real booking in Phase 5 */}
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorDetails