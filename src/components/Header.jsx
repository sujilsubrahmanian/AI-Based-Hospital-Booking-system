import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navLinks = [
  { path: '/',         display: 'Home'     },
  { path: '/doctors',  display: 'Doctors'  },
  { path: '/services', display: 'Services' },
  { path: '/contact',  display: 'Contact'  },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MediBook
        </Link>

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

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
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

      {/* Mobile Menu Dropdown */}
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
          <Link to="/login"    onClick={() => setMenuOpen(false)} className="text-blue-600 font-medium">Login</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-blue-600 font-medium">Register</Link>
        </div>
      )}
    </header>
  )
}

export default Header