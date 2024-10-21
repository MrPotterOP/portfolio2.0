export async function preloadMedia(urls) {
    const loadPromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        if (url.endsWith('.mp4')) {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.onloadeddata = () => resolve(url);
          video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
          video.src = url;
        } else {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          img.src = url;
        }
      });
    });
  
    return Promise.all(loadPromises);
  }