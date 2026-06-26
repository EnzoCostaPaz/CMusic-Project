import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

// 1. Usando React Icons para facilitar o Hover de cor
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {

    const navigate = useNavigate();

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
                                    <li><a href="#seçãoSobre">O que é</a></li>
                                    <li><a href="#secaoComoFunciona">Como Funciona</a></li>
                                    <li><a href="#Secaoobjetivos">O que queremos</a></li>
                                </ul>
                            </div>

                            <div className={styles.coluna}>
                                <p className={styles.titulo}>Páginas</p>
                                <ul className={styles.lista}>
                                    <li><button>Sobre Nós</button></li>
                                    <li><button>Home</button></li>
                                    <li><button onClick={() => navigate('/formulario')}>Formulario</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className={styles.Linha}></hr>

                <div className={styles.ContentIcones}>
                    <a href="https://www.linkedin.com/in/enzo-costa-paz-7b5a9b21b/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className={styles.Icon} />
                    </a>
                    <a href="https://github.com/EnzoCostaPaz" target="_blank" rel="noopener noreferrer">
                        <FaGithub className={styles.Icon} />
                    </a>
                </div>
            </div>

            <div className={styles.CopyrightDiv}>
                <p className={styles.TextCopryRight}>© Copyright todos os direitos reservados </p>
            </div>
            
        </footer>
    )
}

export { Footer }