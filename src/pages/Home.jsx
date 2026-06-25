import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doctors } from '../assets/data/doctors'
import { faqs } from '../assets/data/faqs'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Icon = ({ d, circle, rect, line, poly, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {d     && <path d={d} />}
    {circle && <circle {...circle} />}
    {rect  && <rect  {...rect}  />}
    {line  && line.map((l, i) => <line key={i} {...l} />)}
    {poly  && <polyline points={poly} />}
  </svg>
)

const CalIcon   = () => <Icon rect={{ x:3,y:4,width:18,height:18,rx:2 }} line={[{x1:16,y1:2,x2:16,y2:6},{x1:8,y1:2,x2:8,y2:6},{x1:3,y1:10,x2:21,y2:10}]} />
const ClockIcon = () => <Icon circle={{ cx:12,cy:12,r:10 }} poly="12 6 12 12 16 14" />
const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Counter = ({ target, suffix }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1)
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const Stars = ({ rating = 0 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width={13} height={13} viewBox="0 0 24 24">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={i < Math.floor(rating) ? '#F59E0B' : '#E2E8F0'}
          stroke={i < Math.floor(rating) ? '#F59E0B' : '#CBD5E1'}
          strokeWidth={1}
        />
      </svg>
    ))}
  </div>
)

// ── Next Appointment Card ─────────────────────────────────────────
const NextAppointmentCard = () => {
  const [booking,   setBooking]   = useState(null)
  const [authUser,  setAuthUser]  = useState(undefined) // undefined = still loading
  const [loading,   setLoading]   = useState(true)
  const navigate = useNavigate()

  // Step 1 — wait for Firebase auth to be ready
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user) // null = not logged in, object = logged in
    })
    return () => unsubscribe()
  }, [])

  // Step 2 — once we know the user, fetch their bookings
  useEffect(() => {
    if (authUser === undefined) return // still loading auth
    if (authUser === null) { setLoading(false); return } // not logged in

    const fetchNext = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', authUser.uid),
          where('status', '!=', 'cancelled')
        )
        const snapshot = await getDocs(q)
        const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

        const upcoming = all
          .filter((b) => b.date >= today)
          .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            return a.time.localeCompare(b.time)
          })

        console.log('Upcoming bookings found:', upcoming.length)
        setBooking(upcoming[0] || null)
      } catch (err) {
        console.error('Error fetching appointment:', err)
      }
      setLoading(false)
    }

    fetchNext()
  }, [authUser])

  // Still waiting for auth to initialize
  if (authUser === undefined) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center min-h-[200px]">
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (authUser === null) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-sky-500 px-6 py-5">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Welcome</p>
            <p className="text-white text-xl font-bold">MediBook</p>
            <p className="text-white/80 text-sm">Your trusted healthcare platform</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-slate-500 text-sm mb-4">Sign in to view your upcoming appointments.</p>
            <Link to="/login" className="block w-full py-2.5 bg-[#0F2340] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition text-center">
              Login to your account
            </Link>
            <Link to="/register" className="block w-full mt-2 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition text-center">
              Create account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Logged in but fetching bookings
  if (loading) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center min-h-[200px]">
          <p className="text-slate-400 text-sm">Loading appointment...</p>
        </div>
      </div>
    )
  }

  // Logged in but no upcoming bookings
  if (!booking) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-sky-500 px-6 py-5">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Next Appointment</p>
            <p className="text-white text-xl font-bold">No upcoming bookings</p>
            <p className="text-white/80 text-sm">Book your first appointment today</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-slate-500 text-sm mb-4">You have no upcoming appointments scheduled.</p>
            <Link to="/doctors" className="block w-full py-2.5 bg-[#0F2340] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition text-center">
              Find a Doctor
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Has upcoming booking — show real data
  const dateObj = new Date(booking.date + 'T00:00:00')
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-sky-500 px-6 py-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Next Appointment</p>
          <p className="text-white text-xl font-bold">{booking.doctorName}</p>
          <p className="text-white/80 text-sm">{booking.specialty}</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-sky-500 shrink-0"><CalIcon /></span>
            <div>
              <p className="text-xs text-slate-400 font-medium">Date</p>
              <p className="text-sm text-slate-700 font-medium">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-sky-500 shrink-0"><ClockIcon /></span>
            <div>
              <p className="text-xs text-slate-400 font-medium">Time</p>
              <p className="text-sm text-slate-700 font-medium">{booking.time}</p>
            </div>
          </div>
          <div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize
              ${booking.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }`}>
              {booking.status}
            </span>
          </div>
          <button
            onClick={() => navigate('/user/profile/bookings')}
            className="block w-full mt-2 py-2.5 bg-[#0F2340] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition text-center"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
            <CheckIcon />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {booking.status === 'approved' ? 'Confirmed' : 'Pending approval'}
            </p>
            <p className="text-xs text-slate-400">Tap to view all bookings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Home ─────────────────────────────────────────────────────────
const Home = () => {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <main className="antialiased text-slate-800">

      <section className="relative bg-[#0F2340] overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-400 opacity-10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-sky-400 border border-sky-400/30 px-3 py-1 rounded-full mb-6">
              Trusted Healthcare Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Your health,<br />
              <span className="text-sky-400">your schedule,</span><br />
              your doctors.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
              Book appointments with top-rated specialists in minutes. Same-day slots available.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/doctors" className="px-7 py-3.5 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition shadow-lg shadow-sky-900/40">
                Book an Appointment
              </Link>
              <Link to="/services" className="px-7 py-3.5 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-400 hover:text-white transition">
                Our Services
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {['HIPAA Compliant', 'SSL Secured', 'ISO 27001 Certified'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <span className="text-sky-400"><CheckIcon /></span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <NextAppointmentCard />
          </div>
        </div>
      </section>

      <section className="bg-sky-500 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 30,    suffix: '+', label: 'Years of experience' },
            { target: 15,    suffix: '+', label: 'Clinic locations'    },
            { target: 50000, suffix: '+', label: 'Patients served'     },
            { target: 98,    suffix: '%', label: 'Satisfaction rate'   },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-white tabular-nums">
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <p className="text-sky-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-500 text-xs font-bold tracking-[0.2em] uppercase text-center mb-2">How it works</p>
          <h2 className="text-3xl font-bold text-[#0F2340] text-center mb-3">Healthcare that fits your life</h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">
            We built every step around you — not around hospital admin systems.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Find a Specialist', desc: 'Filter by specialty and see verified credentials and real patient reviews before you book.' },
              { title: 'Book Instantly',    desc: 'See real-time availability and confirm your slot in under 60 seconds.' },
              { title: 'Secure & Private',  desc: 'Your data is encrypted and we never share your information without consent.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <h3 className="font-semibold text-[#0F2340] text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-500 text-xs font-bold tracking-[0.2em] uppercase text-center mb-2">Our physicians</p>
          <h2 className="text-3xl font-bold text-[#0F2340] text-center mb-3">Meet our top-rated doctors</h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">
            Board-certified specialists with years of clinical experience.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {doctors.slice(0, 3).map((doc) => {
              const initials = doc.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'DR'
              return (
                <div key={doc.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-sky-50 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#0F2340] flex items-center justify-center text-white text-xl font-bold">
                      {initials}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#0F2340]">{doc.name}</h3>
                    <p className="text-sky-500 text-sm mb-2">{doc.specialty}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Stars rating={doc.rating} />
                      <span className="text-slate-400 text-xs">{doc.rating} · {doc.totalRating} reviews</span>
                    </div>
                    <Link
                      to={`/doctors/${doc.id}`}
                      className="block text-center text-sm font-semibold py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[#0F2340] hover:bg-sky-50 hover:text-sky-600 transition"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/doctors" className="inline-block px-7 py-3 border-2 border-[#0F2340] text-[#0F2340] font-semibold rounded-lg hover:bg-[#0F2340] hover:text-white transition">
              View all doctors →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-sky-500 text-xs font-bold tracking-[0.2em] uppercase text-center mb-2">FAQ</p>
          <h2 className="text-3xl font-bold text-[#0F2340] text-center mb-3">Common questions</h2>
          <p className="text-slate-500 text-center mb-10">
            Can't find your answer?{' '}
            <Link to="/contact" className="text-sky-500 underline underline-offset-2">Contact support.</Link>
          </p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-semibold text-[#0F2340] hover:bg-slate-50 transition"
                >
                  {faq.question}
                  <span className={`ml-4 shrink-0 text-slate-400 text-lg transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-80' : 'max-h-0'}`}>
                  <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed">{faq.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0F2340] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">Get started today</p>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Better health starts<br />with one appointment.
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of patients who trust us with their care.</p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link to="/register" className="px-7 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition">
              Create a free account
            </Link>
            <Link to="/doctors" className="px-7 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-400 hover:text-white transition">
              Browse doctors
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home
