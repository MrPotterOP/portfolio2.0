'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import styles from './styles.module.css';
import { motion } from 'framer-motion';

import Image from "next/image";

function WorkCard({ title, tags, videoTitle, caseStudy }) {
    const videoRef = useRef(null); 
    const tagsLength = tags.length;

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
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
        <Link href={caseStudy} target="_blank" rel="noreferrer" className={styles.workCard}>
            <motion.div 
                className={`${styles.cardBg} linkLight`}
                onHoverStart={handleMouseEnter} 
                onHoverEnd={handleMouseLeave}   
            >

                <Image className={styles.cardImage} src={`/images/${videoTitle}.jpg`} alt={title} width={700} height={720}>
                </Image>

                <div className={styles.workVideoBox}> 
                    {
                        !isHovered && 
                        <div className={styles.workVideoCover}>
                            <Image src={`/images/cover/${videoTitle}.png`} width={848} height={480} alt={title}  objectFit="cover" />
                        </div>
                    }
                    <video ref={videoRef} muted loop className={!isHovered ? `${styles.workVideo} ${styles.inactive}` : styles.workVideo}>
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
