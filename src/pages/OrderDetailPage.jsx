import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-zinc-500">Loading...</div>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-zinc-500">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-zinc-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
      </div>

      {/* Items */}
      <div className="border p-4 mb-6 space-y-4">
        {order.orderItems.map((item, i) => (
          <div key={i} className="flex gap-4">
            <img src={item.image || 'https://placehold.co/64x85?text=RMNA'} alt={item.name} className="w-16 h-20 object-cover bg-zinc-100 flex-shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-zinc-500">Size: {item.size} × {item.quantity}</p>
              <p className="font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        <div className="border p-4">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider">Shipping Address</h3>
          <p className="text-sm">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-zinc-500">{order.shippingAddress?.phone}</p>
          <p className="text-sm text-zinc-500">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
          <p className="text-sm text-zinc-500">{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
        </div>

        {/* Price */}
        <div className="border p-4">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider">Price Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discountAmount)}</span></div>}
            <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
          </div>
        </div>
      </div>

      {/* Status history */}
      <div className="border p-4 mb-6">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Order Timeline</h3>
        <div className="space-y-2">
          {order.statusHistory?.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-zinc-900 flex-shrink-0" />
              <span className="font-medium">{s.status}</span>
              <span className="text-zinc-400">{new Date(s.updatedAt).toLocaleDateString('en-IN')}</span>
              {s.note && <span className="text-zinc-500">· {s.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {['Pending', 'Confirmed'].includes(order.orderStatus) && (
        <button onClick={handleCancel} disabled={cancelling} className="btn-outline border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600">
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  );
}
