'use client';

import { useMediaCache } from '@/utils/MediaCacheContext';
import Loading from './Loading';

export default function MediaPreloader({ children }) {
  const { isLoading, progress } = useMediaCache();

  if (isLoading) {
    return <Loading progress={progress} />;
  }

  return children;
}