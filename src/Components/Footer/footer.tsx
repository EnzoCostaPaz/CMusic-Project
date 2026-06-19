import styles from './Footer.module.css';
// 1. Usando React Icons para facilitar o Hover de cor
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className={styles.Footer}>
            
            <div className={styles.Container}>
                <div className={styles.TopSection}> 
                    <div className={styles.left}>
                        <p className={styles.Phrase}>Mudando o jeito de descobrir a arte da musica</p>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.colunasContent}>
                            <div className={styles.coluna}>
                                <p className={styles.titulo}>Seções</p>
                                <ul className={styles.lista}>
                                    <li><a href="#">O que é</a></li>
                                    <li><a href="#">Como Funciona</a></li>
                                    <li><a href="#">O que queremos</a></li>
                                </ul>
                            </div>

                            <div className={styles.coluna}>
                                <p className={styles.titulo}>Páginas</p>
                                <ul className={styles.lista}>
                                    <li><a href="#">Sobre Nós</a></li>
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">Formulario</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className={styles.Linha}></hr>

                <div className={styles.ContentIcones}>
                    <FaLinkedinIn className={styles.Icon} />
                    <FaGithub className={styles.Icon} />
                </div>
            </div>

            <div className={styles.CopyrightDiv}>
                <p className={styles.TextCopryRight}>© Copyright todos os direitos reservados </p>
            </div>
            
        </footer>
    )
}

export { Footer }