/**
 * Image Optimization Utilities
 * Cloudinary transformations for automatic optimization
 */

/**
 * Generate optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return as-is if not Cloudinary
  }

  const {
    width = 'auto',
    height = 'auto',
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
    dpr = 'auto', // Device pixel ratio
  } = options;

  // Extract parts of Cloudinary URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    `dpr_${dpr}`,
  ].join(',');

  // Reconstruct URL with transformations
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}

/**
 * Preset sizes for common use cases
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 100, height: 133, crop: 'fill' },
  card: { width: 400, height: 533, crop: 'limit' },
  cardLarge: { width: 600, height: 800, crop: 'limit' },
  detail: { width: 800, height: 1067, crop: 'limit' },
  detailLarge: { width: 1200, height: 1600, crop: 'limit' },
  hero: { width: 1600, height: 900, crop: 'fill' },
  square: { width: 400, height: 400, crop: 'fill' },
  squareLarge: { width: 800, height: 800, crop: 'fill' },
};

/**
 * Get optimized image URL with preset
 * @param {string} url - Original URL
 * @param {string} preset - Preset name from IMAGE_PRESETS
 * @returns {string} Optimized URL
 */
export function getPresetImage(url, preset = 'card') {
  const options = IMAGE_PRESETS[preset] || IMAGE_PRESETS.card;
  return getOptimizedImageUrl(url, options);
}

/**
 * Generate srcset for responsive images
 * @param {string} url - Original URL
 * @param {array} widths - Array of widths [400, 800, 1200]
 * @returns {string} srcset string
 */
export function generateSrcSet(url, widths = [400, 800, 1200]) {
  if (!url || !url.includes('cloudinary.com')) {
    return '';
  }

  return widths
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl(url, { width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Preload critical images
 * @param {string} url - Image URL to preload
 */
export function preloadImage(url) {
  if (!url) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}
