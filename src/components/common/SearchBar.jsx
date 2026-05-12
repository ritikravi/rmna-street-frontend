import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', { params: { keyword: query, limit: 6 } });
        setResults(res.data.products);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (productId) => {
    navigate(`/products/${productId}`);
    onClose?.();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-12 py-3 border border-zinc-300 focus:outline-none focus:border-zinc-900 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setShowResults(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
          >
            <FiX size={20} />
          </button>
        )}
      </form>

      {/* Autocomplete Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 shadow-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-zinc-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-500">No products found</div>
          ) : (
            <>
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSelect(product._id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors text-left"
                >
                  <img
                    src={product.images[0]?.url || 'https://placehold.co/60x80?text=RMNA'}
                    alt={product.name}
                    className="w-12 h-16 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.category}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-3 text-sm text-center text-zinc-600 hover:bg-zinc-50 border-t"
              >
                View all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
