import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Result.module.css';
import { motion } from 'framer-motion';
import { getSpotifyToken } from '../../service/spotifyAuth';
import { getRecommendations } from '../../service/spotifyService';

function Result() {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState<any[] | null>(null);

    const formData = location.state?.formData;

    useEffect(() => {
        let isCurrent = true;

        const buscarRecomendacoes = async () => {
            if (!formData) {
                if (isCurrent) setLoading(false);
                return;
            }

            const token = await getSpotifyToken();
            const tracks = token ? await getRecommendations(token, formData) : null;

            if (isCurrent) {
                setResultData(tracks);
                setLoading(false);
            }
        };

        buscarRecomendacoes();

        return () => { isCurrent = false; };
    }, [formData]);

    if (loading) {
        return(
            <motion.div 
                className={styles.loadingContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={styles.spinner}></div>
                <p className={styles.phrase} style={{ marginTop: '20px' }}>
                    Analisando sua vibe e buscando conexões espaciais...
                </p>
            </motion.div>
        )
    }

    if (!resultData || resultData.length === 0) {
        return (
            <motion.div 
                className={styles.ResultContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className={styles.phrase}>Ops! O buraco negro engoliu a nossa busca. Não conseguimos encontrar o que você buscava.</p>
                <div className={styles.GroupButtonResultContainer}>
                    <button className={styles.GoBackButton} onClick={() => navigate('/')}>
                        Voltar para a Terra
                    </button>
                </div>
            </motion.div>
        );
    }

    // Pegamos os 5 primeiros resultados para criar os cards
    const displayItems = resultData.slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.8, ease: "easeOut" }} 
        >
            <div className={styles.ResultContainer}>
                <p className={styles.phrase}>
                    Achamos o que você precisa ouvir agora!
                </p>

                {/* NOVO CONTAINER: Engloba todos os cards para alinhá-los */}
                <div className={styles.CardsContainer}>
                    {displayItems.map((item: any, index: number) => {
                        const title = item.name;
                        const imageUrl = item.images ? item.images[0]?.url : item.album?.images[0]?.url;
                        const authorsInfo = item.artists
                            ? item.artists.map((artist: any) => artist.name).join(', ')
                            : item.genres?.slice(0, 3).join(', ') || 'Artista';
                        const spotifyLink = item.external_urls?.spotify;

                        return (
                            <div key={index} className={styles.ResultGrid}>
                                <div className={styles.PhotoAlbum}>
                                    <img src={imageUrl} alt={`Capa de ${title}`} className={styles.Image} />
                                </div>
                                <div className={styles.NameRecomendatin}>
                                    <h2>{title}</h2>
                                </div>
                                <div className={styles.Authors}>
                                    <p>{authorsInfo}</p>
                                </div>
                                <div className={styles.GroupButtonResultGird}>
                                    <a href={spotifyLink} target="_blank" rel="noopener noreferrer" className={styles.GoToSpotify}>
                                        Ouça no Spotify!
                                    </a>
                                </div>
                            </div>
                        );
                    })}
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