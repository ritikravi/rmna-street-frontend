import { useState, useEffect } from 'react';
import SizeChart from './SizeChart';
import { getSizeGuideForCategory } from '../../constants/sizeGuides';

export default function SizeGuideModal({ isOpen, onClose, sizeGuide, category }) {
  const [unit, setUnit] = useState('cm');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use product's size guide or fall back to template
  const template = getSizeGuideForCategory(category || sizeGuide?.category);
  const measurements = sizeGuide?.measurements || template?.defaultMeasurements || [];
  const dimensions = template?.dimensions || [];

  if (!template || measurements.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Size Guide</h2>
            <p className="text-gray-600">Size guide not available for this product.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-3xl w-full">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
              <div className="flex items-center space-x-4">
                {/* Unit Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      unit === 'cm' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    CM
                  </button>
                  <button
                    onClick={() => setUnit('inches')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      unit === 'inches' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Inches
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2"
                  aria-label="Close size guide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
                  {(category || sizeGuide?.category || '').replace('-', ' ')} Measurements
                </h3>
                <p className="text-sm text-gray-600">
                  All measurements are approximate and may vary slightly.
                </p>
              </div>

              <SizeChart
                measurements={measurements}
                dimensions={dimensions}
                unit={unit}
              />

              {/* How to Measure */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">How to Measure</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {dimensions.includes('chest') && (
                    <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                  )}
                  {dimensions.includes('waist') && (
                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                  )}
                  {dimensions.includes('hip') && (
                    <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
                  )}
                  {dimensions.includes('length') && (
                    <li><strong>Length:</strong> Measure from shoulder to hem</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
