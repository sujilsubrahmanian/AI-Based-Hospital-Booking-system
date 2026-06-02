import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">MediBook</h2>
          <p className="text-sm leading-relaxed">
            Connecting patients with trusted doctors. Book appointments easily, anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/"         className="hover:text-white transition">Home</Link></li>
            <li><Link to="/doctors"  className="hover:text-white transition">Doctors</Link></li>
            <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
            <li><Link to="/contact"  className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>📍 123 Medical Lane, Kerala, India</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@medibook.com</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MediBook. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer