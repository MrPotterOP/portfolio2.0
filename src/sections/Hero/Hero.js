'use client';

import styles from './styles.module.css';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useMediaCache } from '@/utils/MediaCacheContext';

function Hero() {
  const [outOfView, setOutOfView] = useState(true);
  const ref = useRef(null);
  const { cache } = useMediaCache(); 
  const videoSrc = cache.heroVideo; 

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setOutOfView(!entry.isIntersecting);
    });
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleLink = (cn) => {
    const element = document.body.getElementsByTagName('main')[0].getElementsByClassName(cn);
    if (element && element.length > 0) {
      element[0].scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className={styles.hero} id="top">
      <div className={styles.heroBox}>
        <div className={styles.heroBg} style={{ opacity: outOfView ? 0 : 1 }}>
          {videoSrc && (
            <video autoPlay muted loop playsInline className={styles.heroVideo}>
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
        <div className={styles.heroContent} >
          <div className={styles.nav} ref={ref}>
            <div className={styles.heroLogo}>
              <Link href="/" className={styles.textLogo}>
                shubham
                <br />ubarhande
              </Link>
            </div>
            <div className={styles.heroMenu}>
              <div className={styles.heroMenuLinks}>
                <Link href="#work" onClick={() => handleLink('work')}>WORK</Link>
                <Link href="#about" onClick={() => handleLink('about')}>ABOUT</Link>
                <Link href="#contact" onClick={() => handleLink('footer')}>CONTACT</Link>
                <Link href="#contact" onClick={() => handleLink('footer')} className={styles.cta}>START A PROJECT</Link>
              </div>
            </div>
          </div>
          <div className={styles.heroText}>
            <h1>I&apos;m shubham, full stack web <br /> developer and designer</h1>
            <button className={`${styles.btnPlane} link`} onClick={() => handleLink('about')}>((scroll))</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;