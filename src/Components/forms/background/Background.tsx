import type { ReactNode } from 'react'; // Importamos o tipo do TypeScript
 // Importamos o tipo do TypeScript
import Background from '../../../assets/fundo_forms.png';
import styles from './Background.module.css';

// Dizemos ao TypeScript que este componente aceita "children"
interface BackgroundFormProps {
    children: ReactNode;
}

// Desestruturamos a propriedade "children" aqui
function BackgroundForm({ children }: BackgroundFormProps) {
    return(
        <div className={styles.BackgroundImage} style={{ backgroundImage: `url(${Background})` }}>
            {children}
        </div>
    )
}

export { BackgroundForm };