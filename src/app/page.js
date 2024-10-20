

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

'use client'

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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleMediaLoad = () => {
      setLoading(false);
    };

    const mediaElements = [...document.querySelectorAll("img, video")];
    let loadedMediaCount = 0;
    const totalMedia = mediaElements.length;

    if (totalMedia === 0) {
      handleMediaLoad(); // No media to load
      return;
    }

    mediaElements.forEach((media) => {
      const handleLoad = () => {
        loadedMediaCount++;
        updateProgress(loadedMediaCount, totalMedia);
        
        if (loadedMediaCount === totalMedia) {
          handleMediaLoad();
        }
      };

      if (media.complete || media.readyState === 4) {
        handleLoad(); // If media is already loaded
      } else {
        media.onload = handleLoad; // For images
        media.onloadedmetadata = handleLoad; // For videos
        media.onerror = handleLoad; // Count as loaded even on error
      }
    });

    const updateProgress = (loaded, total) => {
      setProgress(Math.round((loaded / total) * 100));
    };

    // Cleanup function to avoid memory leaks
    return () => {
      mediaElements.forEach((media) => {
        media.onload = null;
        media.onloadedmetadata = null;
        media.onerror = null; // Remove event listeners
      });
    };
  }, []);

  if (loading) {
    return <Loading progress={progress} />; // Pass progress to loading component
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
