export default function NotifyMeButton({ onClick, isSubscribed }) {
  return (
    <button
      onClick={onClick}
      disabled={isSubscribed}
      className={`w-full py-4 rounded-lg font-semibold transition-colors ${
        isSubscribed
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {isSubscribed ? (
        <span className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>You'll be notified</span>
        </span>
      ) : (
        <span className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Notify Me When Available</span>
        </span>
      )}
    </button>
  );
}
