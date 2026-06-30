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
    "Romance": 'romantic',
    "Energia": "workout",
    "Foco": "focus",
    "Nostalgia": "nostalgia",
    "Festa": "party",
    "Raiva": "angry"
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

// Sorteia um item de uma lista
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Função principal que fará o pedido das músicas
export const getRecommendations = async (token: string, formData: any) => {
    try {
        const searchType = searchTypeMap[formData.Type] || "track";

        const genres: string[] = (formData.GenreType || [])
            .filter((g: string) => g !== "Surpresa")
            .map((g: string) => genreMap[g] || g.toLowerCase());

        const spotifyBaseURL = "https://" + "api.spotify.com" + "/v1";
        const spotifySearchURL = spotifyBaseURL + "/search";
        const authHeader = { Authorization: `Bearer ${token}` };

        const searchSpotify = async (queryToSearch: string) => {
            const itemsKey = `${searchType}s` as "tracks" | "albums" | "artists";

            const doRequest = (offset: number) =>
                axios.get(spotifySearchURL, {
                    headers: authHeader,
                    params: { q: queryToSearch, type: searchType, market: "BR", limit: 50, offset }
                });

            // offset aleatório alcança resultados mais "fundo" (mais variedade)
            const offset = Math.floor(Math.random() * 50);
            let response = await doRequest(offset);
            let items = response.data[itemsKey]?.items ?? [];

            // se o offset foi longe demais e veio vazio, tenta do começo
            if (items.length === 0 && offset > 0) {
                response = await doRequest(0);
                items = response.data[itemsKey]?.items ?? [];
            }

            return items.filter(Boolean);
        };

        const searchViaPlaylist = async (query: string) => {
            const response = await axios.get(spotifySearchURL, {
                headers: authHeader,
                params: { q: query, type: "playlist", market: "BR", limit: 20 }
            });

            // o Spotify às vezes devolve itens nulos na lista de playlists
            let playlists = (response.data.playlists?.items ?? []).filter(Boolean);
            if (playlists.length === 0) return [];

            // embaralha entre as 10 mais relevantes e tenta até 3 playlists
            playlists = playlists.slice(0, 10).sort(() => Math.random() - 0.5);

            for (const playlist of playlists.slice(0, 3)) {
                try {
                    const tracksRes = await axios.get(
                        `${spotifyBaseURL}/playlists/${playlist.id}/tracks`,
                        { headers: authHeader, params: { market: "BR", limit: 50 } }
                    );
                    const tracks = (tracksRes.data.items ?? [])
                        .map((it: any) => it.track)
                        .filter((t: any) => t && t.id); // remove faixas locais/indisponíveis

                    if (tracks.length > 0) return tracks;
                } catch {
                    // playlist indisponível (ex.: 404), tenta a próxima
                }
            }
            return [];
        };

        // Monta as palavras-chave extras (humor para faixa/álbum, estilo para artista)
        const extraKeywords: string[] = [];

        if (searchType === "artist") {
            const styles = (formData.FellinType || [])
                .map((f: string) => styleMap[f])
                .filter(Boolean); // remove strings vazias (como o Mainstream)
            extraKeywords.push(...styles);
        } else {
            const moods = (formData.FellinType || [])
                .filter((f: string) => f !== "Destino")
                .map((f: string) => moodMap[f])
                .filter(Boolean);
            extraKeywords.push(...moods);
        }

        // Query com filtro genre: (para busca direta de track/artist)
        const queryParts: string[] = [];
        if (genres.length > 0) {
            queryParts.push(searchType === "album" ? genres[0] : `genre:"${genres[0]}"`);
        }
        queryParts.push(...extraKeywords);
        const qExact = queryParts.join(" ").trim();

        // Query "humana" (texto solto) usada na busca de playlist
        const humanQuery = [...genres, ...extraKeywords].join(" ").trim();

        let items: any[] = [];

        // PLANO A: faixa com humor -> via playlist (melhor relevância)
        if (searchType === "track" && extraKeywords.length > 0 && humanQuery) {
            try {
                items = await searchViaPlaylist(humanQuery);
            } catch (e) {
                console.log("Busca por playlist falhou, seguindo para a busca direta.", e);
            }
        }

        // PLANO B: busca direta de gênero + humor
        if (items.length === 0 && qExact) {
            items = await searchSpotify(qExact);
        }

        // PLANO C: só o gênero
        if (items.length === 0 && genres.length > 0) {
            console.log("Tentando apenas o gênero...");
            const qGenreOnly = searchType === "album" ? genres[0] : `genre:"${genres[0]}"`;
            items = await searchSpotify(qGenreOnly);
        }

        // PLANO D: curinga
        if (items.length === 0) {
            console.log("Acionando gênero curinga...");
            const fallback = ["pop", "rock", "indie", "jazz", "mpb"];
            const random = pickRandom(fallback);
            const qFallback = searchType === "album" ? random : `genre:"${random}"`;
            items = await searchSpotify(qFallback);
        }

        if (items.length === 0) return [];

        // Sorteia o resultado e o coloca no início (a tela exibe items[0])
        const chosen = pickRandom(items);
        return [chosen, ...items.filter((it: any) => it !== chosen)];

    } catch (error) {
        console.error("Erro ao buscar recomendações de músicas:", error);
        return null;
    }
};