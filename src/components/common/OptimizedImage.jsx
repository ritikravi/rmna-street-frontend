import { useState } from 'react';
import { getOptimizedImageUrl, generateSrcSet } from '../../utils/imageOptimizer';

/**
 * Optimized Image Component
 * - Automatic WebP conversion
 * - Lazy loading
 * - Responsive srcset
 * - Blur placeholder
 * - Error handling
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  preset,
  width,
  height,
  loading = 'lazy',
  responsive = true,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Don't optimize if no src or not Cloudinary
  if (!src) {
    return (
      <div className={`bg-zinc-100 flex items-center justify-center ${className}`}>
        <span className="text-zinc-400 text-xs">No image</span>
      </div>
    );
  }

  // Generate optimized URL only for Cloudinary images
  const optimizedSrc = src.includes('cloudinary.com')
    ? getOptimizedImageUrl(src, {
        width: width || 'auto',
        height: height || 'auto',
        quality: 'auto:good',
        format: 'auto',
      })
    : src;

  // Generate srcset for responsive images
  const srcSet = responsive && src?.includes('cloudinary.com')
    ? generateSrcSet(src, [400, 800, 1200])
    : '';

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Fallback placeholder
  if (hasError) {
    return (
      <div className={`bg-zinc-100 flex items-center justify-center ${className}`}>
        <span className="text-zinc-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {/* Blur placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-100 animate-pulse z-10" />
      )}
      
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={responsive ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={className}
        {...props}
      />
    </>
  );
}
