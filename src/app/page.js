

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
  const [mediaLoaded, setMediaLoaded] = useState(false); // Handle both images and videos
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const mediaFolder = '/images'; // Use the correct path for Next.js public folder
    const mediaUrls = [
      "aisent.mp4",
      "alvin.mp4",
      "hero.mp4",
      "interior.mp4",
      "showreel.mp4",
      "yantra.mp4",
      "5.jpeg"
    ];

    const totalMedia = mediaUrls.length;

    // Helper to update progress and ensure percentage has no decimals
    const updateProgress = () => {
      setLoadingPercentage((prev) => Math.min(Math.floor(prev + 100 / totalMedia), 100));
    };

    // Image and video loading promises
    const mediaPromises = mediaUrls.map((url) => {
      return new Promise((resolve) => {
        const isVideo = url.endsWith('.mp4');
        const mediaElement = isVideo ? document.createElement('video') : new Image();
        mediaElement.src = `${mediaFolder}/${url}`;
        
        // Handle load for both image and video
        mediaElement.onloadeddata = mediaElement.onload = () => {
          updateProgress();
          resolve();
        };
        
        // Handle error case
        mediaElement.onerror = resolve; // Even if media fails, resolve to not block
      });
    });

    Promise.all(mediaPromises)
      .then(() => {
        setMediaLoaded(true); // All media items are loaded
      })
      .catch(() => {
        setMediaLoaded(true); // In case of error, mark as loaded
      });
  }, []);

  // Display loading screen until media is loaded
  if (!mediaLoaded) {
    return <Loading progress={loadingPercentage} />; // Pass progress to loading component
  }

  // Once loaded, display the actual content
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
