import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/newsletter/subscribers');
      setSubscribers(res.data.subscribers);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const emails = subscribers.map(s => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Subscribers exported!');
  };

  const handleCopyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success('Emails copied to clipboard!');
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-zinc-600 text-sm mt-1">
            Total: {subscribers.length} active subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopyEmails}
            className="px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-sm font-medium"
          >
            Copy All Emails
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-700 text-sm font-medium"
          >
            Export List
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-zinc-600 text-sm mb-1">Total Subscribers</p>
          <p className="text-3xl font-bold">{subscribers.length}</p>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-zinc-600 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">
            {subscribers.filter(s => {
              const subDate = new Date(s.subscribedAt);
              const now = new Date();
              return subDate.getMonth() === now.getMonth() && 
                     subDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <p className="text-zinc-600 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold">
            {subscribers.filter(s => {
              const subDate = new Date(s.subscribedAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return subDate >= weekAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Subscribed Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                  {searchTerm ? 'No subscribers found matching your search' : 'No subscribers yet'}
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber, index) => (
                <tr key={subscriber._id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {new Date(subscriber.subscribedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      subscriber.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How to use newsletter emails:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Copy All Emails" to paste into your email marketing tool (Mailchimp, SendGrid, etc.)</li>
          <li>• Click "Export List" to download as a text file</li>
          <li>• Use these emails to send promotional campaigns, new product launches, and exclusive deals</li>
          <li>• Always include an unsubscribe link in your emails</li>
        </ul>
      </div>
    </div>
  );
}
