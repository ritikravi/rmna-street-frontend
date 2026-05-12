import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart, addGuestItem } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { formatPrice, getDiscount } from '../utils/helpers';
import { addToRecentlyViewed } from '../utils/recentlyViewed';
import { FiHeart, FiStar, FiZap, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ProductSchema from '../components/common/ProductSchema';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((s) => s.products);
  const { products: wishlistProducts } = useSelector((s) => s.wishlist);
  const { token, user } = useSelector((s) => s.auth);

  const [selectedSize, setSelectedSize] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-zinc-200 aspect-[3/4]" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/4" />
            <div className="h-4 bg-zinc-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.discountPrice);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isWishlisted = wishlistProducts.some((p) => (p._id || p) === product._id);
  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);

  const getEffectiveSize = () => selectedSize || (
    product.category === 'women-accessories' && product.sizes.length === 1
      ? product.sizes[0].size
      : ''
  );

  const handleAddToCart = async () => {
    const effectiveSize = getEffectiveSize();
    if (!effectiveSize) { toast.error('Please select a size'); return; }
    if (!token) {
      dispatch(addGuestItem({ productId: product._id, size: effectiveSize, quantity: 1, product }));
      toast.success('Added to cart');
      return;
    }
    const result = await dispatch(addToCart({ productId: product._id, size: effectiveSize, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) toast.success('Added to cart');
    else toast.error(result.payload || 'Failed to add to cart');
  };

  const handleBuyNow = async () => {
    const effectiveSize = getEffectiveSize();
    if (!effectiveSize) { toast.error('Please select a size'); return; }
    if (!token) { navigate('/login'); return; }
    const result = await dispatch(addToCart({ productId: product._id, size: effectiveSize, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) {
      navigate('/checkout');
    } else {
      toast.error(result.payload || 'Failed');
    }
  };

  const handleWishlist = () => {
    if (!token) { toast.error('Please login'); return; }
    dispatch(toggleWishlist(product._id));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${product._id}`, review);
      toast.success('Review submitted');
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <ProductSchema product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
            <img
              src={product.images[activeImg]?.url || 'https://placehold.co/600x800?text=RMNA'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-zinc-900' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{product.fitType} fit · {product.category}</p>
          <h1 className="font-display text-3xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} size={14} fill={s <= Math.round(product.rating) ? '#c8a96e' : 'none'} stroke="#c8a96e" />
                ))}
              </div>
              <span className="text-sm text-zinc-500">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(displayPrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-zinc-400 line-through">{formatPrice(product.price)}</span>
                <span className="text-red-500 text-sm font-medium">{discount}% off</span>
              </>
            )}
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Size selector — hidden for one-size accessories */}
          {!(product.category === 'women-accessories' && product.sizes.every((s) => s.size === 'one-size')) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase">Select Size</h3>
              {product.category === 'jeans' && <button className="text-xs text-zinc-500 underline">Size Guide</button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`w-12 h-12 text-sm border transition-colors ${
                    selectedSize === s.size
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : s.stock === 0
                      ? 'border-zinc-200 text-zinc-300 cursor-not-allowed line-through'
                      : 'border-zinc-300 hover:border-zinc-900'
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSizeObj && (
              <p className="text-xs text-zinc-500 mt-2">
                {selectedSizeObj.stock <= 5 ? `Only ${selectedSizeObj.stock} left!` : 'In stock'}
              </p>
            )}
          </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleBuyNow} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiZap size={18} />
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-300 hover:border-zinc-900 text-sm transition-colors"
              aria-label="Add to cart"
            >
              <FiShoppingBag size={16} />
              Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 border transition-colors ${isWishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-zinc-300 hover:border-zinc-900'}`}
              aria-label="Wishlist"
            >
              <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="text-xs border border-zinc-200 px-2 py-1 text-zinc-500">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 border-t pt-12">
        <h2 className="font-display text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Review list */}
          <div className="space-y-6">
            {product.reviews?.length === 0 ? (
              <p className="text-zinc-500">No reviews yet. Be the first!</p>
            ) : (
              product.reviews?.map((r) => (
                <div key={r._id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <FiStar key={s} size={12} fill={s <= r.rating ? '#c8a96e' : 'none'} stroke="#c8a96e" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{r.name}</span>
                  </div>
                  <p className="text-sm text-zinc-600">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write review */}
          {token && (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <h3 className="font-semibold">Write a Review</h3>
              <div>
                <label className="text-sm text-zinc-600 block mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setReview((r) => ({ ...r, rating: s }))}>
                      <FiStar size={20} fill={s <= review.rating ? '#c8a96e' : 'none'} stroke="#c8a96e" />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={review.comment}
                onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
                required
                className="input-field resize-none"
              />
              <button type="submit" disabled={submittingReview} className="btn-primary">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
