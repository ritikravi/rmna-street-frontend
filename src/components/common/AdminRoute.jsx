import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminRoute() {
  const { user, token } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
