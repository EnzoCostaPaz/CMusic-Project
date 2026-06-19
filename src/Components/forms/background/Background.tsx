import Background from '../../../assets/fundo_forms.png';
import styles from './Background.module.css';

function BackgroundForm() {
    return(
        <div className={ styles.BackgroundImage} style={{ backgroundImage: `url(${Background})` }}></div>
    )
}

export { BackgroundForm };