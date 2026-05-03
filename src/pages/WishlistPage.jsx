import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { formatPrice } from '../utils/helpers';
import { FiTrash2 } from 'react-icons/fi';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.wishlist);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchWishlist());
  }, [token, dispatch]);

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Wishlist</h2>
        <p className="text-zinc-500 mb-6">Please login to view your wishlist</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Wishlist ({products.length})</h1>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-6">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <div key={product._id} className="group relative">
                <Link to={`/products/${product._id}`}>
                  <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || 'https://placehold.co/300x400?text=RMNA'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{product.fitType} fit</p>
                    <h3 className="text-sm font-medium mt-0.5 line-clamp-1">{product.name}</h3>
                    <p className="font-semibold mt-1">{formatPrice(displayPrice)}</p>
                  </div>
                </Link>
                <button
                  onClick={() => dispatch(toggleWishlist(product._id))}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow text-red-500 hover:bg-red-50"
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
