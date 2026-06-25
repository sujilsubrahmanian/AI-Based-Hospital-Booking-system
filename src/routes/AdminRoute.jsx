import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

const AdminRoute = ({ children }) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default AdminRoute