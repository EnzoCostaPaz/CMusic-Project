import styles from './Banner.module.css';
import { useNavigate } from 'react-router-dom';
import Banner_Degrade from '../../../assets/Banner_Degrade.png';

function Banner() {
    const navigate = useNavigate();

    return (
        <div className={styles.ImagemBanner} style={{ backgroundImage: `url(${Banner_Degrade})` }}>
            
            <header className={styles.HeaderOptions}>
                <div className={styles.HeaderLeft}></div>
                
                <nav className={styles.NavLinks}>
                    <button onClick={() => navigate('')}>Sobre</button>
                    <a href="https://github.com/EnzoCostaPaz/CMusic-Project" target="_blank" rel="noopener noreferrer">
                        <button>Github</button>
                    </a>
                </nav>

                <div className={styles.HeaderRight}>
                    <button className={styles.ButtonUtilizar} onClick={() => navigate('/formulario')}>
                        Formulario
                    </button>
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