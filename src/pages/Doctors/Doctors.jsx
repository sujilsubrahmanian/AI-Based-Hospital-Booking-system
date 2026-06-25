import { useState } from 'react'
import { Link } from 'react-router-dom'
import { doctors } from '../../assets/data/doctors'

const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 'Gynecologist']

const Doctors = () => {
  const [selected, setSelected] = useState('All')
  const [query, setQuery]       = useState('')

  const filtered = doctors.filter((d) => {
    const matchSpec  = selected === 'All' || d.specialty === selected
    const matchQuery = d.name.toLowerCase().includes(query.toLowerCase())
    return matchSpec && matchQuery
  })

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Find a Doctor</h2>
        <p className="text-gray-500 mb-8">Search by name or filter by specialty.</p>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-full mb-6 focus:outline-none focus:border-blue-500"
        />

        {/* Specialty filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                ${selected === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Doctor cards */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No doctors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="w-full h-48 bg-blue-50 flex items-center justify-center text-6xl">
                  <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-white text-xl font-bold">
                    {doc.name ? doc.name.charAt(4).toUpperCase() : 'U' }
                    </div>
                </div>
                <div className="p-4">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {doc.specialty}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-2">{doc.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-sm">⭐ {doc.rating}</span>
                    <span className="text-gray-400 text-xs">({doc.totalRating})</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{doc.experience} years experience</p>
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="mt-4 block text-center py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Doctors