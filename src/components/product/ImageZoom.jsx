import { useState, useRef, useEffect } from 'react';
import ZoomLens from './ZoomLens';

const isMobileOrTablet = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 1024;
};

export default function ImageZoom({ imageUrl, highResImageUrl, alt }) {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ lensX: 0, lensY: 0, bgX: 0, bgY: 0 });
  const [isDisabled, setIsDisabled] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    setIsDisabled(isMobileOrTablet());
  }, []);

  const handleMouseMove = (e) => {
    if (isDisabled || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate zoom lens position (centered on cursor)
    const lensWidth = 150;
    const lensHeight = 150;
    const lensX = x - lensWidth / 2;
    const lensY = y - lensHeight / 2;

    // Calculate magnified image offset (2x zoom)
    const zoomLevel = 2;
    const bgX = x * zoomLevel;
    const bgY = y * zoomLevel;

    setPosition({ lensX, lensY, bgX, bgY });
  };

  const handleMouseEnter = () => {
    if (!isDisabled) setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const zoomImageUrl = highResImageUrl || imageUrl;

  return (
    <div className="relative inline-block">
      <div
        ref={imageRef}
        className="relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
        
        {/* Zoom Icon Indicator */}
        {!isDisabled && !isZooming && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full shadow-md">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        )}
      </div>

      {/* Zoom Lens */}
      {!isDisabled && (
        <ZoomLens
          imageUrl={zoomImageUrl}
          position={position}
          isVisible={isZooming}
        />
      )}
    </div>
  );
}
