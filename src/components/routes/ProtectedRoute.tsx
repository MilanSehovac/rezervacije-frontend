import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../ui/loadingSpinner'

type Props = {
    children: React.ReactNode;
    roles?: number[];
  };

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, isAuthChecked } = useAuth()

  if (!isAuthChecked) return <LoadingSpinner loading={isAuthChecked} singular={false} />

  if (!user) return <Navigate to="/" replace />

  if (roles && !roles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return children
}

export default ProtectedRoute