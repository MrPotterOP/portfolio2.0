'use client';

import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';
import skills from './skills.json';

const SkillCard = React.memo(({ name, icon, tags, description }) => {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    return (
        <div 
            className={`${styles.skillCard} ${isActive ? styles.active : ""} link`} 
            onClick={toggleActive}
        >
            <div className={styles.skill}>
                <div className={styles.skillName}>
                    <div className={styles.skillIcon}>
                        <img src={`/images/icons/${icon}.png`} alt={name} />
                    </div>
                    <h4 className={styles.skillText}>{name}</h4>
                </div>
                
                <div className={styles.skillDetails}>
                    <div className={styles.skillTags}>
                        {tags.map((tag, index) => (
                            <span key={index}>{tag} {index < tags.length - 1 ? " - " : ""}</span>
                        ))}
                    </div>
                    
                    <p className={styles.skillDescription}>{description}</p>
                </div>
            </div>
            
            <p className={styles.expandBtn}>+</p>
        </div>
    );
});

SkillCard.displayName = 'SkillCard';

function Skills() {
    return (
        <section className="skills">
            <div className={styles.skillsBox}>
                <h2 className="subSectionTitle">TECHNOLOGIES I&apos;VE WORKED ON</h2>
                
                <div className={styles.skillsFlex}>
                    {skills.map((skill, index) => (
                        <SkillCard key={index} {...skill} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;
