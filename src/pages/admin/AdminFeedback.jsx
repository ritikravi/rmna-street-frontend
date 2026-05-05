import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FiStar, FiMail, FiCheck } from 'react-icons/fi';

const typeColors = {
  suggestion: 'bg-blue-100 text-blue-700',
  bug: 'bg-red-100 text-red-700',
  compliment: 'bg-green-100 text-green-700',
  other: 'bg-zinc-100 text-zinc-600',
};

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/feedback').then((r) => setFeedbacks(r.data.feedbacks)).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.put(`/feedback/${id}/read`);
    setFeedbacks((prev) => prev.map((f) => f._id === id ? { ...f, isRead: true } : f));
  };

  const unread = feedbacks.filter((f) => !f.isRead).length;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Feedback</h1>
        {unread > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unread} new</span>
        )}
      </div>

      {loading ? <p className="text-zinc-500">Loading...</p> : feedbacks.length === 0 ? (
        <p className="text-zinc-500">No feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f._id} className={`bg-white border rounded p-4 ${!f.isRead ? 'border-l-4 border-l-zinc-900' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{f.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${typeColors[f.type]}`}>{f.type}</span>
                    {f.rating > 0 && (
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} size={11} fill={s <= f.rating ? '#BB0000' : 'none'} stroke={s <= f.rating ? '#BB0000' : '#d1d5db'} />
                        ))}
                      </div>
                    )}
                    {!f.isRead && <span className="text-xs text-zinc-400">● New</span>}
                  </div>
                  {f.email && (
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mb-2">
                      <FiMail size={11} /> {f.email}
                    </p>
                  )}
                  <p className="text-sm text-zinc-700">{f.message}</p>
                  <p className="text-xs text-zinc-400 mt-2">{new Date(f.createdAt).toLocaleString('en-IN')}</p>
                </div>
                {!f.isRead && (
                  <button onClick={() => markRead(f._id)} className="flex items-center gap-1 text-xs border border-zinc-300 px-2 py-1 hover:bg-zinc-50 flex-shrink-0">
                    <FiCheck size={12} /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
