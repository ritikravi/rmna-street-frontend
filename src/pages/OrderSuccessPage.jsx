import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, getStatusColor } from '../utils/helpers';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch(console.error);
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="font-display text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-zinc-500 mb-2">Thank you for shopping with RMNA Street.</p>
      {order && <p className="text-sm text-zinc-400 mb-8">Order ID: #{order._id.slice(-8).toUpperCase()}</p>}

      {order && (
        <div className="text-left border p-6 mb-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Status</span>
            <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Total</span>
            <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Payment</span>
            <span>Cash on Delivery</span>
          </div>
          <div className="text-sm">
            <span className="text-zinc-500">Delivering to: </span>
            <span>{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</span>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link to="/orders" className="btn-primary">Track Order</Link>
        <Link to="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
