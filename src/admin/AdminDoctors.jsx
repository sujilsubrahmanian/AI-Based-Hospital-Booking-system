import { doctors } from '../assets/data/doctors'
import { useState } from 'react'

const AdminDoctors = () => {
  const [search, setSearch] = useState('')

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 w-64"
        />
        <span className="text-sm text-gray-500">{filtered.length} doctors</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem'}}>
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-3">
              👨‍⚕️
            </div>
            <p className="font-semibold text-gray-800">{doc.name}</p>
            <p className="text-blue-600 text-sm">{doc.specialty}</p>
            <p className="text-gray-500 text-xs mt-1">{doc.experience} years experience</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500 text-xs">⭐ {doc.rating}</span>
              <span className="text-gray-400 text-xs">({doc.totalRating} reviews)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDoctors