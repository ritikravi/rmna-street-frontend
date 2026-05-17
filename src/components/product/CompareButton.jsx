import { useDispatch, useSelector } from 'react-redux';
import { addToComparison, removeFromComparison, selectIsInComparison, selectCanAddMore } from '../../store/slices/comparisonSlice';
import toast from 'react-hot-toast';

export default function CompareButton({ product }) {
  const dispatch = useDispatch();
  const isInComparison = useSelector(selectIsInComparison(product._id));
  const canAddMore = useSelector(selectCanAddMore);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInComparison) {
      dispatch(removeFromComparison(product._id));
      toast.success('Removed from comparison');
    } else {
      if (!canAddMore) {
        toast.error('Maximum 4 products can be compared');
        return;
      }
      dispatch(addToComparison(product));
      toast.success('Added to comparison');
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!isInComparison && !canAddMore}
      className={`
        p-2 rounded-full transition-all
        ${isInComparison 
          ? 'bg-black text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }
        ${!isInComparison && !canAddMore ? 'opacity-50 cursor-not-allowed' : ''}
        shadow-md hover:shadow-lg
      `}
      title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
      aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  );
}
