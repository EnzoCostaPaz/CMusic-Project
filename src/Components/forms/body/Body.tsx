import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSpotifyToken } from '../../../service/spotifyAuth';
import { getRecommendations } from '../../../service/spotifyService';

import styles from './Body.module.css';



function Body() {
    const [[step, direction], setStep] = useState([1, 0]);

    // Função para desabilitar outros checks-boxes caso um seja selecionado
    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let newGenres = [...formData.GenreType];

        if (value === "Surpresa") {
            // Se marcou "Surpresa", o array vira só "Surpresa". Se desmarcou, esvazia.
            newGenres = checked ? ["Surpresa"] : [];
        } else {
            // Se clicou em outro gênero, remove a "Surpresa" caso ela estivesse marcada
            newGenres = newGenres.filter(item => item !== "Surpresa");

            if (checked) {
                newGenres.push(value); // Adiciona o novo gênero
            } else {
                newGenres = newGenres.filter(item => item !== value); // Remove se desmarcou
            }
        }

        setFormData(prev => ({ ...prev, GenreType: newGenres }));
    };

    // Função para controlar a Etapa 3
    const handleFeelingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let newFeelings = [...formData.FellinType];

        if (value === "Destino") {

            newFeelings = checked ? ["Destino"] : [];
        } else {
            newFeelings = newFeelings.filter(item => item !== "Destino");

            if (checked) {
                newFeelings.push(value);
            } else {
                newFeelings = newFeelings.filter(item => item !== value);
            }
        }

        setFormData(prev => ({ ...prev, FellinType: newFeelings }));
    };

    // Função que verifica se a etapa atual tem alguma resposta preenchida
    const isStepValid = () => {
        if (step === 1) {
            // Na etapa 1, a string 'Type' não pode estar vazia
            return formData.Type !== '';
        }
        if (step === 2) {
            // Na etapa 2, o array de gêneros precisa ter pelo menos 1 item
            return formData.GenreType.length > 0;
        }
        if (step === 3) {
            // Na etapa 3, o array de sentimentos precisa ter pelo menos 1 item
            return formData.FellinType.length > 0;
        }
        return false;
    };


    // Estado para guardar os dados
    const [formData, setFormData] = useState({
        Type: '',
        GenreType: [] as string[],
        FellinType: [] as string[],
    });

    const navigate = useNavigate();

    const nextStep = () => {
        // Pega o passo atual, soma 1, e define a direção como 1 (direita)
        setStep(([currentStep, _]) => [currentStep + 1, 1]);
    };

    const prevStep = () => {
        // Pega o passo atual, subtrai 1, e define a direção como -1 (esquerda)
        setStep(([currentStep, _]) => [currentStep - 1, -1]);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    // Função para lidar com o envio final
    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = await getSpotifyToken();

        if (token) {
            const tracks = await getRecommendations(token, formData);

            if (tracks && tracks.length > 0) {
                console.log("Músicas encontradas com sucesso!", tracks);

                navigate('/resultado', { state: { tracks: tracks } });
            } else {
                console.log("A API não encontrou músicas com essa combinação exata.");
            }
        } else {
            console.log("Falha ao obter o token do Spotify.");
        }
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
                                <input type="radio" name="Type" value="Album" onChange={(e) => setFormData({ ...formData, Type: e.target.value })} /> Álbum
                            </label>
                            <label>
                                <input type="radio" name="Type" value="Musica" onChange={(e) => setFormData({ ...formData, Type: e.target.value })} /> Uma música
                            </label>
                            <label>
                                <input type="radio" name="Type" value="Cantor" onChange={(e) => setFormData({ ...formData, Type: e.target.value })} /> Banda ou cantor(a)
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
                            <label>
                                <input type="checkbox" value="Hip-Hop" checked={formData.GenreType.includes("Hip-Hop")} onChange={handleGenreChange} /> Hip-Hop/Rap
                            </label>
                            <label>
                                <input type="checkbox" value="Sertanejo" checked={formData.GenreType.includes("Sertanejo")} onChange={handleGenreChange} /> Sertanejo
                            </label>
                            <label>
                                <input type="checkbox" value="K-pop" checked={formData.GenreType.includes("K-pop")} onChange={handleGenreChange} /> K-pop
                            </label>
                            <label>
                                <input type="checkbox" value="Pop" checked={formData.GenreType.includes("Pop")} onChange={handleGenreChange} /> Pop
                            </label>
                            <label>
                                <input type="checkbox" value="Eletronica" checked={formData.GenreType.includes("Eletronica")} onChange={handleGenreChange} /> Eletrônica
                            </label>
                            <label>
                                <input type="checkbox" value="R&B" checked={formData.GenreType.includes("R&B")} onChange={handleGenreChange} /> R&B
                            </label>
                            <label>
                                <input type="checkbox" value="Rock" checked={formData.GenreType.includes("Rock")} onChange={handleGenreChange} /> Rock
                            </label>
                            <label>
                                <input type="checkbox" value="Funk" checked={formData.GenreType.includes("Funk")} onChange={handleGenreChange} /> Funk
                            </label>
                            <label>
                                <input type="checkbox" value="Pagode" checked={formData.GenreType.includes("Pagode")} onChange={handleGenreChange} /> Pagode
                            </label>
                            <label>
                                <input type="checkbox" value="Jazz" checked={formData.GenreType.includes("Jazz")} onChange={handleGenreChange} /> Jazz
                            </label>
                            <label>
                                <input type="checkbox" value="Surpresa" checked={formData.GenreType.includes("Surpresa")} onChange={handleGenreChange} /> Me surpreenda!
                            </label>
                        </div>
                    </div>
                );

            case 3:

                if (formData.Type === 'Cantor') {
                    return (
                        <div>
                            <h1>Por fim...</h1>
                            <p className={styles.PharseLastStep}>Qual estilo da sua banda ou cantor(a) você procura? </p>

                            <div className={styles.CheckboxGridTwoCols}>
                                <label>
                                    <input type="checkbox" value="Indie" checked={formData.FellinType.includes("Indie")} onChange={handleFeelingChange} /> Indie
                                </label>
                                <label>
                                    <input type="checkbox" value="Mainstream" checked={formData.FellinType.includes("Mainstream")} onChange={handleFeelingChange} /> Mainstream
                                </label>
                                <label>
                                    <input type="checkbox" value="Experimental" checked={formData.FellinType.includes("Experimental")} onChange={handleFeelingChange} /> Experimental
                                </label>
                                <label>
                                    <input type="checkbox" value="Classico" checked={formData.FellinType.includes("Classico")} onChange={handleFeelingChange} /> Classico
                                </label>
                                <label className={styles.SpanTwo}>
                                    <input type="checkbox" value="Alternativo" checked={formData.FellinType.includes("Alternativo")} onChange={handleFeelingChange} /> Alternativo
                                </label>
                            </div>
                        </div>
                    )
                }
                else if (formData.Type === 'Album' || formData.Type === 'Musica') {
                    return(
                    <div>
                        <div className={styles.t}></div>

                        <h1>Agora...</h1>
                        <p className={styles.PharseLastStep}>Existe alguma sensação que você gostaria de sentir?</p>

                        <div className={styles.CheckboxGridTwoCols}>
                            <label>
                                <input type="checkbox" value="Reflexao" checked={formData.FellinType.includes("Reflexao")} onChange={handleFeelingChange} /> Reflexão
                            </label>
                            <label>
                                <input type="checkbox" value="Tristeza" checked={formData.FellinType.includes("Tristeza")} onChange={handleFeelingChange} /> Tristeza
                            </label>
                            <label>
                                <input type="checkbox" value="Felicidade" checked={formData.FellinType.includes("Felicidade")} onChange={handleFeelingChange} /> Felicidade
                            </label>
                            <label>
                                <input type="checkbox" value="Calmaria" checked={formData.FellinType.includes("Calmaria")} onChange={handleFeelingChange} /> Calmaria
                            </label>
                            <label className={styles.SpanTwo}>
                                <input type="checkbox" value="Destino" checked={formData.FellinType.includes("Destino")} onChange={handleFeelingChange} /> Deixe o destino escolher
                            </label>
                        </div>
                    </div >
                );
};
                

            default:
