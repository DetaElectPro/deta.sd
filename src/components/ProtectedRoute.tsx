
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userProfile } = useAuth();

  console.log('ProtectedRoute check:', {
    user: user?.email,
    loading,
    userProfile,
    requiredRole
  });

  if (loading) {
    console.log('ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // إذا كان هناك دور مطلوب، تحقق منه
  if (requiredRole) {
    // إذا لم يتم تحميل ملف المستخدم بعد، انتظر قليلاً
    if (userProfile === null) {
      console.log('ProtectedRoute: User profile not loaded yet, waiting...');
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    // تحقق من الدور
    const userRole = userProfile?.role;
    console.log('ProtectedRoute: Checking role:', { userRole, requiredRole });
    
    if (userRole !== requiredRole && userRole !== 'admin') {
      console.log('ProtectedRoute: Insufficient permissions, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};
