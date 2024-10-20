'use client'

import styles from './styles.module.css';
import Link from 'next/link';

import {motion} from 'framer-motion';

function Footer() {
    return ( 
        <footer className="footer cursorLight">

            <div className={styles.footerBox}>
                <div className={styles.footerContent}>
                    <div className={styles.info}>
                        <div className={`${styles.footerFlex} ${styles.logoBox}`}>
                            <div className={styles.footerLogo}>
                                <Link href="/" className={`${styles.textLogo} linkLight`}>
                                    shubham 
                                    <br />ubarhande
                                </Link>
                            </div>

                            <p className={styles.footerTextLite}>
                                have anything in mind?<br /> let&apos;s talk about it
                            </p>
                        </div>

                        <div className={`${styles.footerFlex}`}>
                            <p className={styles.footerHeaderText}>Drop me a line at</p>

                            <p className={styles.footerTextLite}>
                                <Link className="linkLight" href="mailto:shubham.ubarhande69@gmail.com">shubham.ubarhande69@gmail.com</Link>
                            </p>
                        </div>
                    </div>

                    <div className={styles.footerNav}>
                        <div className={`${styles.footerFlex}`}>
                            <p className={styles.footerHeaderText}>Links</p>

                            <div className={styles.footerLinksBox}>
                                <Link href="#work" className={`${styles.footerText} linkLight`}>Work</Link>
                                <Link href="#about" className={`${styles.footerText} linkLight`}>About</Link>
                                <Link href="#" className={`${styles.footerText} linkLight`}>Contact</Link>
                                <Link href="#" className={`${styles.footerText} linkLight`}>Start a project</Link>
                            </div>
                        </div>

                        <div className={`${styles.footerFlex}`}>
                            <p className={styles.footerHeaderText}>Social Media</p>

                            <div className={styles.footerLinksBox}>
                                <Link href="https://www.linkedin.com/in/mr-potter/" target="_blank" rel="noreferrer" data-hover="Linkedin" className={`${styles.footerText} linkLight`}>LinkedIn</Link>
                                <Link href="https://www.instagram.com/shubham_ubarhande/" target="_blank" rel="noreferrer" data-hover="Instagram" className={`${styles.footerText} linkLight`}>Instagram</Link>
                                <Link href="https://github.com/MrPotterOP" target="_blank" rel="noreferrer" data-hover="GitHub" className={`${styles.footerText} linkLight`}>GitHub</Link>
                                <Link href="https://twitter.com/brainlessdot" target="_blank" rel="noreferrer" data-hover="Twitter" className={`${styles.footerText} linkLight`}>Twitter</Link>
                            </div>

                        </div>
                    </div>
                    

                    <button className={`${styles.btnPlane} linkLight`} onClick={() => window.scrollTo(0, 0)}>((back to top))</button>

                </div>

                <motion.div className={styles.copyrightBox}
                >
                    <p>©2024</p>
                </motion.div>
            </div>
        </footer>

     );
}

export default Footer;