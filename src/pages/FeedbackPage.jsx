import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';

const FEEDBACK_TYPES = ['Suggestion', 'Bug', 'Compliment', 'Other'];

export default function FeedbackPage() {
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    type: 'Suggestion',
    name: user?.name || '',
    email: user?.email || '',
    message: '',
    rating: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      toast.error('Email and message are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/feedback', form);
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
      setForm({ type: 'Suggestion', name: '', email: '', message: '', rating: 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-zinc-600 mb-6">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary w-full"
            >
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">We'd Love Your Feedback</h1>
          <p className="text-zinc-600">
            Help us improve RMNA Street by sharing your thoughts, suggestions, or reporting issues.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Feedback Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {FEEDBACK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, type })}
                    className={`px-4 py-2 text-sm border rounded transition-colors ${
                      form.type === type
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'border-zinc-300 hover:border-zinc-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Rate Your Experience (Optional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="transition-colors"
                  >
                    <FiStar
                      size={28}
                      className={star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name (Optional)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Feedback *</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you think..."
                rows={6}
                className="input-field resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-zinc-500">
          <p>Your feedback helps us build a better shopping experience.</p>
          <p className="mt-1">We read every submission and appreciate your time.</p>
        </div>
      </div>
    </div>
  );
}
