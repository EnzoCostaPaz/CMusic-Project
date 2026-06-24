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


//tradução dos tipos de cantores e bandas
const styleMap: Record<string, string> = {
    "Indie": "indie",
    "Mainstream": "", // vazio por padrão
    "Experimental": "experimental",
    "Classico": "classic", // Pega "classic rock", "classic pop", etc.
    "Alternativo": "alternative",
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
        const searchType = searchTypeMap[formData.Type] || "track";

        const genres: string[] = (formData.GenreType || [])
            .filter((g: string) => g !== "Surpresa")
            .map((g: string) => genreMap[g] || g.toLowerCase());

        const spotifySearchURL = "https://" + "api.spotify.com" + "/v1/search";

      
        const searchSpotify = async (queryToSearch: string) => {
            const response = await axios.get(spotifySearchURL, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    q: queryToSearch,
                    type: searchType,
                    market: "BR",
                    limit: 1 
                }
            });
            const itemsKey = `${searchType}s` as "tracks" | "albums" | "artists";
            return response.data[itemsKey]?.items ?? [];
        };

        
        const extraKeywords: string[] = [];

        if (searchType === "artist") {
            // Se for artista, traduz os Estilos usando o styleMap
            const styles = (formData.FellinType || [])
                .map((f: string) => styleMap[f])
                .filter(Boolean); // O Boolean remove strings vazias (como o Mainstream)
            
            extraKeywords.push(...styles);
        } else {
            // Se for música ou álbum, traduz os Sentimentos usando o moodMap
            const moods = (formData.FellinType || [])
                .filter((f: string) => f !== "Destino")
                .map((f: string) => moodMap[f])
                .filter(Boolean);
            
            extraKeywords.push(...moods);
        }

        // fallback
        let items: any[] = [];

        // plano a: Busca de Genero + sentimento
        const queryParts: string[] = [];
        if (genres.length > 0) {
            queryParts.push(searchType === "album" ? genres[0] : `genre:"${genres[0]}"`);
        }
        queryParts.push(...extraKeywords);

        let qExact = queryParts.join(" ").trim();

        if (qExact) {
            items = await searchSpotify(qExact);
        }

        // plano b: busca de apenas o genero
        if (items.length === 0 && genres.length > 0) {
            console.log("Plano A falhou. Tentando o Plano B (Apenas Gênero)...");
            let qGenreOnly = searchType === "album" ? genres[0] : `genre:"${genres[0]}"`;
            items = await searchSpotify(qGenreOnly);
        }

        // plano c: manda um curinga
        if (items.length === 0) {
            console.log("Plano B falhou. Acionando Plano C (Gênero Curinga)...");
            const fallback = ["pop", "rock", "indie", "jazz", "mpb"];
            const random = fallback[Math.floor(Math.random() * fallback.length)];
            let qFallback = searchType === "album" ? random : `genre:"${random}"`;
            items = await searchSpotify(qFallback);
        }

        return items;

    } catch (error) {
        console.error("Erro ao buscar recomendações de músicas:", error);
        return null;
    }
};