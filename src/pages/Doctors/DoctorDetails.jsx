import { useParams, Link } from 'react-router-dom'
import { doctors } from '../../assets/data/doctors'
import SidePanel from '../../components/doctors/SidePanel'

const DoctorDetails = () => {
  const { id } = useParams()
  const doctor = doctors.find((d) => d.id === parseInt(id))

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
      <div className="max-w-6xl mx-auto px-4">

        <Link to="/doctors" className="text-blue-600 text-sm hover:underline mb-6 inline-block">
          ← Back to Doctors
        </Link>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem'}}>

          {/* Left — Doctor info */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div style={{display:'flex', gap:'1.5rem', alignItems:'flex-start'}}>
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  <div className="text-gray-300">
                    🖼️
                    Image
                  </div>
                </div>
                <div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {doctor.specialty}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-1">{doctor.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-500 text-sm">⭐ {doctor.rating}</span>
                    <span className="text-gray-400 text-sm">({doctor.totalRating} reviews)</span>
                  </div>
                  <div style={{display:'flex', gap:'1.5rem'}}>
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
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{doctor.bio}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Education</h3>
                <ul style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  {[
                    { degree: 'MBBS',       institute: 'Govt. Medical College, Kerala'  },
                    { degree: 'MD / MS',    institute: 'AIIMS, New Delhi'               },
                    { degree: 'Fellowship', institute: 'International Medical Institute' },
                  ].map((e, i) => (
                    <li key={i} style={{display:'flex', gap:'0.75rem'}}>
                      <span className="text-blue-600">🎓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{e.degree}</p>
                        <p className="text-xs text-gray-500">{e.institute}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right — SidePanel */}
          <div>
            <SidePanel doctor={doctor} />
          </div>

        </div>
      </div>
    </section>
  )
}

export default DoctorDetails