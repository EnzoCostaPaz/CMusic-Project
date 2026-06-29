# CMusic 🎵
> O lugar para sair do tédio de ouvir as mesmas músicas.

## Sobre 📖
O CMusic é um sistema web desenvolvido pensando naqueles momentos em que você está cansado de ouvir as mesmas músicas e precisa de novos ares.

Integrado com a API do Spotify Web, o site oferece um formulário interativo em 3 etapas:
* **1ª Etapa:** Escolha o que você busca (Álbum, Música ou Cantor/Banda).
* **2ª Etapa:** Escolha um ou mais gêneros musicais para guiar a recomendação.
* **3ª Etapa:** Escolha a sensação que deseja sentir (ou o estilo, caso tenha escolhido Cantor/Banda na primeira etapa).

Após isso, o algoritmo cruza os dados e a API busca uma recomendação

---

## Tecnologias Utilizadas ⌨️
![Static Badge](https://img.shields.io/badge/ReactJS%20-%20black?style=for-the-badge&logo=react&logoColor=white&logoSize=auto&labelColor=%2361DAFB&color=white) 
![Static Badge](https://img.shields.io/badge/Typescript-%20black?style=for-the-badge&logo=typescript&logoColor=white&logoSize=auto&labelColor=%233178C6&color=white)
![Static Badge](https://img.shields.io/badge/CSS%20Modules%20-%20black?style=for-the-badge&logo=css&logoColor=white&logoSize=auto&labelColor=%23663399&color=white)
![Static Badge](https://img.shields.io/badge/Vercel%20-%20black?style=for-the-badge&logo=vercel&logoColor=white&logoSize=auto&labelColor=%23000000&color=white)
![Static Badge](https://img.shields.io/badge/Spotify%20Web%20API%20-%20black?style=for-the-badge&logo=spotify&logoColor=white&logoSize=auto&labelColor=%231ED760&color=white)

---

## Acesso Online 🌍
Você pode testar o projeto rodando ao vivo através deste link:  
[**Acessar CMusic na Vercel**](https://c-music-project-three.vercel.app)

---

## Como rodar o projeto localmente 💻

### Pré-requisitos
* Ter o Node.js e o NPM instalados na máquina.
* Possuir uma conta no Spotify (Premium recomendado para algumas features da API).

### Passo a Passo
1. Acesse o [Dashboard da API do Spotify](https://developer.spotify.com/dashboard) e faça login com a sua conta.
2. Crie um novo *App* no dashboard.
3. Copie as suas chaves de segurança: **Client ID** e **Client Secret**.
4. Faça o clone deste repositório na sua máquina:
   ```bash
   git clone [https://github.com/SeuUsuario/c-music-project-three.git](https://github.com/SeuUsuario/c-music-project-three.git)
5. Acesse a pasta do projeto e instale as dependências:
   `cd c-music-project-three
    npm install`
6. Crie um arquivo chamado .env na raiz do projeto e adicione as suas chaves do Spotify:<br>
   `VITE_SPOTIFY_CLIENT_ID="chave"`<br>
    `VITE_SPOTIFY_CLIENT_SECRET="chave"`
7. Rode o servidor de desenvolvimento:<br>
   `npm run dev`

### status📊

![Static Badge](https://img.shields.io/badge/Em%20andamento%20-%20black?style=for-the-badge&logoColor=white&logoSize=auto&label=status&labelColor=purple&color=white)
