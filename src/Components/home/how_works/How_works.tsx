import styles from './How_works.module.css';
import FundoImage from '../../../assets/Asset_fundo_Works.png';
import { useInView } from 'react-intersection-observer';

function How_works() {

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <>
            <div className={styles.ImagemFundo} style={{ backgroundImage: `url(${FundoImage})` }} id='secaoComoFunciona'>
                
                <div className={styles.Title}>
                    <h2>Como Funciona o CMusic?</h2>
                </div>

                <div ref={ref} className={`${styles.ImageAsset} ${inView ? styles.isVisible : ''}`}>
                    <img src="../imgs/Asset_Works.svg" alt="Caminho de como funciona o formulário" />
                </div>
                
            </div>
        </>
    )
}

export { How_works }