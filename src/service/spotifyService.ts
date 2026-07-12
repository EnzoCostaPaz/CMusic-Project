import axios from 'axios';

// Perfil de cada gênero do formulário:
// - query: termo usado nas buscas da API
// - match: palavras aceitas nos gêneros do artista

type GenreProfile = { query: string; match: string[] };

const genreProfiles: Record<string, GenreProfile> = {
    "Hip-Hop": { query: "hip hop", match: ["hip hop", "rap", "trap"] },
    "Sertanejo": { query: "sertanejo", match: ["sertanejo", "arrocha"] },

    // "K-pop": { query: "k-pop", match: ["k-pop", "korean"] },
    // "R&B": { query: "r&b", match: ["r&b", "rnb", "soul"] },
    // "Funk": { query: "funk", match: ["funk"] },

    //opções retiradas por ora pois esta apresentando resultados irrelevantes ou não relacionados ao gênero;
    //corrigir isso mais tarde

    "Pop": { query: "pop", match: ["pop"] },
    "Eletronica": { query: "electronic", match: ["electronic", "edm", "house", "techno", "electro", "trance", "dance", "dubstep", "drum and bass", "big room"] },
   
    "Rock": { query: "rock", match: ["rock", "metal", "punk", "grunge"] },
    "Pagode": { query: "pagode", match: ["pagode", "samba"] },
    "Jazz": { query: "jazz", match: ["jazz", "bossa nova", "swing"] },
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


// tradução dos tipos de cantores e bandas
const styleMap: Record<string, string> = {
    "Indie": "indie",
    "Mainstream": "mainstream",
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

// Embaralha uma lista (sem alterar a original)
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Normaliza um texto para comparação: minúsculo, sem acento e sem símbolos.
// Assim "K-Pop Girl Group" vira "kpopgirlgroup" e casa com "kpop".
const norm = (text: string) =>
    (text ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]/g, "");

// Verifica se a lista de gêneros de um artista bate com o perfil pedido
const matchesProfile = (artistGenres: string[], profile: GenreProfile) =>
    (artistGenres ?? []).some((g) => profile.match.some((token) => norm(g).includes(norm(token))));

// Guarda o que já foi recomendado nesta sessão para não repetir nas
// próximas tentativas (zera ao recarregar a página)
const shownIds = new Set<string>();

// O modo de desenvolvimento do Spotify bloqueia (403) as faixas de várias
// playlists.
let playlistBlockCount = 0;
const PLAYLIST_BLOCK_LIMIT = 3;

// Função principal que fará o pedido das músicas
export const getRecommendations = async (token: string, formData: any) => {
    try {
        const searchType = searchTypeMap[formData.Type] || "track";

        const spotifyBaseURL = "https://" + "api.spotify.com" + "/v1";
        const spotifySearchURL = spotifyBaseURL + "/search";
        const authHeader = { Authorization: `Bearer ${token}` };

        // GET com tratamento de erro padrão: devolve null se a chamada falhar
        const apiGet = async (url: string, params: any) => {
            try {
                const response = await axios.get(url, { headers: authHeader, params });
                return response.data;
            } catch (error: any) {
                console.log(
                    `Requisição falhou (${url}):`,
                    error?.response?.data?.error?.message ?? error?.message
                );
                return null;
            }
        };

        // Busca os gêneros de vários artistas de uma vez só (máx. 50 por chamada)
        const getArtistGenres = async (artistIds: string[]) => {
            const genresById = new Map<string, string[]>();
            const ids = [...new Set(artistIds)].filter(Boolean).slice(0, 50);
            if (ids.length === 0) return genresById;

            const data = await apiGet(`${spotifyBaseURL}/artists`, { ids: ids.join(",") });
            const foundArtists: any[] = data?.artists ?? [];
            for (const artist of foundArtists) {
                if (artist?.id) genresById.set(artist.id, artist.genres ?? []);
            }
            return genresById;
        };

        // Mantém apenas as faixas cujo artista pertence mesmo ao gênero pedido
        const filterTracksByProfile = async (tracks: any[], profile: GenreProfile) => {
            const genresById = await getArtistGenres(tracks.map((t) => t?.artists?.[0]?.id));
            return tracks.filter((t) =>
                matchesProfile(genresById.get(t?.artists?.[0]?.id ?? "") ?? [], profile)
            );
        };

        // Busca direta de faixas pelo filtro de gênero do Spotify.
        // Sem offset aleatório: ele "cavava fundo" demais no ranking e trazia
        // resultados sem relação. E sem "limit": a API deste app devolve 400
        // "Invalid limit" quando o parâmetro é enviado (fica o padrão, 20).
        const searchTracks = async (profile: GenreProfile, moodWord: string | null) => {
            const q = `genre:"${profile.query}"` + (moodWord ? ` ${moodWord}` : "");
            const data = await apiGet(spotifySearchURL, { q, type: "track", market: "BR" });
            const found: any[] = (data?.tracks?.items ?? []).filter(Boolean);
            if (found.length === 0) return [];

            const valid = await filterTracksByProfile(found, profile);
            if (valid.length > 0) return valid;

            // Com humor no texto a chance de lixo é alta: melhor devolver vazio
            // e deixar o plano seguinte (só gênero) assumir. Sem humor, o
            // resultado cru do filtro de gênero é um último recurso aceitável.
            return moodWord ? [] : found;
        };

        // Busca playlists sobre o gênero (+ humor) e usa as faixas delas.
        // Só aceita playlists que citam o gênero no nome/descrição — é isso
        // que evita cair em playlists aleatórias.
        const searchViaPlaylist = async (profile: GenreProfile, moodWord: string) => {
            // rota desativada nesta sessão (muitos 403 do Spotify)? nem tenta
            if (playlistBlockCount >= PLAYLIST_BLOCK_LIMIT) return [];

            const q = `${profile.query} ${moodWord}`;
            // sem "limit" aqui: o padrão (20) evita o 400 "Invalid limit"
            const data = await apiGet(spotifySearchURL, { q, type: "playlist", market: "BR" });

            // o Spotify às vezes devolve itens nulos na lista de playlists
            // (o ": any[]" fixa o tipo — sem ele o TS trata cada item como "unknown")
            let playlists: any[] = (data?.playlists?.items ?? []).filter(Boolean);
            playlists = playlists.filter((p: any) =>
                profile.match.some((token) =>
                    norm(`${p.name ?? ""} ${p.description ?? ""}`).includes(norm(token))
                )
            );

            for (const playlist of shuffle(playlists).slice(0, 3)) {
                let tracksData: any = null;
                try {
                    const response = await axios.get(
                        `${spotifyBaseURL}/playlists/${playlist.id}/tracks`,
                        { headers: authHeader, params: { market: "BR" } }
                    );
                    tracksData = response.data;
                } catch (error: any) {
                    // 403 = playlist bloqueada pelo modo de desenvolvimento
                    const status = error?.response?.status;
                    if (status === 403) playlistBlockCount++;
                    console.log(`Playlist indisponível (${status ?? "?"}), tentando a próxima...`);
                    if (playlistBlockCount >= PLAYLIST_BLOCK_LIMIT) break;
                    continue;
                }

                const tracks = (tracksData?.items ?? [])
                    .map((it: any) => it?.track)
                    .filter((t: any) => t && t.id); // remove faixas locais/indisponíveis

                if (tracks.length === 0) continue;

                // dentro da playlist, ainda prioriza as faixas do gênero certo
                const valid = await filterTracksByProfile(tracks, profile);
                return valid.length >= 3 ? valid : tracks;
            }
            return [];
        };

        // Busca artistas pelo filtro de gênero e valida cada um pelos
        // gêneros cadastrados no próprio perfil do artista
        const searchArtists = async (profile: GenreProfile): Promise<any[]> => {
            const data = await apiGet(spotifySearchURL, {
                q: `genre:"${profile.query}"`, type: "artist", market: "BR"
            });
            const found: any[] = (data?.artists?.items ?? []).filter(Boolean);
            const valid = found.filter((a: any) => matchesProfile(a.genres ?? [], profile));
            return valid.length > 0 ? valid : found;
        };

        // Aplica o estilo escolhido sobre os artistas do gênero
        const applyStyle = (artists: any[], styleWord: string | null) => {
            if (artists.length === 0 || !styleWord) return artists;

            if (styleWord === "mainstream") {
                // os mais populares do gênero
                return [...artists]
                    .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
                    .slice(0, 10);
            }
            if (styleWord === "indie") {
                // menos populares = mais nichados
                const nicho = artists.filter((a: any) => (a.popularity ?? 0) < 60);
                return nicho.length > 0 ? nicho : artists;
            }
            // experimental / classic / alternative: procura a palavra nos gêneros do artista
            const combina = artists.filter((a: any) =>
                (a.genres ?? []).some((g: string) => norm(g).includes(norm(styleWord)))
            );
            return combina.length > 0 ? combina : artists;
        };

        // Remove álbuns repetidos (mesmo nome + mesmo artista, ex.: versões deluxe)
        const dedupeAlbums = (albums: any[]) => {
            const seen = new Set<string>();
            return albums.filter((al: any) => {
                if (!al?.id) return false;
                const key = norm(`${al.name} ${al.artists?.[0]?.name ?? ""}`);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        };

        // Converte faixas (ex.: vindas de playlist) nos álbuns delas
        const albumsFromTracks = (tracks: any[]) => {
            const albums = tracks.map((t: any) => t?.album).filter((al: any) => al && al.id);
            const fullAlbums = albums.filter((al: any) => al.album_type === "album");
            return dedupeAlbums(fullAlbums.length > 0 ? fullAlbums : albums);
        };

        // Pega os álbuns direto da discografia de artistas do gênero — bem mais
        // preciso do que procurar o nome do gênero no título do álbum (a busca
        // de álbum por texto era o que trazia resultados desconexos)
        const albumsFromArtists = async (profile: GenreProfile) => {
            const artists = await searchArtists(profile);
            const albums: any[] = [];

            for (const artist of shuffle(artists).slice(0, 3)) {
                const data = await apiGet(
                    `${spotifyBaseURL}/artists/${artist.id}/albums`,
                    { include_groups: "album,single", market: "BR" }
                );
                albums.push(...(data?.items ?? []).filter(Boolean));
            }

            // prioriza álbuns "de verdade"; se o artista só tiver singles/EPs, vale o que tiver
            const fullAlbums = albums.filter((al: any) => al.album_type === "album");
            return dedupeAlbums(fullAlbums.length > 0 ? fullAlbums : albums);
        };


        // Montagem dos parâmetros desta tentativa -----
        const selectedGenres: string[] = (formData.GenreType || [])
            .filter((g: string) => g !== "Surpresa");

        // "Surpresa" (ou nada marcado): sorteia entre todos os gêneros conhecidos
        const genreNames = selectedGenres.length > 0 ? selectedGenres : Object.keys(genreProfiles);
        const profiles: GenreProfile[] = shuffle(genreNames).map(
            (name) => genreProfiles[name] ?? { query: name.toLowerCase(), match: [name.toLowerCase()] }
        );

        // humor (faixa/álbum) ou estilo (artista) — sorteia um entre os marcados
        let mood: string | null = null;
        let style: string | null = null;

        if (searchType === "artist") {
            const styles = (formData.FellinType || [])
                .map((f: string) => styleMap[f])
                .filter(Boolean);
            style = styles.length > 0 ? pickRandom(styles) : null;
        } else {
            const moods = (formData.FellinType || [])
                .filter((f: string) => f !== "Destino")
                .map((f: string) => moodMap[f])
                .filter(Boolean);
            mood = moods.length > 0 ? pickRandom(moods) : null;
        }

        // Executa a busca de um gênero, seguindo os planos do tipo escolhido
        const buscarPorGenero = async (profile: GenreProfile, ignorarFiltros = false) => {
            const moodWord = ignorarFiltros ? null : mood;
            const styleWord = ignorarFiltros ? null : style;

            if (searchType === "artist") {
                const artists = await searchArtists(profile);
                return applyStyle(artists, styleWord);
            }

            if (searchType === "album") {
                // PLANO A: com humor, acha álbuns pelas faixas de playlists do gênero
                if (moodWord) {
                    const tracks = await searchViaPlaylist(profile, moodWord);
                    const albums = albumsFromTracks(tracks);
                    if (albums.length > 0) return albums;
                }
                // PLANO B: álbuns dos artistas do gênero
                return await albumsFromArtists(profile);
            }

            // faixas 
            if (moodWord) {
                // PLANO A: humor -> playlists do gênero (melhor relevância)
                const viaPlaylist = await searchViaPlaylist(profile, moodWord);
                if (viaPlaylist.length > 0) return viaPlaylist;

                // PLANO B: busca direta de gênero + humor
                const comHumor = await searchTracks(profile, moodWord);
                if (comHumor.length > 0) return comHumor;
            }
            // PLANO C: só o gênero
            return await searchTracks(profile, null);
        };

        let items: any[] = [];

        // tenta cada gênero marcado (em ordem sorteada) até achar algo
        for (const profile of profiles.slice(0, 3)) {
            items = await buscarPorGenero(profile);
            if (items.length > 0) break;
        }

        // PLANO D: curinga — qualquer gênero conhecido, sem humor/estilo
        if (items.length === 0) {
            console.log("Acionando gênero curinga...");
            items = await buscarPorGenero(pickRandom(Object.values(genreProfiles)), true);
        }

        if (items.length === 0) return [];

        // Não repete recomendações já mostradas nesta sessão. Se todas as
        // opções encontradas já tiverem aparecido, libera a repetição em vez  de voltar de mãos vazias
        const fresh = items.filter((it: any) => it?.id && !shownIds.has(it.id));
        const pool = fresh.length > 0 ? fresh : items;

        // Sorteia o resultado e o coloca no início (a tela exibe items[0])
        const chosen = pickRandom(pool);
        if (chosen?.id) shownIds.add(chosen.id);
        return [chosen, ...items.filter((it: any) => it !== chosen)];

    } catch (error: any) {
        console.error("Erro ao buscar recomendações de músicas:", error?.response?.data ?? error);
        return null;
    }
};
