import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para o botão de "Sair" funcionar
import styles from './Body.module.css';

function Body() {
    const [step, setStep] = useState(1);

    // Estado para guardar os dados
    const [formData, setFormData] = useState({
        Type: '',
        GenreType: [] as string[],
        FellinType: [] as string[],
    });

    const navigate = useNavigate();

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // 3. Função para lidar com o envio final
    const submitForm = (e: React.FormEvent) => {
        e.preventDefault(); // Impede a página de recarregar
        console.log("Dados do formulário prontas para a API:", formData);
        //API resultado

    };

    //Renderizador condicional das etapas
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h1>Primeiramente</h1>
                        <p>O que você esta buscando?</p>
                        <div className={styles.RadioGroup}>
                            <label>
                                <input type="radio" name="Type" value="Album" /> Álbum
                            </label>
                            <label>
                                <input type="radio" name="Type" value="Musica" /> Uma música
                            </label>
                            <label>
                                <input type="radio" name="Type" value="Cantor" /> Banda ou cantor(a)
                            </label>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h1>Agora...</h1>
                        <p>Que gênero você está buscando?</p>

                        <div className={styles.CheckboxGrid}>
                            <label><input type="checkbox" value="Hip-Hop" /> Hip-Hop/Rap</label>
                            <label><input type="checkbox" value="Sertanejo" /> Sertanejo</label>
                            <label><input type="checkbox" value="K-pop" /> K-pop</label>

                            <label><input type="checkbox" value="Pop" /> Pop</label>
                            <label><input type="checkbox" value="Eletronica" /> Eletrônica</label>
                            <label><input type="checkbox" value="R&B" /> R&B</label>

                            <label><input type="checkbox" value="Rock" /> Rock</label>
                            <label><input type="checkbox" value="Funk" /> Funk</label>
                            <label><input type="checkbox" value="Pagode" /> Pagode</label>

                            <label><input type="checkbox" value="Jazz" /> Jazz</label>
                            <label><input type="checkbox" value="Surpresa" /> Me surpreenda!</label>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h1>Agora...</h1>
                        <p>Existe alguma sensação que você gostaria de sentir?</p>

                        <div className={styles.CheckboxGridTwoCols}>
                            <label><input type="checkbox" value="Reflexao" /> Reflexão</label>
                            <label><input type="checkbox" value="Tristeza" /> Tristeza</label>

                            <label><input type="checkbox" value="Felicidade" /> Felicidade</label>
                            <label><input type="checkbox" value="Calmaria" /> Calmaria</label>

                            <label className={styles.SpanTwo}>
                                <input type="checkbox" value="Destino" /> Deixe o destino escolher
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // 5. O Retorno (Renderização do Componente)
    return (
        <div className={styles.FormContainer}>
            <div className={styles.FormContent}>

                <div className={styles.LeftSide}>
                    <h1>Vamos começar a busca do melhor da musica para você</h1>
                    <img src="./imgs/Asset_forms.png" alt="Constelação" className={styles.ImgAstronauta} />
                </div>

                <div className={styles.RightSide}>
                    <form onSubmit={submitForm} className={styles.Form}>

                        {renderStep()}
                        <div className={styles.ButtonGroup}>


                            {step < 3 &&
                                <button type="button" onClick={nextStep}>
                                    Prosseguir
                                </button>}
                            {step === 1 &&
                                <button type="button" className={styles.LeaveButton} onClick={() => navigate('/')}>
                                    Sair
                                </button>}
                            {step > 1 && (
                                <button type="button" className={styles.GoBackButton} onClick={prevStep}>
                                    Voltar
                                </button>
                            )}


                            {step === 3 && (
                                <button type="submit" className={styles.SendButton}>
                                    Enviar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export { Body };