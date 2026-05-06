import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import Logo from '../../components/common/Logo';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Jeans Products', icon: FiPackage },
  { to: '/admin/women-products', label: 'Women Accessories', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin/feedback', label: 'Feedback', icon: FiMessageSquare },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-56 bg-zinc-900 text-zinc-400 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-zinc-800">
          <Logo variant="light" size="sm" />
          <p className="text-zinc-500 text-xs mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                  isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm w-full hover:text-white transition-colors">
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
