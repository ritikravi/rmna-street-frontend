import { useState, useEffect } from 'react';
import ColorFilter from './ColorFilter';
import BrandFilter from './BrandFilter';
import PriceRangeFilter from './PriceRangeFilter';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function FilterPanel({ 
  category, 
  onFilterChange, 
  initialFilters = {} 
}) {
  const [filters, setFilters] = useState({
    color: initialFilters.color || '',
    brands: initialFilters.brands || [],
    priceRange: initialFilters.priceRange || { min: 0, max: 10000 }
  });

  const [metadata, setMetadata] = useState({
    colors: [],
    brands: [],
    priceRange: { min: 0, max: 10000 }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchFilterMetadata();
  }, [category]);

  const fetchFilterMetadata = async () => {
    try {
      const params = category ? `?category=${category}` : '';
      const { data } = await axios.get(`${API_URL}/products/filters${params}`);
      if (data.success) {
        setMetadata(data.filters);
        setFilters(prev => ({
          ...prev,
          priceRange: data.filters.priceRange
        }));
      }
    } catch (error) {
      console.error('Failed to fetch filter metadata:', error);
    }
  };

  const handleColorChange = (color) => {
    setFilters(prev => ({ ...prev, color }));
  };

  const handleBrandChange = (brands) => {
    setFilters(prev => ({ ...prev, brands }));
  };

  const handlePriceChange = (priceRange) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      color: '',
      brands: [],
      priceRange: metadata.priceRange
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = 
    (filters.color ? 1 : 0) + 
    filters.brands.length + 
    (filters.priceRange.min !== metadata.priceRange.min || filters.priceRange.max !== metadata.priceRange.max ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Panel */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-full bg-white z-50 lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Active Filters Count */}
          {activeFilterCount > 0 && (
            <div className="text-sm text-gray-600">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </div>
          )}

          {/* Filters */}
          <div className="space-y-6 border-t pt-6">
            <ColorFilter
              selectedColor={filters.color}
              onChange={handleColorChange}
              availableColors={metadata.colors}
            />

            <div className="border-t pt-6">
              <BrandFilter
                selectedBrands={filters.brands}
                onChange={handleBrandChange}
                availableBrands={metadata.brands}
              />
            </div>

            <div className="border-t pt-6">
              <PriceRangeFilter
                minPrice={metadata.priceRange.min}
                maxPrice={metadata.priceRange.max}
                selectedMin={filters.priceRange.min}
                selectedMax={filters.priceRange.max}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 border-t pt-6">
            <button
              onClick={handleApply}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
