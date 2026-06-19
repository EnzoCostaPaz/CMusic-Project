import styles from './Objectives.module.css';
import { RiSofaLine, RiMouseLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa6";
import { useInView } from 'react-intersection-observer';

function Objectives() {
    // configura o observador
    const { ref, inView } = useInView({
        triggerOnce: true, // Faz a animação acontecer apenas na primeira vez que rolar a tela
        threshold: 0.3,    // A animação só dispara quando 30% da seção estiver visível
    });

    return (
        <>
            <div ref={ref} className={`${styles.SectionObjectives} ${inView ? styles.isVisible : ''}`}>

                <div className={styles.Title}>
                    <h2>O que buscamos com esse projeto?</h2>
                </div>

                <div className={styles.Content}>
                    <div className={styles.ContentBoxes}>
                        <div className={styles.AssetVisual}>
                            <FaRegClock />
                        </div>

                        <div className={styles.TitleBox}>
                            <h3>Agilidade</h3>
                        </div>

                        <div className={styles.TextBox}>
                            <p>Rapidez na busca do usuário, garantindo foco no necessário</p>
                        </div>
                    </div>

                    <div className={styles.ContentBoxes}>
                        <div className={styles.AssetVisual}>
                            <RiMouseLine />
                        </div>

                        <div className={styles.TitleBox}>
                            <h3>Facilidade</h3>
                        </div>

                        <div className={styles.TextBox}>
                            <p>Entendimento simples das informações na experiência do usuário</p>
                        </div>
                    </div>

                    <div className={styles.ContentBoxes}>
                        <div className={styles.AssetVisual}>
                            <RiSofaLine />
                        </div>

                        <div className={styles.TitleBox}>
                            <h3>Conforto</h3>
                        </div>

                        <div className={styles.TextBox}>
                            <p>Acolhimento seguro e confortável para o usuário usufruir com calma</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { Objectives }