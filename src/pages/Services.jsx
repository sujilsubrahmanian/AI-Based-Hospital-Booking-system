import { services } from '../assets/data/services'

const Services = () => {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Our Medical Services</h2>
        <p className="text-center text-gray-500 mb-12">
          We offer a wide range of medical services to keep you and your family healthy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-sm hover:shadow-md transition bg-white"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: s.bgColor, color: s.textColor }}
              >
                🏥
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: s.textColor }}
              >
                {s.name}
              </h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services