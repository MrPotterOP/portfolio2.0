'use client';

import services from "./services.json";
import styles from './styles.module.css';

import {motion, useScroll, useTransform} from 'framer-motion';
import { useRef } from 'react';

function Services() {

  const ref = useRef(null);

  // Hook to get scroll progress for the entire services section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["10% 100%", "70% 50%"],
  });

  // The service card component
  const ServiceCard = ({ title, description, index }) => {
    
    const x = useTransform(
      scrollYProgress,
      [index * 0.15, 0.5 + index * 0.15], 
      [-100, 0] // Movement from x -200 to x 0
    );

    const opacity = useTransform(
      scrollYProgress,
      [ index * 0.15, 0.5 + index * 0.15],
      [0.2, 1] // Fade in
    );

    return (
      <div className={styles.serviceCard}>
        <motion.h3
          className={styles.serviceTitle}
          initial={{ opacity: 0.2 }}
          style={{ x, opacity }} 
        >
          {title}
        </motion.h3>
        <p className={styles.serviceDescription}>{description}</p>
      </div>
    );
  };

  return (
    <section className="services cursorLight">
      <div className={styles.servicesBox} ref={ref}>
        <h2 className="subSectionTitle">SERVICES</h2>

        <div className={styles.servicesFlex}>
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