return null;
        }
    };


return (
    <div className={styles.FormContainer}>
        <div className={styles.FormContent}>

            <div className={styles.LeftSide}>
                <h1>Vamos começar a busca do melhor da musica para você</h1>
                <img src="./imgs/Asset_forms.png" alt="Constelação" className={styles.ImgAstronauta} />
            </div>

            <div className={styles.RightSide}>
                <AnimatePresence initial={false} custom={direction}>

                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '0 60px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <form onSubmit={submitForm} className={styles.Form}>

                            <div className={styles.StepParts}>
                                {/* Bolinha 1 */}
                                <div className={styles.Circles}><p>1</p></div>

                                {/* Linha 1 (Acende se step >= 2) */}
                                <div className={`${styles.connectLine} ${step >= 2 ? styles.connectLineActive : ''}`}></div>

                                {/* Bolinha 2 */}
                                <div className={styles.Circles}><p>2</p></div>

                                {/* Linha 2 (Acende se step === 3) */}
                                <div className={`${styles.connectLine} ${step === 3 ? styles.connectLineActive : ''}`}></div>

                                {/* Bolinha 3 */}
                                <div className={styles.Circles}><p>3</p></div>
                            </div>


                            {renderStep()}

                            <div className={styles.ButtonGroup}>

                                {step < 3 && (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!isStepValid()} // Trava o botão se não for válido
                                    >
                                        Prosseguir
                                    </button>
                                )}

                                {step === 3 && (
                                    <button
                                        type="submit"
                                        className={styles.SendButton}
                                        disabled={!isStepValid()} // Trava o botão de envio se não for válido
                                    >
                                        Enviar
                                    </button>
                                )}

                                {step === 1 && (
                                    <button type="button" className={styles.LeaveButton} onClick={() => navigate('/')}>
                                        Sair
                                    </button>
                                )}

                                {step > 1 && (
                                    <button type="button" className={styles.GoBackButton} onClick={prevStep}>
                                        Voltar
                                    </button>
                                )}

                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    </div>
);
}

export { Body };