'use client';

import { Suspense } from 'react';
import Hero from "@/sections/Hero/Hero";
import Work from "@/sections/Work/Work";
import Skills from "@/sections/Skills/Skills";
import Services from "@/sections/Services/Services";
import Experience from "@/sections/Experience/Experience";
import CTABanner from "@/sections/CTABanner/CTABanner";
import Footer from "@/sections/Footer/Footer";
import About from "@/sections/About/About";
import { MediaCacheProvider } from '@/utils/MediaCacheContext';
import MediaPreloader from '@/components/MediaPreloader';


const criticalMedia = [
  { id: 'heroVideo', url: '/images/hero.mp4', type: 'video' },
  { id: 'aboutVideo', url: '/images/showreel.mp4', type: 'video' },
  // { id: 'mainLogo', url: '/images/logo.png', type: 'image' }
];

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediaCacheProvider mediaToPreload={criticalMedia}>
        <MediaPreloader>
          <main>
            <Hero />
            <About />
            <Work />
            <Skills />
            <Services />
            <Experience />
            <CTABanner />
            <Footer />
          </main>
        </MediaPreloader>
      </MediaCacheProvider>
    </Suspense>
  );
}