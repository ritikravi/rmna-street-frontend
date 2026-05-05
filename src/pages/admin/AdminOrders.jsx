import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiPrinter } from 'react-icons/fi';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

// ── Print Invoice ──────────────────────────────────────────
const printInvoice = (order) => {
  const items = order.orderItems.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">Size ${item.size}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - RMNA Street</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #000; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 20px; }
        .brand { font-size: 28px; font-weight: 900; letter-spacing: 4px; }
        .tagline { font-size: 10px; letter-spacing: 3px; color: #BB0000; margin-top: 2px; }
        .invoice-title { font-size: 20px; font-weight: bold; text-align: right; }
        .invoice-meta { text-align: right; color: #555; margin-top: 4px; font-size: 12px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #000; color: #fff; }
        thead th { padding: 10px 8px; text-align: left; font-size: 12px; }
        thead th:last-child, thead th:nth-child(4) { text-align: right; }
        thead th:nth-child(2), thead th:nth-child(3) { text-align: center; }
        .totals { margin-top: 16px; margin-left: auto; width: 260px; }
        .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
        .totals-row.total { font-weight: bold; font-size: 15px; border-top: 2px solid #000; padding-top: 8px; margin-top: 4px; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 3px; font-size: 11px; font-weight: bold; background: #f0f0f0; }
        .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; text-align: center; color: #888; font-size: 11px; }
        .red { color: #BB0000; }
        @media print { body { padding: 15px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">RMNA STREET</div>
          <div class="tagline">BUILT DIFFERENT</div>
          <div style="margin-top:8px;font-size:11px;color:#555;">
            ritikravi7724@gmail.com<br>
            rmnastreet.com
          </div>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-meta">
            Order #${order._id.slice(-8).toUpperCase()}<br>
            Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
            Payment: ${order.paymentMethod}<br>
            <span class="status-badge">${order.orderStatus}</span>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="section">
          <div class="section-title">Bill To</div>
          <strong>${order.shippingAddress?.fullName}</strong><br>
          ${order.shippingAddress?.phone}<br>
          ${order.shippingAddress?.street}<br>
          ${order.shippingAddress?.city}, ${order.shippingAddress?.state}<br>
          PIN: ${order.shippingAddress?.pincode}
        </div>
        <div class="section">
          <div class="section-title">Customer</div>
          ${order.user?.name || ''}<br>
          ${order.user?.email || ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Size</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>

      <div class="totals">
        <div class="totals-row"><span>Subtotal</span><span>₹${order.itemsPrice}</span></div>
        <div class="totals-row"><span>Shipping</span><span class="red">FREE</span></div>
        ${order.discountAmount > 0 ? `<div class="totals-row" style="color:green;"><span>Discount</span><span>-₹${order.discountAmount}</span></div>` : ''}
        <div class="totals-row total"><span>TOTAL</span><span>₹${order.totalPrice}</span></div>
      </div>

      <div class="footer">
        Thank you for shopping with RMNA Street! | Built Different<br>
        © 2026 RMNA Street | Built by Ritik, Mayank, Nirmal & Ankit
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
};

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
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Actions</th>
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
                  <td className="px-4 py-3 text-zinc-600 text-xs">{order.shippingAddress?.phone || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="border border-zinc-300 text-xs px-2 py-1 focus:outline-none"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={() => printInvoice(order)}
                        className="p-1.5 border border-zinc-300 hover:bg-zinc-100 rounded text-zinc-600"
                        title="Print Invoice"
                      >
                        <FiPrinter size={14} />
                      </button>
                    </div>
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
