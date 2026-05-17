import { useEffect, useState } from 'react';
import axios from 'axios';
import ColorFilter from './ColorFilter';
import BrandFilter from './BrandFilter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ProductFilters({ filters, onChange }) {
  const sizes = ['28', '30', '32', '34', '36', '38'];
  const fits = ['straight', 'baggy', 'slim', 'regular'];
  const [metadata, setMetadata] = useState({ colors: [], brands: [] });

  useEffect(() => {
    fetchFilterMetadata();
  }, [filters.category]);

  const fetchFilterMetadata = async () => {
    try {
      const params = filters.category ? `?category=${filters.category}` : '';
      const { data } = await axios.get(`${API_URL}/products/filters${params}`);
      if (data.success) {
        setMetadata(data.filters);
      }
    } catch (error) {
      console.error('Failed to fetch filter metadata:', error);
    }
  };

  return (
    <aside className="space-y-6">
      {/* Color Filter */}
      {metadata.colors.length > 0 && (
        <div>
          <ColorFilter
            selectedColor={filters.color || ''}
            onChange={(color) => onChange({ color })}
            availableColors={metadata.colors}
          />
        </div>
      )}

      {/* Brand Filter */}
      {metadata.brands.length > 0 && (
        <div>
          <BrandFilter
            selectedBrands={filters.brands || []}
            onChange={(brands) => onChange({ brands })}
            availableBrands={metadata.brands}
          />
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Fit Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fitType"
              value=""
              checked={!filters.fitType}
              onChange={() => onChange({ fitType: '' })}
              className="accent-zinc-900"
            />
            <span className="text-sm">All</span>
          </label>
          {fits.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fitType"
                value={f}
                checked={filters.fitType === f}
                onChange={() => onChange({ fitType: f })}
                className="accent-zinc-900"
              />
              <span className="text-sm capitalize">{f}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ size: filters.size === s ? '' : s })}
              className={`w-10 h-10 text-sm border transition-colors ${
                filters.size === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="input-field text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({ fitType: '', size: '', minPrice: '', maxPrice: '', color: '', brands: [] })}
        className="text-sm text-zinc-500 underline hover:text-zinc-900"
      >
        Clear filters
      </button>
    </aside>
  );
}
