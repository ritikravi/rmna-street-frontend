import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiMapPin } from 'react-icons/fi';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ── NEW: Parse OpenStreetMap geocode response into address fields ──
const parseOSMAddress = (data) => {
  const addr = data.address || {};
  const road = addr.road || addr.pedestrian || addr.footway || addr.street || '';
  const suburb = addr.suburb || addr.neighbourhood || addr.quarter || '';
  const street = [road, suburb].filter(Boolean).join(', ');
  const city = addr.city || addr.town || addr.village || addr.county || '';
  const state = addr.state || '';
  const pincode = addr.postcode || '';
  return { street, city, state, pincode };
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [form, setForm] = useState({
    fullName: defaultAddr?.fullName || user?.name || '',
    phone: defaultAddr?.phone || user?.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    pincode: defaultAddr?.pincode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── NEW: Location autofill state ──
  const [locLoading, setLocLoading] = useState(false);

  // ── NEW: Fetch location and autofill address ──
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'RMNAStreet/1.0' } }
          );
          const data = await res.json();
          const parsed = parseOSMAddress(data);
          // Only autofill empty fields — don't overwrite what user typed
          setForm((prev) => ({
            ...prev,
            street: prev.street || parsed.street,
            city: prev.city || parsed.city,
            state: prev.state || parsed.state,
            pincode: prev.pincode || parsed.pincode,
          }));
          toast.success('Address autofilled from your location');
        } catch {
          toast.error('Could not fetch address. Please enter manually.');
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        if (err.code === 1) toast.error('Location permission denied. Please enter address manually.');
        else toast.error('Could not get location. Please enter manually.');
      },
      { timeout: 10000 }
    );
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const shipping = 0; // Free shipping on all orders
  const total = subtotal + shipping - discount;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/orders/validate-coupon', { code: couponCode, orderAmount: subtotal });
      setDiscount(res.data.discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You save ${formatPrice(res.data.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const placeOrder = async () => {
    const res = await api.post('/orders', {
      shippingAddress: form,
      couponCode: couponApplied ? couponCode : undefined,
      paymentMethod,
    });
    return res.data.order;
  };

  const handleRazorpay = async (order) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { toast.error('Razorpay failed to load'); return; }

    const { data } = await api.post('/payment/create-order', { orderId: order._id });

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'RMNA Street',
      description: 'Premium Streetwear',
      order_id: data.razorpayOrderId,
      prefill: {
        name: form.fullName,
        contact: form.phone,
        email: user?.email || '',
      },
      theme: { color: '#BB0000' },
      handler: async (response) => {
        try {
          await api.post('/payment/verify', {
            ...response,
            orderId: order._id,
          });
          toast.success('Payment successful!');
          navigate(`/order-success/${order._id}`);
        } catch {
          toast.error('Payment verification failed. Contact support.');
        }
      },
      modal: {
        ondismiss: () => toast('Payment cancelled. Your order is saved as pending.'),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrder();
      if (paymentMethod === 'COD') {
        toast.success('Order placed!');
        navigate(`/order-success/${order._id}`);
      } else {
        await handleRazorpay(order);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const hasRazorpay = import.meta.env.VITE_RAZORPAY_KEY_ID &&
    import.meta.env.VITE_RAZORPAY_KEY_ID !== 'rzp_test_yourkeyhere';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
        {/* Left — Shipping + Payment */}
        <div className="space-y-6">
          {/* Shipping */}
          <div className="border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Shipping Address</h2>
              {/* ── NEW: Location button ── */}
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locLoading}
                className="flex items-center gap-1.5 text-xs border border-zinc-300 px-3 py-1.5 hover:border-zinc-900 transition-colors disabled:opacity-50"
              >
                <FiMapPin size={13} />
                {locLoading ? 'Detecting...' : 'Use My Location'}
              </button>
            </div>
            <div className="space-y-3">
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className="input-field" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="input-field" />
              <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address" required className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="input-field" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="input-field" />
              </div>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" required className="input-field" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="border p-5">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* COD */}
              <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-zinc-900" />
                <div>
                  <p className="font-medium text-sm">Cash on Delivery</p>
                  <p className="text-xs text-zinc-500">Pay when your order arrives</p>
                </div>
                <span className="ml-auto text-xl">💵</span>
              </label>

              {/* Razorpay */}
              <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                paymentMethod === 'Razorpay' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'
              } ${(!hasRazorpay || subtotal < 100) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  disabled={!hasRazorpay || subtotal < 100}
                  className="accent-zinc-900"
                />
                <div>
                  <p className="font-medium text-sm">Pay Online</p>
                  <p className="text-xs text-zinc-500">UPI · Cards · Net Banking · Wallets</p>
                </div>
                <span className="ml-auto text-xl">💳</span>
              </label>
              {subtotal < 100 && hasRazorpay && (
                <p className="text-xs text-zinc-400 px-1">
                  Minimum ₹100 required for online payment. Use COD.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="border p-5">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => {
                const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
                return (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.product?.images?.[0]?.url || 'https://placehold.co/56x75?text=RMNA'} alt={item.product?.name} className="w-14 h-[75px] object-cover bg-zinc-100 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-1">{item.product?.name}</p>
                      <p className="text-zinc-500">Size: {item.size} × {item.quantity}</p>
                      <p className="font-semibold">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                disabled={couponApplied}
                className="input-field flex-1 text-sm"
              />
              <button type="button" onClick={applyCoupon} disabled={couponApplied} className="btn-outline text-sm px-4 py-2">
                {couponApplied ? '✓ Applied' : 'Apply'}
              </button>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-600">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>

            <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-5 text-base">
              {loading
                ? 'Processing...'
                : paymentMethod === 'COD'
                ? `Place Order · ${formatPrice(total)}`
                : `Pay ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
