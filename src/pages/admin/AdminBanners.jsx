import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    backgroundColor: 'from-zinc-900 to-zinc-700',
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners');
      setBanners(res.data.banners);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner._id}`, formData);
        toast.success('Banner updated successfully');
      } else {
        await api.post('/banners', formData);
        toast.success('Banner created successfully');
      }
      fetchBanners();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      backgroundColor: banner.backgroundColor,
      isActive: banner.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/banners/${id}/toggle`);
      toast.success('Banner status updated');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      backgroundColor: 'from-zinc-900 to-zinc-700',
      isActive: true
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-zinc-600 text-sm mt-1">Manage promotional banners on homepage</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-700"
        >
          <FiPlus size={16} />
          {showForm ? 'Cancel' : 'New Banner'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-zinc-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingBanner ? 'Edit Banner' : 'Create New Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title * (Use HTML for colors: &lt;span class="text-red-400"&gt;50% OFF&lt;/span&gt;)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                  required
                  placeholder='Upto <span class="text-red-400">50% OFF</span> on selected styles'
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                  placeholder="Limited time offer · Free shipping"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Text *</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link *</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                  required
                  placeholder="/products?discounted=true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Gradient</label>
                <select
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-900"
                >
                  <option value="from-zinc-900 to-zinc-700">Dark Gray</option>
                  <option value="from-red-600 to-red-800">Red</option>
                  <option value="from-blue-600 to-blue-800">Blue</option>
                  <option value="from-green-600 to-green-800">Green</option>
                  <option value="from-purple-600 to-purple-800">Purple</option>
                  <option value="from-orange-600 to-orange-800">Orange</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-zinc-900 text-white hover:bg-zinc-700">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 border border-zinc-300 hover:bg-zinc-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Button</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {banners.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                  No banners yet. Create your first banner!
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div dangerouslySetInnerHTML={{ __html: banner.title }} className="font-medium" />
                    {banner.subtitle && (
                      <p className="text-sm text-zinc-500 mt-1">{banner.subtitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {banner.buttonText} → {banner.buttonLink}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(banner._id)}
                      className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Only one banner can be active at a time</li>
          <li>• Use HTML in title for colored text: &lt;span class="text-red-400"&gt;50% OFF&lt;/span&gt;</li>
          <li>• Button link examples: /products, /products?discounted=true, /women-accessories</li>
          <li>• Changes appear immediately on homepage</li>
        </ul>
      </div>
    </div>
  );
}
