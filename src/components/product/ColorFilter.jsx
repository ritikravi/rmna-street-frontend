import { useState } from 'react';

const COLOR_MAP = {
  black: '#000000',
  white: '#FFFFFF',
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  pink: '#EC4899',
  purple: '#A855F7',
  gray: '#6B7280',
  brown: '#92400E',
  beige: '#D4C5B9',
  navy: '#1E3A8A',
  maroon: '#7F1D1D',
  olive: '#65A30D',
  orange: '#F97316',
  multicolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

export default function ColorFilter({ selectedColor, onChange, availableColors = [] }) {
  const colors = availableColors.length > 0 ? availableColors : Object.keys(COLOR_MAP);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(selectedColor === color ? '' : color)}
            className={`group relative w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-black scale-110 shadow-lg'
                : 'border-gray-300 hover:border-gray-400 hover:scale-105'
            }`}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
            aria-label={`Filter by ${color}`}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: COLOR_MAP[color] || color,
                border: color === 'white' ? '1px solid #e5e7eb' : 'none'
              }}
            />
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
