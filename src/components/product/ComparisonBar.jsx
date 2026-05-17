import { useDispatch, useSelector } from 'react-redux';
import { openComparisonView, selectComparisonCount } from '../../store/slices/comparisonSlice';

export default function ComparisonBar() {
  const dispatch = useDispatch();
  const count = useSelector(selectComparisonCount);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-4 px-6 z-40 shadow-2xl transform transition-transform duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div>
            <p className="font-semibold">{count} Product{count > 1 ? 's' : ''} Selected</p>
            <p className="text-sm text-gray-300">Compare up to 4 products</p>
          </div>
        </div>
        
        <button
          onClick={() => dispatch(openComparisonView())}
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}
