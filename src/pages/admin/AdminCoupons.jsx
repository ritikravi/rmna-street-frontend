import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '',
    maxDiscount: '', usageLimit: 100, expiresAt: '',
  });

  const fetchCoupons = () => api.get('/admin/coupons').then((r) => setCoupons(r.data.coupons));
  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', form);
      toast.success('Coupon created');
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await api.delete(`/admin/coupons/${id}`);
    toast.success('Coupon deleted');
    fetchCoupons();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> {showForm ? 'Cancel' : 'New Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border p-6 mb-6 grid grid-cols-2 gap-4">
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="Coupon Code" required className="input-field" />
          <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))} className="input-field">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
          <input type="number" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} placeholder="Discount Value" required className="input-field" />
          <input type="number" value={form.minOrderAmount} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))} placeholder="Min Order Amount (₹)" className="input-field" />
          <input type="number" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} placeholder="Max Discount (₹)" className="input-field" />
          <input type="number" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} placeholder="Usage Limit" className="input-field" />
          <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} required className="input-field col-span-2" />
          <button type="submit" className="btn-primary col-span-2">Create Coupon</button>
        </form>
      )}

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Code</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Discount</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Min Order</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Used</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Expires</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">
                  {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                </td>
                <td className="px-4 py-3 text-zinc-500">₹{c.minOrderAmount || 0}</td>
                <td className="px-4 py-3 text-zinc-500">{c.usedCount}/{c.usageLimit}</td>
                <td className="px-4 py-3 text-zinc-500">{new Date(c.expiresAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:bg-red-50 rounded text-zinc-400 hover:text-red-500">
                    <FiTrash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
