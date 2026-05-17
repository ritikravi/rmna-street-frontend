import { useDispatch } from 'react-redux';
import { removeFromComparison } from '../../store/slices/comparisonSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductComparisonCard({ product, differences }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product.totalStock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    const availableSize = product.sizes?.find(s => s.stock > 0);
    if (!availableSize) {
      toast.error('No sizes available');
      return;
    }
    dispatch(addToCart({ ...product, selectedSize: availableSize.size, quantity: 1 }));
    toast.success('Added to cart');
  };

  const handleRemove = () => {
    dispatch(removeFromComparison(product._id));
    toast.success('Removed from comparison');
  };

  const getDifferenceClass = (field) => {
    return differences[field] ? 'bg-yellow-50 border-l-4 border-yellow-400' : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/400x533?text=RMNA'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Remove from comparison"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-gray-700 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className={`py-2 px-3 rounded ${getDifferenceClass('price')}`}>
          <p className="text-xs text-gray-600 mb-1">Price</p>
          {product.discountPrice > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          )}
        </div>

        {/* Color */}
        <div className={`py-2 px-3 rounded ${getDifferenceClass('color')}`}>
          <p className="text-xs text-gray-600 mb-1">Color</p>
          <p className="text-sm font-medium capitalize">{product.color || 'N/A'}</p>
        </div>

        {/* Brand */}
        <div className={`py-2 px-3 rounded ${getDifferenceClass('brand')}`}>
          <p className="text-xs text-gray-600 mb-1">Brand</p>
          <p className="text-sm font-medium">{product.brand || 'N/A'}</p>
        </div>

        {/* Sizes */}
        <div className={`py-2 px-3 rounded ${getDifferenceClass('sizes')}`}>
          <p className="text-xs text-gray-600 mb-1">Available Sizes</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes?.map((s, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {s.size}
              </span>
            ))}
          </div>
        </div>

        {/* Fit Type */}
        {product.fitType && (
          <div className={`py-2 px-3 rounded ${getDifferenceClass('fitType')}`}>
            <p className="text-xs text-gray-600 mb-1">Fit</p>
            <p className="text-sm font-medium capitalize">{product.fitType}</p>
          </div>
        )}

        {/* Rating */}
        <div className={`py-2 px-3 rounded ${getDifferenceClass('rating')}`}>
          <p className="text-xs text-gray-600 mb-1">Rating</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.totalStock === 0}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
