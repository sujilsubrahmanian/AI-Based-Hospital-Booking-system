import { Link } from 'react-router-dom'
import { doctors } from '../assets/data/doctors'
import { faqs }    from '../assets/data/faqs'
import { useState } from 'react'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DoctorSection />
      <FaqSection />
      <CtaSection />
    </div>
  )
}

/* ── Hero ── */
const HeroSection = () => (
  <section className="bg-gradient-to-r from-blue-50 to-white py-20">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
          We help people <br />
          <span className="text-blue-600">live a healthier</span> &amp; longer life.
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Book appointments with top-rated doctors in your area. Fast, easy, and reliable.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/doctors"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
          >
            Book Appointment
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition"
          >
            Our Services
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-10 flex-wrap">
          {[
            { num: '30+', label: 'Years of experience' },
            { num: '15+', label: 'Clinic locations' },
            { num: '100%', label: 'Patient satisfaction' },
          ].map((s) => (
            <div key={s.label}>
              <h3 className="text-2xl font-bold text-blue-600">{s.num}</h3>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hero image placeholder */}
      <div className="flex-1 flex justify-center">
        <div className="w-72 h-72 md:w-96 md:h-96 bg-blue-100 rounded-full flex items-center justify-center text-blue-300 text-6xl">
          🏥
        </div>
      </div>
    </div>
  </section>
)

/* ── Features ── */
const features = [
  { icon: '🔍', title: 'Find a Doctor',     desc: 'Search by specialty, name, or location to find the right doctor for you.' },
  { icon: '📅', title: 'Book Instantly',    desc: 'Choose your preferred time slot and confirm your appointment in seconds.' },
  { icon: '💬', title: '24/7 Support',      desc: 'Our team is always available to help you with any questions or concerns.' },
]

const FeaturesSection = () => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Providing the best medical services
      </h2>
      <p className="text-center text-gray-500 mb-12">
        World-class care for everyone. Our health system offers unmatched, expert care.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition text-center">
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── Doctors preview ── */
const DoctorSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Our top doctors</h2>
      <p className="text-center text-gray-500 mb-12">
        Meet our experienced and highly qualified medical professionals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {doctors.slice(0, 3).map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="w-full h-48 bg-blue-50 flex items-center justify-center text-6xl">
              👨‍⚕️
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{doc.name}</h3>
              <p className="text-blue-600 text-sm mb-1">{doc.specialty}</p>
              <p className="text-yellow-500 text-sm">⭐ {doc.rating} ({doc.totalRating} reviews)</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          to="/doctors"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
        >
          See all doctors →
        </Link>
      </div>
    </div>
  </section>
)

/* ── FAQ ── */
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Frequently asked questions
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Here are some common questions from our patients.
        </p>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition"
              >
                {faq.question}
                <span className="text-blue-600 text-xl">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">
                  {faq.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ── */
const CtaSection = () => (
  <section className="py-20 bg-blue-600 text-white text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
    <p className="mb-8 text-blue-100">
      Book your appointment today and take the first step toward better health.
    </p>
    <Link
      to="/register"
      className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition"
    >
      Create a free account
    </Link>
  </section>
)

export default Home