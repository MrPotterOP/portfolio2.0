'use client'

import { useRef } from "react";
import Link from "next/link";
import styles from './styles.module.css';
import { motion } from 'framer-motion';

function WorkCard({ title, tags, videoTitle, caseStudy }) {
    const videoRef = useRef(null); 
    const tagsLength = tags.length;

    const handleMouseEnter = () => {
        // Play video and scale up
        if (videoRef.current) {
            videoRef.current.play();
        }
    }

    const handleMouseLeave = () => {
        // Pause video and reset scale
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }

    return ( 
        <Link href={`/casestudy/${caseStudy}`} className={styles.workCard}>
            <motion.div 
                className={`${styles.cardBg} linkLight`}
                onHoverStart={handleMouseEnter} 
                onHoverEnd={handleMouseLeave}   
            >

                <img className={styles.cardImage} src={`/images/${videoTitle}.jpg`} alt={title}>
                </img>

                <div className={styles.workVideoBox}> 
                    <video ref={videoRef} muted loop className={styles.workVideo}>
                        <source src={`/images/${videoTitle}.mp4`} type="video/mp4" />
                    </video>
                </div>
            </motion.div>

            <div className={styles.cardContent}>
                <div className={styles.line}></div>

                <div className={styles.workTags}
                >
                    {tags.map((tag, index) => (
                        <span key={index}>{tag} {index < tagsLength - 1 ? " - " : ""}</span>
                    ))}
                </div>
                
                <h3 className={styles.workTitle}>{title}</h3>
            </div>
        </Link>
    );
}

export default WorkCard;
