import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => {
    if (token) navigate('/');
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('Account created! Check your email for OTP.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 bg-zinc-900 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Logo variant="light" size="xl" showTagline />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden block mb-8">
            <Logo variant="dark" size="md" />
          </Link>
          <h2 className="font-display text-3xl font-bold mb-2">Create account</h2>
          <p className="text-zinc-500 text-sm mb-8">Join RMNA Street today</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full Name"
              required
              className="input-field"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email address"
              required
              className="input-field"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="Phone Number (optional)"
              className="input-field"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              className="input-field"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-zinc-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-900 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
