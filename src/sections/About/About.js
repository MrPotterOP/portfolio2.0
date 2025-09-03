'use client';

import styles from './styles.module.css';

import Image from 'next/image';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { useMediaCache } from '@/utils/MediaCacheContext';

function About() {

    const { cache } = useMediaCache();
    const videoSrc = cache.aboutVideo;


    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    let y = useTransform(scrollYProgress, [0, 1], ['40%', '100%']);

    return ( 
        <section className="about" ref={ref}>
            <div className={styles.aboutBox}>
                <h2 className="sectionTitle">ABOUT</h2>
                <div className={styles.aboutContent}>
                    <p className={styles.aboutBrief}>
                    23 years old, B.E. CSE 2023 graduate,<br/> web developer/ designer currently <br /> working as a freelancer
                    </p>

                    <p className={styles.aboutDetail}>
                    I love creating attractive and interactive websites. I find inspiration in everyday life, and I enjoy learning new things while I work. Currently more focused on the UI designing. I spend most of my time with ChatGPT, Youtube, Awwaards Websites, Coding, Designing, Overthinking..
                    </p>
                </div>

                
                <div
                className={styles.aboutShowreel}
                >
                <motion.div className={styles.aboutShowreelBox} alt="hero"
                style={{width: y}}
                >
                {/* <Image src="/images/showreel.gif" alt="showreel" width={1800} height={1000} ></Image> */}


                    <video autoPlay muted loop className={styles.heroVideo}>
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                </motion.div>


                </div>
            </div>
        </section>
     );
}

export default About;