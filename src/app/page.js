

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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const imageFolder = '/images'; // Use the correct path for Next.js public folder
    const imageUrls = [
      "aisent.mp4",
      "alvin.mp4",
      "hero.mp4",
      "interior.mp4",
      "showreel.mp4",
      "yantra.mp4",
      "5.jpeg"
    ];

    const imagePromises = imageUrls.map((imageUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `${imageFolder}/${imageUrl}`;
        img.onload = () => {
          resolve();
          setLoadingPercentage((prevPercentage) =>
            prevPercentage + (100 / imageUrls.length)
          );
        };
        img.onerror = resolve; // To avoid blocking if an image fails to load
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(() => {
        setImagesLoaded(true); // Mark images as loaded even if there's an error
      });
  }, []);

  if (!imagesLoaded) {
    return <Loading progress={loadingPercentage} />; // Pass progress to loading component
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
