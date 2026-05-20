import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatPrice, getDiscount } from '../../utils/helpers';
import CompareButton from './CompareButton';
import OptimizedImage from '../common/OptimizedImage';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { products: wishlistProducts } = useSelector((s) => s.wishlist);
  const { token } = useSelector((s) => s.auth);

  const isWishlisted = wishlistProducts.some(
    (p) => (p._id || p) === product._id
  );
  const discount = getDiscount(product.price, product.discountPrice);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to add to wishlist'); return; }
    dispatch(toggleWishlist(product._id));
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      {/* Image Container with Premium Hover Effect */}
      <div className="relative overflow-hidden bg-zinc-50 aspect-[3/4] mb-4">
        <OptimizedImage
          src={product.images[0]?.url || 'https://placehold.co/400x533?text=RMNA'}
          alt={product.name}
          width={400}
          height={533}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          responsive
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 font-bold tracking-wider uppercase shadow-lg">
            {discount}% OFF
          </span>
        )}
        
        {/* Sold Out Overlay */}
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-bold tracking-widest uppercase text-zinc-900 bg-white px-6 py-2 shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isWishlisted ? 'text-red-500' : 'text-zinc-600 hover:text-red-500'
          }`}
          aria-label="Toggle wishlist"
        >
          <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
        
        {/* Compare Button */}
        <div className="absolute top-14 right-3">
          <CompareButton product={product} />
        </div>
        
        {/* Quick View Hint */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs font-semibold tracking-wider uppercase text-center text-zinc-900">
            Quick View →
          </p>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-1.5">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
          {product.fitType} fit
        </p>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-zinc-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-zinc-900">{formatPrice(displayPrice)}</span>
          {discount > 0 && (
            <span className="text-sm text-zinc-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
