'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

// 1. Create the Context
const MediaCacheContext = createContext({
  cache: {},
  isLoading: true,
  progress: 0,
});

// 2. Create a custom hook for easy consumption
export const useMediaCache = () => {
  return useContext(MediaCacheContext);
};

// 3. Create the Provider component
export const MediaCacheProvider = ({ mediaToPreload, children }) => {
  const [cache, setCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Use a ref to store object URLs for later cleanup
  const objectUrls = useRef([]);

  useEffect(() => {
    const preloadMedia = async () => {
      setIsLoading(true);
      const totalItems = mediaToPreload.length;
      if (totalItems === 0) {
        setIsLoading(false);
        setProgress(100);
        return;
      }
      
      let loadedItems = 0;

      const preloadPromises = mediaToPreload.map(async (media) => {
        try {
          const response = await fetch(media.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${media.url}: ${response.statusText}`);
          }
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          // Store the URL for cleanup
          objectUrls.current.push(objectUrl);

          setCache(prevCache => ({
            ...prevCache,
            [media.id]: objectUrl,
          }));

        } catch (error) {
          console.error(`Error preloading media with id "${media.id}":`, error);
          // Still update progress to not block the UI forever on a single failure
        } finally {
            loadedItems++;
            setProgress(Math.round((loadedItems / totalItems) * 100));
        }
      });

      await Promise.all(preloadPromises);

      // A small delay can sometimes help ensure rendering is smooth after loading
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    };

    preloadMedia();

    // Cleanup function to revoke object URLs and prevent memory leaks
    return () => {
      objectUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaToPreload]);

  const value = { cache, isLoading, progress };

  return (
    <MediaCacheContext.Provider value={value}>
      {children}
    </MediaCacheContext.Provider>
  );
};