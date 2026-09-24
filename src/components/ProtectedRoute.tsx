
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // إذا كان هناك دور مطلوب، تحقق منه
  if (requiredRole) {
    // إذا لم يتم تحميل ملف المستخدم بعد، انتظر قليلاً
    if (userProfile === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    // تحقق من الدور
    const userRole = userProfile?.role;
    
    if (userRole !== requiredRole && userRole !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
