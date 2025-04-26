import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import Loading from '../components/common/Loading'; // Assuming you already have a loading spinner

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />; // Show a spinner while checking auth state
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.isOtpRequired) {
    return <Navigate to="/otp" />;
  }

  return <>{children}</>;
}
