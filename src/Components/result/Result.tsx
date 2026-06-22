import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importamos o useLocation
import styles from './Result.module.css';
import { motion, AnimatePresence } from 'framer-motion';


function Result() {
    const navigate = useNavigate();
    const location = useLocation(); // Inicia o "leitor de bagagem"

    const resultData = location.state?.tracks;

    if (!resultData || resultData.length === 0) {
        return (
            <div className={styles.ResultContainer}>
                <p className={styles.phrase}>Ops! Não conseguimos encontrar o que você buscava.</p>
                <div className={styles.GroupButtonResultContainer}>
                    <button className={styles.GoBackButton} onClick={() => navigate('/')}>
                        Voltar para o começo
                    </button>
                </div>
            </div>
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