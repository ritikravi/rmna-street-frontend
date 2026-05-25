import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Logo from '../components/common/Logo';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/newsletter/unsubscribe', { email });
      setMessage(res.data.message);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unsubscribe. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg border border-zinc-200">
        <div className="text-center mb-6">
          <Logo variant="dark" size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unsubscribe from Newsletter</h1>
          <p className="text-zinc-600 text-sm">
            We're sorry to see you go. Enter your email to unsubscribe from our newsletter.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                required
                disabled={loading}
              />
            </div>

            {message && !success && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-3 font-semibold hover:bg-zinc-700 transition-colors disabled:bg-zinc-400"
            >
              {loading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Changed your mind?{' '}
              <Link to="/" className="text-zinc-900 underline hover:text-zinc-700">
                Go back to homepage
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✅</div>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              {message}
            </div>
            <p className="text-zinc-600 text-sm">
              You've been successfully unsubscribed from our newsletter. You won't receive any more emails from us.
            </p>
            <div className="pt-4 space-y-3">
              <Link
                to="/"
                className="block w-full bg-zinc-900 text-white py-3 font-semibold hover:bg-zinc-700 transition-colors text-center"
              >
                Back to Homepage
              </Link>
              <p className="text-xs text-zinc-500">
                Miss us already?{' '}
                <Link to="/" className="text-zinc-900 underline hover:text-zinc-700">
                  Resubscribe on homepage
                </Link>
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 text-center">
            If you have any questions, please contact us at{' '}
            <a href="mailto:ritikravi7724@gmail.com" className="text-zinc-900 underline">
              ritikravi7724@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
