'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';

const CTABanner = () => {
  const images = [
    "/images/1.gif", "/images/2.jpeg", "/images/3.jpeg", 
    "/images/4.jpeg", "/images/5.jpeg", "/images/6.gif"
  ];

  const rotations = [
    "rotate(-12deg)", "rotate(6deg)", "rotate(-7deg)",
    "rotate(8deg)", "rotate(-12deg)", "rotate(12deg)"
  ];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  });

  const scrollText = useTransform(scrollYProgress, [0, 1], ['100px', '-20px']);

  const [hoveredIndices, setHoveredIndices] = useState([]);

  const handleMouseMove = (event) => {

    const newHoveredIndices = images.map((_, index) => {
      const imageRect = event.currentTarget.children[index].getBoundingClientRect();
      const relativeX = event.clientX - imageRect.left;
      const relativeY = event.clientY - imageRect.top;

      if (relativeX >= 0 && relativeX <= imageRect.width && relativeY >= 0 && relativeY <= imageRect.height) {
        return {
          index,
          x: ((relativeX - imageRect.width / 3) / 4) * -1,
          y: ((relativeY - imageRect.height / 3) / 4) * -1
        };
      }
      return null;
    }).filter(Boolean);

    setHoveredIndices(newHoveredIndices);
  };

  const handleMouseLeave = () => {
    setHoveredIndices([]);
  };

  return (
    <section className="cta">
      <div className={styles.ctaBox} ref={ref}>
        <div 
          className={styles.ctaImagesBox}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {images.map((image, index) => {
            const hoverInfo = hoveredIndices.find(item => item.index === index);
            const x = hoverInfo?.x || 0;
            const y = hoverInfo?.y || 0;
            
            return (
              <motion.div
                className={styles.ctaImage}
                key={index}
                style={{
                  transform: `${rotations[index]} translate(${x}px, ${y}px)`,
                  transition: "transform 0.2s ease-out"
                }}
              >
                <Image width={300} height={300} src={image} alt={`image-${index + 1}`} />
              </motion.div>
            );
          })}
        </div>

        <Link href="/contact" className={styles.ctaBtn}>
          <motion.p style={{ y: scrollText }}>
            Let&apos;s <span>Talk</span>
          </motion.p>
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;