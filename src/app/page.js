

// import About from "@/sections/About/About";
// import Hero from "@/sections/Hero/Hero";
// import Work from "@/sections/Work/Work";
// import Skills from "@/sections/Skills/Skills";
// import Services from "@/sections/Services/Services";
// import Experience from "@/sections/Experience/Experience";
// import CTABanner from "@/sections/CTABanner/CTABanner";
// import Footer from "@/sections/Footer/Footer";



// export default function Home() {
//   return (
//     <main>
//       <Hero />
//       <About />
//       <Work />
//       <Skills />
//       <Services />
//       <Experience />
//       <CTABanner />
//       <Footer />
//     </main>
//   );
// }

'use client';

import { useEffect, useState } from "react";
import About from "@/sections/About/About";
import Hero from "@/sections/Hero/Hero";
import Work from "@/sections/Work/Work";
import Skills from "@/sections/Skills/Skills";
import Services from "@/sections/Services/Services";
import Experience from "@/sections/Experience/Experience";
import CTABanner from "@/sections/CTABanner/CTABanner";
import Footer from "@/sections/Footer/Footer";
import Loading from "@/components/Loading";

export default function Home() {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const mediaFolder = '/images';
    const mediaUrls = [
      "aisent.mp4",
      "alvin.mp4",
      "hero.mp4",
      "interior.mp4",
      "showreel.mp4",
      "yantra.mp4",
      "5.jpeg",
      "4.jpeg"
    ];

    const totalMedia = mediaUrls.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const percentage = Math.floor((loadedCount / totalMedia) * 100);
      setLoadingPercentage(percentage);
    };

    const preloadMedia = (url) => {
      return new Promise((resolve, reject) => {
        const isVideo = url.endsWith('.mp4');
        const mediaElement = isVideo ? document.createElement('video') : new Image();
        
        mediaElement.src = `${mediaFolder}/${url}`;
        
        if (isVideo) {
          mediaElement.preload = 'auto';
          mediaElement.load();
        }

        mediaElement.onloadeddata = mediaElement.onload = () => {
          updateProgress();
          resolve(mediaElement);
        };

        mediaElement.onerror = (error) => {
          console.error(`Failed to load ${url}:`, error);
          updateProgress();
          reject(error);
        };
      });
    };

    Promise.all(mediaUrls.map(preloadMedia))
      .then((loadedMedia) => {
        // Store preloaded media in a cache or context if needed
        setMediaLoaded(true);
      })
      .catch((error) => {
        console.error("Some media failed to load:", error);
        setMediaLoaded(true); // Still mark as loaded to show content
      });

  }, []);

  if (!mediaLoaded) {
    return <Loading progress={loadingPercentage} />;
  }

  return (
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
  );
}