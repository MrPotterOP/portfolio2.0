'use client';

import { useState, useEffect } from 'react';
import { preloadMedia } from '@/utils/mediaLoader';

import Loading from './Loading';

export default function MediaPreloader({ mediaUrls, onLoadComplete, children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const totalItems = mediaUrls.length;
        let loadedItems = 0;

        await Promise.all(
          mediaUrls.map(async (url) => {
            await preloadMedia([url]);
            loadedItems++;
            setProgress(Math.round((loadedItems / totalItems) * 100));
          })
        );

        setIsLoading(false);
        if (onLoadComplete) onLoadComplete();
      } catch (error) {
        console.error('Error preloading media:', error);
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [mediaUrls, onLoadComplete]);

  if (isLoading) {
    return (
        <Loading progress={progress} />
    );
  }

  return children;
}
