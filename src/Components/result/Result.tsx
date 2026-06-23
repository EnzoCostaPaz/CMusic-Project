import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importamos o useLocation
import styles from './Result.module.css';
import { motion, AnimatePresence, time } from 'framer-motion';


function Result() {
    const navigate = useNavigate();
    const location = useLocation(); // Inicia o "leitor de bagagem"

    const [loading, setLoading] = useState(true); // tela de carregamento


    const resultData = location.state?.tracks;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3000);

        return () => clearTimeout(timer)
    }, []);

    if (loading) {
        return (
            <motion.div
                className={styles.loadingContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={styles.spinner}></div>
                    <p className={styles.phrase}>Buscando sua recomendação perfeita...</p>
               
            </motion.div>
        )
    }
    if (!resultData || resultData.length === 0) {
        return (

            <motion.div
                className={styles.loadingContainer}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.ResultContainer}>
                    <p className={styles.phrase}>Ops! Não conseguimos encontrar o que você buscava.</p>
                    <div className={styles.GroupButtonResultContainer}>
                        <button className={styles.GoBackButton} onClick={() => navigate('/')}>
                            Voltar para o começo
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }



    const item = resultData[0];

    const title = item.name;

    const imageUrl = item.images ? item.images[0]?.url : item.album?.images[0]?.url;

    const authorsInfo = item.artists
        ? item.artists.map((artist: any) => artist.name).join(', ')
        : item.genres?.slice(0, 3).join(', ') || 'Artista';

    const spotifyLink = item.external_urls?.spotify;


    return (

        <motion.div
            initial={{ opacity: 0, y: 50 }} // Começa invisível e 50 pixels para baixo
            animate={{ opacity: 1, y: 0 }}  // Termina 100% visível e na posição original (y: 0)
            transition={{ duration: 0.8, ease: "easeOut" }} // Duração de 0.8s com suavização no final
        >
            <div className={styles.ResultContainer}>
                <p className={styles.phrase}>
                    Achamos o que você precisa ouvir agora!
                </p>

                <div className={styles.ResultGrid}>
                    {/* Imagem do Resultado */}
                    <div className={styles.PhotoAlbum}>
                        <img src={imageUrl} alt={`Capa de ${title}`} className={styles.Image} />
                    </div>

                    {/* Título Principal */}
                    <div className={styles.NameRecomendatin}>
                        <h2>{title}</h2>
                    </div>

                    {/* Autores / Gêneros */}
                    <div className={styles.Authors}>
                        <p>{authorsInfo}</p>
                    </div>

                    {/* Botão de Ouvir */}
                    <div className={styles.GroupButtonResultGird}>
                        <a href={spotifyLink} target="_blank" rel="noopener noreferrer" className={styles.GoToSpotify}>
                            Ouça no Spotify!
                        </a>
                    </div>
                </div>

                <div className={styles.GroupButtonResultContainer}>
                    <button className={styles.TryAgainButton} onClick={() => navigate('/formulario')}>
                        Tente Novamente
                    </button>

                    <button className={styles.GoBackButton} onClick={() => navigate('/')}>
                        Voltar para o começo
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export { Result };