import styles from './banner.module.css';
import Banner_Degrade from '../../assets/Banner_Degrade.png';

function Banner() {
    return (
        <div className={styles.ImagemBanner} style={{ backgroundImage: `url(${Banner_Degrade})` }}>
            
            <header className={styles.HeaderOptions}>
                <div className={styles.HeaderLeft}></div>
                
                <nav className={styles.NavLinks}>
                    <button>Sobre</button>
                    <button>Github</button>
                </nav>

                <div className={styles.HeaderRight}>
                    <button className={styles.ButtonUtilizar}>Utilizar</button>
                </div>
            </header>

            <main className={styles.ContentArea}>
                <div className={styles.TextLeft}>
                    <p>O seu lugar para buscar o melhor da musica</p>
                </div>
                
                <img src={"./imgs/Asset_degrade.png"} alt="Astronauta" className={styles.ImgAstronauta} />
            </main>

        </div>
    );
}

export { Banner };