import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const SIZES = ['26', '28', '30', '32', '34', '36'];

export default function GirlsJeansPage() {
  const dispatch = useDispatch();
  const { items, loading, total, pages } = useSelector((s) => s.products);
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const params = { category: 'girls-jeans' };
    if (filters.size) params.size = filters.size;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    dispatch(fetchProducts(params));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, dispatch]);

  const handleFilterChange = (updates) => setFilters((prev) => ({ ...prev, ...updates, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8 bg-zinc-900 text-white px-8 py-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-2">New Collection</p>
        <h1 className="font-display text-4xl font-bold tracking-tight">Girls Jeans</h1>
        <p className="text-zinc-400 text-sm mt-2">Sizes 26 · 28 · 30 · 32 · 34 · 36</p>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-500 text-sm">{total} products</p>
        <div className="flex items-center gap-3">
          <select value={filters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="border border-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-900">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
            <FiFilter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-56 flex-shrink-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} onClick={() => handleFilterChange({ size: filters.size === s ? '' : s })}
                  className={`w-12 h-10 text-sm border transition-colors ${filters.size === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Price Range</h3>
            <div className="space-y-2">
              <input type="number" placeholder="Min ₹" value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange({ minPrice: e.target.value })} className="input-field text-sm" />
              <input type="number" placeholder="Max ₹" value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange({ maxPrice: e.target.value })} className="input-field text-sm" />
            </div>
          </div>
          <button onClick={() => handleFilterChange({ size: '', minPrice: '', maxPrice: '' })}
            className="text-sm text-zinc-500 underline hover:text-zinc-900">Clear filters</button>
        </aside>

        {/* Mobile drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}><FiX size={20} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button key={s} onClick={() => { handleFilterChange({ size: filters.size === s ? '' : s }); setShowFilters(false); }}
                        className={`w-12 h-10 text-sm border transition-colors ${filters.size === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-[3/4]" />
                  <div className="mt-3 space-y-2"><div className="h-3 bg-zinc-200 rounded w-1/2" /><div className="h-4 bg-zinc-200 rounded w-3/4" /></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg">No products found</p>
              <button onClick={() => handleFilterChange({ size: '', minPrice: '', maxPrice: '' })} className="mt-4 text-sm underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {items.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
                      className={`w-9 h-9 text-sm border transition-colors ${filters.page === i + 1 ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
