import { useState } from 'react'
import AdminBookings from './AdminBookings'
import AdminDoctors  from './AdminDoctors'
import AdminPatients from './AdminPatients'

const tabs = ['Bookings', 'Doctors', 'Patients']

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Bookings')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          🏥 Admin Dashboard
        </h1>
        <span className="text-sm text-gray-500">MediBook Control Panel</span>
      </div>

      {/* Tab navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Bookings'  && <AdminBookings  />}
        {activeTab === 'Doctors'   && <AdminDoctors   />}
        {activeTab === 'Patients'  && <AdminPatients  />}
      </div>
    </div>
  )
}

export default AdminDashboard