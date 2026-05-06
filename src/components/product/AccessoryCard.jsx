import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatPrice, getDiscount } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AccessoryCard({ product }) {
  const dispatch = useDispatch();
  const { products: wishlistProducts } = useSelector((s) => s.wishlist);
  const { token } = useSelector((s) => s.auth);

  const isWishlisted = wishlistProducts.some((p) => (p._id || p) === product._id);
  const discount = getDiscount(product.price, product.discountPrice);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to add to wishlist'); return; }
    dispatch(toggleWishlist(product._id));
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative overflow-hidden bg-zinc-100 aspect-square">
        <img
          src={product.images[0]?.url || 'https://placehold.co/400x400?text=RMNA'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-zinc-900 text-white text-xs px-2 py-0.5 font-medium tracking-wider">NEW</span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 font-medium">-{discount}%</span>
          )}
        </div>
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium tracking-wider uppercase">Sold Out</span>
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow transition-colors ${isWishlisted ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
          aria-label="Toggle wishlist"
        >
          <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="mt-3">
        {product.subcategory && (
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            {product.subcategory.replace('-', ' ')}
          </p>
        )}
        <h3 className="text-sm font-medium mt-0.5 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold">{formatPrice(displayPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-zinc-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
