import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const { token } = useSelector((s) => s.auth);
  const location = useLocation();

  return token
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
