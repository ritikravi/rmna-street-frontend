import { useState, useEffect } from 'react';

export default function PriceRangeFilter({ 
  minPrice = 0, 
  maxPrice = 10000, 
  selectedMin, 
  selectedMax, 
  onChange 
}) {
  const [localMin, setLocalMin] = useState(selectedMin || minPrice);
  const [localMax, setLocalMax] = useState(selectedMax || maxPrice);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ min: localMin, max: localMax });
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [localMin, localMax]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
      
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">₹{localMin}</span>
        <span className="text-gray-500">-</span>
        <span className="font-medium text-gray-900">₹{localMax}</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMin}
            onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax - 100))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMax}
            onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin + 100))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>
      </div>
    </div>
  );
}
