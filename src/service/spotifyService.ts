import axios from 'axios';

// Traduz os gêneros do formulário para termos que o Spotify reconhece na busca
const genreMap: Record<string, string> = {
    "Hip-Hop": "hip hop",
    "Sertanejo": "sertanejo",
    "K-pop": "k-pop",
    "Pop": "pop",
    "Eletronica": "electronic",
    "R&B": "r&b",
    "Rock": "rock",
    "Funk": "funk",
    "Pagode": "pagode",
    "Jazz": "jazz",
};


const moodMap: Record<string, string> = {
    "Felicidade": "happy",
    "Tristeza": "sad",
    "Calmaria": "chill",
    "Reflexao": "acoustic",
};

// Traduz o "Type" do formulário para o tipo de busca do Spotify
const searchTypeMap: Record<string, "track" | "album" | "artist"> = {
    "Musica": "track",
    "Album": "album",
    "Cantor": "artist",
};

// Função principal que fará o pedido das músicas
export const getRecommendations = async (token: string, formData: any) => {
    try {
        // Define o que buscar (música, álbum ou artista)
        const searchType = searchTypeMap[formData.Type] || "track";

        // Traduz os gêneros escolhidos (ignorando "Surpresa")
        const genres: string[] = (formData.GenreType || [])
            .filter((g: string) => g !== "Surpresa")
            .map((g: string) => genreMap[g] || g.toLowerCase());

        // Traduz os sentimentos em palavras de humor (ignorando "Destino")
        const moods: string[] = (formData.FellinType || [])
            .filter((f: string) => f !== "Destino")
            .map((f: string) => moodMap[f])
            .filter(Boolean);

        const queryParts: string[] = [];

        if (genres.length > 0) {
           
            if (searchType === "album") {
                queryParts.push(genres[0]);
            } else {
                queryParts.push(`genre:"${genres[0]}"`);
            }
        }
        queryParts.push(...moods);

        let q = queryParts.join(" ").trim();

        if (!q) {
            const fallback = ["pop", "rock", "indie", "jazz", "mpb"];
            const random = fallback[Math.floor(Math.random() * fallback.length)];
            q = searchType === "album" ? random : `genre:"${random}"`;
        }

        const spotifySearchURL = "https://" + "api.spotify.com" + "/v1/search";

        // GET na API de Busca do Spotify
        const response = await axios.get(spotifySearchURL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q,
                type: searchType,
                market: "BR", // mercado brasileiro (gêneros como sertanejo/funk)
                limit: 3
            }
        });

        const itemsKey = `${searchType}s` as "tracks" | "albums" | "artists";
        return response.data[itemsKey]?.items ?? [];

    } catch (error) {
        console.error("Erro ao buscar recomendações de músicas:", error);
        return null;
    }
};
