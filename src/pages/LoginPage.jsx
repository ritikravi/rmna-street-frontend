import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError, completeLogin } from '../store/slices/authSlice';
import Logo from '../components/common/Logo';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token, pendingEmail } = useSelector((s) => s.auth);
  const from = location.state?.from || '/';

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (token && !showOtp && !pendingEmail) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [token, showOtp, pendingEmail, navigate, dispatch, from]);

  const startTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Email login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email: form.email, password: form.password }));
    if (login.fulfilled.match(result)) toast.success('Welcome back!');
  };

  // ── Register ──
  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({ name: form.name, email: form.email, password: form.password, phone: form.phone }));
    if (register.fulfilled.match(result)) {
      setShowOtp(true);
      startTimer();
      toast.success('OTP sent to your email!');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  // ── Google login ──
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      localStorage.setItem('rmna_token', res.data.token);
      localStorage.setItem('rmna_user', JSON.stringify(res.data.user));
      dispatch(completeLogin());
      // Merge guest cart
      const { mergeGuestCart } = await import('../store/slices/cartSlice');
      setTimeout(() => dispatch(mergeGuestCart()), 200);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  // ── OTP ──
  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); inputRefs.current[5]?.focus(); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setOtpLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp: otpString });
      if (res.data.token) {
        localStorage.setItem('rmna_token', res.data.token);
        localStorage.setItem('rmna_user', JSON.stringify(res.data.user));
        dispatch(completeLogin());
      }
      toast.success('Email verified! Welcome to RMNA Street 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await api.post('/auth/resend-otp', { email: form.email });
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      startTimer();
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  const Divider = ({ text }) => (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-zinc-400">{text}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative overflow-hidden flex-col items-center justify-center">
        <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <Logo variant="light" size="xl" showTagline />
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Premium men's streetwear. Add to cart without login — checkout when you're ready.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden block mb-8"><Logo variant="dark" size="md" /></Link>

          {/* OTP Screen */}
          {showOtp ? (
            <div>
              <button onClick={() => { setShowOtp(false); setOtp(['','','','','','']); }} className="text-sm text-zinc-400 hover:text-zinc-700 mb-6 flex items-center gap-1">
                ← Back
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✉️</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-zinc-500 text-sm">
                  We sent a 6-digit code to<br />
                  <span className="font-medium text-zinc-900">{form.email}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp}>
                <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 focus:outline-none transition-colors ${digit ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300 focus:border-zinc-900'}`}
                    />
                  ))}
                </div>
                <button type="submit" disabled={otpLoading || otp.join('').length < 6} className="btn-primary w-full mb-4">
                  {otpLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              <p className="text-center text-sm text-zinc-500">
                Didn't receive it?{' '}
                {resendTimer > 0 ? (
                  <span className="text-zinc-400">Resend in {resendTimer}s</span>
                ) : (
                  <button onClick={handleResend} className="text-zinc-900 font-medium hover:underline">Resend OTP</button>
                )}
              </p>
              <p className="text-center text-xs text-zinc-400 mt-4">Check spam folder if not received</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-zinc-200 mb-6">
                {[{ key: 'login', label: 'Sign In' }, { key: 'register', label: 'Create Account' }].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); dispatch(clearError()); }}
                    className={`px-5 py-3 text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">{error}</div>}

              {/* Google button — shown on both tabs */}
              <div className="mb-4">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed')}
                    theme="outline"
                    shape="rectangular"
                    text={tab === 'login' ? 'signin_with' : 'signup_with'}
                    width="368"
                  />
                </div>
              </div>

              <Divider text="or" />

              {/* Login form */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email address" required className="input-field" />
                  <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password" required className="input-field" />
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <p className="text-sm text-zinc-500 text-center">
                    No account?{' '}
                    <button type="button" onClick={() => setTab('register')} className="text-zinc-900 font-medium hover:underline">Create one</button>
                  </p>
                </form>
              )}

              {/* Register form */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full Name" required className="input-field" />
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email address" required className="input-field" />
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10-digit phone number" className="input-field" />
                  <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password (min 6 characters)" required minLength={6} className="input-field" />
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                  <p className="text-sm text-zinc-500 text-center">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setTab('login')} className="text-zinc-900 font-medium hover:underline">Sign in</button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
