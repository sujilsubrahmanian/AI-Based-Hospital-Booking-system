import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const AdminPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setPatients(data)
      } catch (err) {
        console.error('Error fetching patients:', err)
      }
      setLoading(false)
    }
    fetchPatients()
  }, [])

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <p className="text-gray-500 py-10 text-center">Loading patients...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 w-72"
        />
        <span className="text-sm text-gray-500">{filtered.length} patients</span>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No patients found.</p>
        ) : (
          filtered.map((patient) => (
            <div key={patient.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {patient.name ? patient.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className="text-gray-500 text-xs">{patient.email}</p>
                  <p className="text-gray-400 text-xs">{patient.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                  ${patient.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-600'
                  }`}>
                  {patient.role || 'patient'}
                </span>
                <p className="text-gray-400 text-xs mt-1">
                  Joined: {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminPatients