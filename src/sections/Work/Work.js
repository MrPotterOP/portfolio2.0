import styles from './styles.module.css';

import projects from './projects.json';

import WorkCard from '@/components/WorkCard';

function Work() {


    return ( 
        <section className="work">

            <div className={styles.workBox}>
                <h2 className="sectionTitle">WORK</h2>

                <div className={styles.workGrid}>
                    {projects.map((project, index) => (
                        <WorkCard key={index} {...project} />
                    ))}
                </div>

            </div>

        </section>
     );
}

export default Work;