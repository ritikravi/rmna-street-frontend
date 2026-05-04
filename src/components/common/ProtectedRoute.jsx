import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const { token } = useSelector((s) => s.auth);
  const location = useLocation();

  // Also check localStorage as fallback for Google login timing
  const localToken = localStorage.getItem('rmna_token');
  const isAuth = token || localToken;

  return isAuth
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
