import { useState } from 'react'

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    setSubmitted(true)
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Contact Us</h2>
        <p className="text-center text-gray-500 mb-10">
          Have a question? We'd love to hear from you.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-lg">Message sent successfully!</p>
            <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        )}

        {/* Contact info */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-bold">
          {[
            { icon: '📍', label: 'Location',  value: '123 Medical Lane, Kerala' },
            { icon: '📞', label: 'Phone',     value: '+91 98765 43210'          },
            { icon: '✉️', label: 'Email',     value: 'support@medibook.com'     },
          ].map((item) => (
            <div key={item.label} className="bg-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="font-medium text-gray-700">{item.label}</p>
              <p className="text-gray-500 text-sm mt-1">{item.value}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Contact