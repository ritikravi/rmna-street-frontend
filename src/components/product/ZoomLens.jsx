export default function ZoomLens({ imageUrl, position, isVisible }) {
  if (!isVisible) return null;

  const { lensX, lensY, bgX, bgY } = position;

  return (
    <div
      className="absolute top-0 left-full ml-4 w-96 h-96 border-2 border-gray-300 bg-white shadow-2xl rounded-lg overflow-hidden pointer-events-none z-50"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: '200%',
        backgroundPosition: `-${bgX}px -${bgY}px`,
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
}
