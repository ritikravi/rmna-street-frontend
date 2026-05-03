import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, clearError } from '../../store/slices/authSlice';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      const { user } = result.payload;
      if (user.role !== 'admin') {
        // Not an admin — log them out and show error
        dispatch(logout());
        toast.error('Access denied. Admin accounts only.');
        return;
      }
      // Admin confirmed — go to dashboard
      toast.success('Welcome, Admin');
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo variant="light" size="lg" showTagline />
          <div className="mt-4 flex items-center gap-2">
            <span className="w-8 h-px bg-red-600" />
            <span className="text-zinc-400 text-xs tracking-[0.3em] uppercase">Admin Portal</span>
            <span className="w-8 h-px bg-red-600" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-8">
          <h2 className="text-white text-xl font-semibold mb-1">Sign in</h2>
          <p className="text-zinc-500 text-sm mb-6">Admin access only</p>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@rmnastreet.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold tracking-wider uppercase transition-colors disabled:opacity-50"
              style={{ background: '#BB0000', color: '#fff' }}
            >
              {loading ? 'Signing in...' : 'Enter Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-zinc-600 text-xs">
          Customer?{' '}
          <a href="/" className="text-zinc-400 hover:text-white transition-colors underline">
            Go to Store
          </a>
        </p>
      </div>
    </div>
  );
}
