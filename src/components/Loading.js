'use client'

import styles from './styles.module.css';



export default function Loading({ progress }) {


    // const quotes = [
    //     "The only way to do great work is to love what you do. — Steve Jobs",
    //     "Our brains are plastic, and we have the ability to change and shape them throughout our entire lives. - Andrew Huberman",
    // ]


    // const getRandomQuote = () => {
    //     const randomIndex = Math.floor(Math.random() * quotes.length);
    //     return quotes[randomIndex];
    // };

    return (
        <div className={styles.loadingScreen}>
            <div className={styles.loadingBox}>

                <h3>LOADING...</h3>

                <div className={styles.loadingBarBox}>
                    <p>{progress}%</p>

                    <div className={styles.loadingBar}>
                        <div className={styles.loadingProgress} style={{ width: `${progress}%` }}></div>
                    </div>

                    <p>100%</p>
                </div>
            </div>
        </div>
    );
}