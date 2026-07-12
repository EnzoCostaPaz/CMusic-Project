import styles from './interest.module.css'; 
import { useNavigate } from 'react-router-dom';

function Interest() {
    const navigate = useNavigate();
    return(
        <div className={styles.InterestContainer}>
            <div className={styles.InterestContent}>
                <h2>Eai? se Interessou?</h2>
                <p>Caso tenha se interessado e queira utilizar o formulário, basta clicar no botão abaixo e começar a responder nossas perguntas</p>
                <button className={styles.InterestButton} onClick={() => navigate('/formulario')}>
                    Ir para o Formulário
                </button>
            </div>
        </div>
    );
}

export { Interest };