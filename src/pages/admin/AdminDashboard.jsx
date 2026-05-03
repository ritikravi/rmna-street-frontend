import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-zinc-500">Loading dashboard...</div>;

  const { stats, recentOrders, ordersByStatus } = data;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-50 text-purple-600' },
    { label: 'Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border p-5 rounded">
            <div className={`inline-flex p-2 rounded mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border p-6 rounded">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-2">
            {ordersByStatus.map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className={`badge ${getStatusColor(s._id)}`}>{s._id}</span>
                <span className="font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border p-6 rounded">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-zinc-500 underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between text-sm hover:bg-zinc-50 p-2 -mx-2 rounded">
                <div>
                  <p className="font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-zinc-500 text-xs">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
                  <span className={`badge text-xs ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
