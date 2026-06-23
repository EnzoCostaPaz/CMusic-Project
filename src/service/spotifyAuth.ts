import axios from 'axios';
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID?.trim();
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET_ID?.trim();

export const getSpotifyToken = async () => {
    if (!clientId || !clientSecret) {
        console.error("As chaves do Spotify não foram carregadas!");
        return null;
    }

    try {
        // Criptografia Base64 nativa do navegador (btoa)
        const authString = btoa(`${clientId}:${clientSecret}`);

        // Montamos a URL assim para garantir que a IA não oculte o link
        const spotifyURL = "https://" + "accounts.spotify.com" + "/api/token";

        // requisição no formato padrão do Spotify
        const response = await axios.post(
            spotifyURL,
            new URLSearchParams({
                grant_type: 'client_credentials'
            }),
            {
                headers: {
                    'Authorization': `Basic ${authString}`, 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Erro ao buscar o token da API:", error);
        return null;
    }
};