import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { FiFilter, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, loading, total, pages } = useSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    fitType: searchParams.get('fitType') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  // Sync URL params to filters when navigating from navbar links
  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
      fitType: searchParams.get('fitType') || '',
      size: searchParams.get('size') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'newest',
      page: Number(searchParams.get('page')) || 1,
    });
  }, [searchParams.toString()]);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    dispatch(fetchProducts(params));
  }, [filters, dispatch]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Banner for Men's Jeans */}
      {filters.category === 'jeans' && (
        <div className="mb-8 bg-zinc-900 text-white px-8 py-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-2">Premium Collection</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Men's Jeans</h1>
          <p className="text-zinc-400 text-sm mt-2">Sizes 28 · 30 · 32 · 34 · 36 · 38</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {!filters.category && (
            <h1 className="font-display text-3xl font-bold">
              {filters.keyword ? `"${filters.keyword}"` : filters.fitType ? `${filters.fitType} Fit` : 'All Products'}
            </h1>
          )}
          <p className="text-zinc-500 text-sm mt-1">{total} products</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="border border-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-900"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm"
          >
            <FiFilter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <ProductFilters filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}><FiX size={20} /></button>
              </div>
              <ProductFilters filters={filters} onChange={(u) => { handleFilterChange(u); setShowFilters(false); }} />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-[3/4]" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-zinc-200 rounded w-1/2" />
                    <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg">No products found</p>
              <button onClick={() => handleFilterChange({ keyword: '', fitType: '', size: '', minPrice: '', maxPrice: '' })} className="mt-4 text-sm underline">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {items.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
                      className={`w-9 h-9 text-sm border transition-colors ${
                        filters.page === i + 1 ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
                      }`}
                    >
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
