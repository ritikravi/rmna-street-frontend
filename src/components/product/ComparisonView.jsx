import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeComparisonView, selectComparisonProducts, selectDifferences, clearComparison } from '../../store/slices/comparisonSlice';
import ProductComparisonCard from './ProductComparisonCard';

export default function ComparisonView() {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.comparison.isComparisonViewOpen);
  const products = useSelector(selectComparisonProducts);
  const differences = useSelector(selectDifferences);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dispatch(closeComparisonView());
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => dispatch(closeComparisonView())}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-7xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} product{products.length > 1 ? 's' : ''} selected
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => dispatch(clearComparison())}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => dispatch(closeComparisonView())}
                  className="text-gray-500 hover:text-gray-700 p-2"
                  aria-label="Close comparison"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products to compare</h3>
                  <p className="text-gray-600">Add products to comparison to see them here</p>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  {Object.values(differences).some(d => d) && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                        <span className="text-sm text-gray-700">Highlighted fields show differences between products</span>
                      </div>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className={`grid gap-6 ${
                    products.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                    products.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    products.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                  }`}>
                    {products.map((product) => (
                      <ProductComparisonCard
                        key={product._id}
                        product={product}
                        differences={differences}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
