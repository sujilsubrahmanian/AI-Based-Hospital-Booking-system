import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import  useAuth from '../hooks/useAuth'

const navLinks = [
  { path: '/',         display: 'Home'     },
  { path: '/doctors',  display: 'Doctors'  },
  { path: '/services', display: 'Services' },
  { path: '/contact',  display: 'Contact'  },
]

const Header = () => {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">MediBook</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                  : 'text-gray-600 hover:text-blue-600 transition-colors duration-200'
              }
              end={link.path === '/'}
            >
              {link.display}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.name || 'My Account'}
                </span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-md py-2 z-50">
                  <Link
                    to="/user/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/user/profile/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Bookings
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }
              end={link.path === '/'}
            >
              {link.display}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link to="/user/profile"          onClick={() => setMenuOpen(false)} className="text-gray-700">My Profile</Link>
              <Link to="/user/profile/bookings" onClick={() => setMenuOpen(false)} className="text-gray-700">My Bookings</Link>
              <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="text-blue-600 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-blue-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header