/**
 * Makes white/light pixels in an image transparent using Canvas API
 * @param imageSrc - Image source (can be import or URL)
 * @param threshold - RGB threshold for "white" pixels (default: 245)
 * @param cacheKey - localStorage key for caching result
 * @returns Promise with data URL of transparent image, or null on error
 */
export const transparentizeWhite = async (
  imageSrc: string,
  threshold: number = 245,
  cacheKey?: string
): Promise<string | null> => {
  try {
    // Check cache first
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log('Using cached transparent image');
        return cached;
      }
    }

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageSrc;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Draw image
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let removedPixels = 0;
    const totalPixels = canvas.width * canvas.height;

    // Make white pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel is "nearly white"
      if (r > threshold && g > threshold && b > threshold) {
        data[i + 3] = 0; // Set alpha to 0
        removedPixels++;
      }
    }
    
    // Safety check: if too many pixels removed, something is wrong
    const removalPercentage = (removedPixels / totalPixels) * 100;
    console.log(`Removed ${removalPercentage.toFixed(1)}% of pixels`);
    
    if (removalPercentage > 80) {
      console.warn('Too many pixels removed, returning original');
      return null;
    }
    
    // Put modified data back
    ctx.putImageData(imageData, 0, 0);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    
    // Cache result
    if (cacheKey) {
      try {
        localStorage.setItem(cacheKey, dataUrl);
        console.log('Cached transparent image');
      } catch (e) {
        console.warn('Failed to cache image:', e);
      }
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error making image transparent:', error);
    return null;
  }
};
