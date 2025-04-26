import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // fixed import if needed

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.isOtpRequired) {
    return <Navigate to="/otp" />;
  }

  return <>{children}</>;
}
