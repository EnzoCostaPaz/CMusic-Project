import type { ReactNode } from 'react'; 
import Background from '../../../assets/fundo_forms.png';
import styles from './Background.module.css';

interface BackgroundFormProps {
    children: ReactNode;
}

function BackgroundForm({ children }: BackgroundFormProps) {
    return(
        <div className={styles.BackgroundImage} style={{ backgroundImage: `url(${Background})` }}>
            {children}
        </div>
    )
}

export { BackgroundForm };