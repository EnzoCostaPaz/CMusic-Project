import styles from './About.module.css';

function About() {
    return (
        <section className={styles.SectionAbout} id='seçãoSobre'>
            
            <div className={styles.ContentLeft}>
                <h2 className={styles.Title}>O que é o CMusic?</h2>
                
                <div className={styles.Leftside}>
                    <p>
                        O CMusic é um projeto que busca ajudar aqueles que estão em busca de novas experiências na musica mas precisam de um caminho pra seguir.
                    </p>
                    <p>
                        O CMusic é esse caminho, um caminho simples e rápido para o usuário!
                    </p>
                </div>
            </div>

            <img src="./imgs/Asset_section_about.png" alt="Asset Visual" className={styles.ImgAsset} />
            
        </section>
    );
}

export { About };