'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

// 1. Create the Context
const MediaCacheContext = createContext({
  cache: {},
  isLoading: true,
  progress: 0,
  itemProgress: {}, // Individual item progress
  loadingStatus: {}, // Status of each item
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
  const [itemProgress, setItemProgress] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});

  // Use a ref to store object URLs for later cleanup
  const objectUrls = useRef([]);

  useEffect(() => {
    const preloadMedia = async () => {
      setIsLoading(true);
      setProgress(0);
      
      const totalItems = mediaToPreload.length;
      if (totalItems === 0) {
        setIsLoading(false);
        setProgress(100);
        return;
      }

      // Initialize progress tracking for each item
      const initialProgress = {};
      const initialStatus = {};
      mediaToPreload.forEach(media => {
        initialProgress[media.id] = 0;
        initialStatus[media.id] = 'loading';
      });
      setItemProgress(initialProgress);
      setLoadingStatus(initialStatus);

      const preloadPromises = mediaToPreload.map(async (media) => {
        try {
          const response = await fetch(media.url);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${media.url}: ${response.statusText}`);
          }

          const contentLength = response.headers.get('Content-Length');
          const total = contentLength ? parseInt(contentLength, 10) : 0;
          
          let loaded = 0;
          const chunks = [];
          const reader = response.body?.getReader();

          if (!reader) {
            throw new Error('ReadableStream not supported');
          }

          // Read the stream and track progress
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            // Update individual item progress
            if (total > 0) {
              const itemProgressPercent = Math.round((loaded / total) * 100);
              setItemProgress(prev => ({
                ...prev,
                [media.id]: itemProgressPercent
              }));
              
              // Calculate overall progress
              setItemProgress(currentProgress => {
                const updatedProgress = {
                  ...currentProgress,
                  [media.id]: itemProgressPercent
                };
                
                const totalProgress = Object.values(updatedProgress).reduce((sum, val) => sum + val, 0);
                const overallProgress = Math.round(totalProgress / totalItems);
                setProgress(overallProgress);
                
                return updatedProgress;
              });
            }
          }

          // Reconstruct the blob from chunks
          const blob = new Blob(chunks, { type: response.headers.get('Content-Type') || '' });
          const objectUrl = URL.createObjectURL(blob);

          // Store the URL for cleanup
          objectUrls.current.push(objectUrl);

          setCache(prevCache => ({
            ...prevCache,
            [media.id]: objectUrl,
          }));

          setLoadingStatus(prev => ({
            ...prev,
            [media.id]: 'completed'
          }));

          // Ensure final progress is 100% for this item
          setItemProgress(prev => ({
            ...prev,
            [media.id]: 100
          }));

        } catch (error) {
          console.error(`Error preloading media with id "${media.id}":`, error);
          
          setLoadingStatus(prev => ({
            ...prev,
            [media.id]: 'error'
          }));
          
          // Set progress to 100% even on error to not block overall completion
          setItemProgress(prev => ({
            ...prev,
            [media.id]: 100
          }));
        }
      });

      await Promise.all(preloadPromises);

      // Final progress calculation
      setProgress(100);
      
      // A small delay can sometimes help ensure rendering is smooth after loading
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    };

    preloadMedia();

    // Cleanup function to revoke object URLs and prevent memory leaks
    return () => {
      objectUrls.current.forEach(url => URL.revokeObjectURL(url));
      objectUrls.current = [];
    };
  }, [mediaToPreload]);

  const value = { 
    cache, 
    isLoading, 
    progress, 
    itemProgress, 
    loadingStatus 
  };

  return (
    <MediaCacheContext.Provider value={value}>
      {children}
    </MediaCacheContext.Provider>
  );
};