import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const MyAccount = () => {
  const { user } = useAuth()

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user?.name || 'User'}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mt-1 inline-block capitalize">
                {user?.role || 'patient'}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            {[
              { label: 'Full Name',    value: user?.name  || '—' },
              { label: 'Email',        value: user?.email || '—' },
              { label: 'Phone',        value: user?.phone || '—' },
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-700">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              to="/user/profile/bookings"
              className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              View My Bookings
            </Link>
            <Link
              to="/doctors"
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyAccount