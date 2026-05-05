import { useState } from 'react';
import { FiMessageSquare, FiX, FiStar, FiSend } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const TYPES = [
  { value: 'suggestion', label: '💡 Suggestion' },
  { value: 'bug', label: '🐛 Bug / Issue' },
  { value: 'compliment', label: '❤️ Compliment' },
  { value: 'other', label: '💬 Other' },
];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', type: 'suggestion', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Name and message are required'); return; }
    setLoading(true);
    try {
      await api.post('/feedback', { ...form, rating });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', type: 'suggestion', message: '' }); setRating(0); }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-zinc-900 text-white px-4 py-3 shadow-lg hover:bg-zinc-700 transition-colors text-sm font-medium"
        style={{ borderRadius: 2 }}
        aria-label="Give feedback"
      >
        <FiMessageSquare size={16} />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={handleClose}>
          {/* Modal */}
          <div
            className="w-full max-w-md bg-white shadow-2xl"
            style={{ borderRadius: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div>
                <h2 className="font-semibold text-base">Share your feedback</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Help us improve RMNA Street</p>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-zinc-100 rounded transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="px-5 py-12 text-center">
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="font-bold text-lg mb-2">Thank you!</h3>
                <p className="text-zinc-500 text-sm">Your feedback means a lot to us. We'll work on it!</p>
                <button onClick={handleClose} className="mt-6 btn-primary px-8">Close</button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Type selector */}
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                      className={`text-xs py-2 px-3 border transition-colors text-left ${
                        form.type === t.value ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Star rating */}
                <div>
                  <p className="text-xs text-zinc-500 mb-1.5">Rate your experience (optional)</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                      >
                        <FiStar
                          size={22}
                          fill={s <= (hoverRating || rating) ? '#BB0000' : 'none'}
                          stroke={s <= (hoverRating || rating) ? '#BB0000' : '#d1d5db'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name *"
                    required
                    className="input-field text-sm"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email (optional)"
                    className="input-field text-sm"
                  />
                </div>

                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={4}
                  className="input-field text-sm resize-none w-full"
                />

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiSend size={15} />
                  {loading ? 'Sending...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
