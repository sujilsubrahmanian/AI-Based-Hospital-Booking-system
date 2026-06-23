import { Routes, Route } from 'react-router-dom'
import Home          from '../pages/Home'
import Doctors       from '../pages/Doctors/Doctors'
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import Services      from '../pages/Services'
import Contact       from '../pages/Contact'
import Login         from '../pages/Login'
import Signup        from '../pages/Signup'
import MyAccount     from '../profile/MyAccount'
import MyBooking     from '../profile/MyBooking'
import ProtectedRoute from './ProtectedRoute'

const Routers = () => {
  return (
    <Routes>
      <Route path='/'                       element={<Home />} />
      <Route path='/home'                   element={<Home />} />
      <Route path='/doctors'                element={<Doctors />} />
      <Route path='/doctors/:id'            element={<DoctorDetails />} />
      <Route path='/services'               element={<Services />} />
      <Route path='/contact'                element={<Contact />} />
      <Route path='/login'                  element={<Login />} />
      <Route path='/register'               element={<Signup />} />
      <Route path='/user/profile'           element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
      <Route path='/user/profile/bookings'  element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />
    </Routes>
  )
}

export default Routers