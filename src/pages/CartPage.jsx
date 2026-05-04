import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, updateGuestItem, removeGuestItem } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiMinus, FiPlus, FiLock } from 'react-icons/fi';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, guestItems, loading } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [token, dispatch]);

  // Use DB cart if logged in, guest cart if not
  const cartItems = token ? items : guestItems;

  const getPrice = (item) => {
    const p = item.product;
    if (!p) return 0;
    return p.discountPrice > 0 ? p.discountPrice : p.price;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getPrice(item) * item.quantity, 0);
  const shipping = 0; // Free shipping on all orders
  const total = subtotal + shipping;

  const handleUpdate = (item, qty) => {
    if (token) {
      dispatch(updateCartItem({ itemId: item._id, quantity: qty }));
    } else {
      dispatch(updateGuestItem({ productId: item.productId || item.product?._id, size: item.size, quantity: qty }));
    }
  };

  const handleRemove = (item) => {
    if (token) {
      dispatch(removeFromCart(item._id));
    } else {
      dispatch(removeGuestItem({ productId: item.productId || item.product?._id, size: item.size }));
    }
  };

  const handleCheckout = () => {
    if (!token) {
      // Send to login, come back to checkout after
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">
        Shopping Cart ({cartItems.length})
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg mb-6">Your cart is empty</p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => {
              const price = getPrice(item);
              const productId = item.product?._id || item.productId;
              const image = item.product?.images?.[0]?.url || 'https://placehold.co/100x133?text=RMNA';
              const name = item.product?.name || 'Product';
              const fitType = item.product?.fitType || '';

              return (
                <div key={item._id || idx} className="flex gap-4 border-b pb-4">
                  <Link to={`/products/${productId}`} className="flex-shrink-0">
                    <img src={image} alt={name} className="w-24 h-32 object-cover bg-zinc-100" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${productId}`} className="font-medium hover:underline line-clamp-1">
                      {name}
                    </Link>
                    <p className="text-sm text-zinc-500 mt-1">
                      Size: {item.size}{fitType && ` · ${fitType} fit`}
                    </p>
                    <p className="font-semibold mt-2">{formatPrice(price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-zinc-300">
                        <button onClick={() => handleUpdate(item, item.quantity - 1)} className="px-2 py-1 hover:bg-zinc-100">
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item, item.quantity + 1)} className="px-2 py-1 hover:bg-zinc-100">
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <button onClick={() => handleRemove(item)} className="text-zinc-400 hover:text-red-500 transition-colors" aria-label="Remove">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    {formatPrice(price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-zinc-50 p-6 h-fit">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              {!token && <FiLock size={15} />}
              {token ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            {!token && (
              <p className="text-xs text-zinc-500 text-center mt-3">
                Your cart is saved. Login to complete your order.
              </p>
            )}

            <Link to="/products" className="block text-center text-sm text-zinc-500 mt-3 hover:text-zinc-900">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
