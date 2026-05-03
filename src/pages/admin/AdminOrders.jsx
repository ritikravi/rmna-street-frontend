import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    const params = filter ? { status: filter } : {};
    api.get('/admin/orders', { params }).then((r) => setOrders(r.data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-zinc-300 text-sm px-3 py-2 focus:outline-none">
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p className="text-zinc-500">Loading...</p> : (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-zinc-400 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border border-zinc-300 text-xs px-2 py-1 focus:outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
