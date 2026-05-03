import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, getStatusColor } from '../utils/helpers';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-zinc-500">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-6">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block border hover:border-zinc-400 transition-colors p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="font-semibold mt-1">{formatPrice(order.totalPrice)}</p>
                  <p className="text-sm text-zinc-500 mt-1">{order.orderItems.length} item(s)</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                  <div className="flex gap-2 mt-3 justify-end">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || 'https://placehold.co/48x64?text=RMNA'} alt={item.name} className="w-12 h-16 object-cover bg-zinc-100" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
