'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import styles from './styles.module.css';

function Experience() {


  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });


  let x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  let xInverce = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);


  //Education Data
  const education = [
    {
      field: "B.E. Computer science & Engg.",
      time: "2019 - 2023",
      cgpa: "7.1/10",
      link: "https://drive.google.com/file/d/1mbkIETHoxltcY0EiBGFEWNL9wOiVDMeF/view?usp=sharing"
    }
  ]

  //Experience Data
  const experience = [
    {
      time: "dec 2022 - mar 2023",
      company: "photograde ai",
      role: "full stack developer",
      link: "https://drive.google.com/file/d/1_0WlKfmgjXNTdCZZ_Gs1sl4XT0uhkq3u/view?usp=sharing"
    },
    {
      time: "oct 2023 - present",
      company: "freelance",
      role: "web developer/ designer"
    }

  ]



  return (
    <section className={`experience`} >
      <div className={styles.textScroll} ref={ref}>
        <div className={styles.textScrollBox} >
          <motion.div
            className={styles.velocityScrollText}

            style={{ x }}

          >
            <h3>MORE ABOUT ME.</h3>
            <h3>MORE ABOUT ME.</h3>
          </motion.div>

          <motion.div className={styles.velocityScrollText}

            style={{ x }}
          >

            <h3>MORE ABOUT ME.</h3>
            <h3>MORE ABOUT ME.</h3>

          </motion.div>

        </div>

        <div className={styles.textScrollBox} >
          <motion.div
            className={styles.velocityScrollText}

            style={{ x:xInverce }}

          >
            <h3>MORE ABOUT ME.</h3>
            <h3>MORE ABOUT ME.</h3>
          </motion.div>

          <motion.div className={styles.velocityScrollText}

            style={{ x:xInverce }}
            
          >

            <h3>MORE ABOUT ME.</h3>
            <h3>MORE ABOUT ME.</h3>

          </motion.div>

        </div>
      </div>


      <div className={styles.experienceBox}>

        <div className={styles.education}>
          <h3 className="subSectionTitle">EDUCATION</h3>
          
          <div className={styles.educationTable}>
              <div className={styles.tableTitleRow}>
                  <p>Field</p><p>C.G.P.A</p><p>Time</p>
              </div>

              {education.map((edu, index) => (
                <div className={styles.tableRow} key={index}>
                  <p>{edu.field}</p><p>{edu.cgpa}</p><p>{edu.time}</p><div className={styles.tableLink}> <div className={styles.linkWrapper}> <Link  href={edu.link} target="_blank" rel="noreferrer">View Certificate</Link> </div></div>
                </div>
              ))}

          </div>

        </div>

        <div className={styles.experience}>
          <h3 className="subSectionTitle">EXPERIENCE</h3>
          
          <div className={styles.educationTable}>
              <div className={styles.tableTitleRow}>
                  <p>Time</p><p>Company</p><p>Role</p>
              </div>

              {experience.map((exp, index) => (
                <div className={styles.tableRow} key={index}>
                  <p>{exp.time}</p><p>{exp.company}</p><p>{exp.role}</p>{exp.link && <div className={styles.tableLink}> <div className={styles.linkWrapper}> <Link href={exp.link} target="_blank" rel="noreferrer">Recommandation Letter</Link></div> </div>}
                </div>
              ))}

          </div>

        </div>




      </div>
      



    </section>
  );
}

export default Experience;
