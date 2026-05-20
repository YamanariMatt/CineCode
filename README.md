# CineCode

https://yamanarimatt.github.io/CineCode/

CineCode é uma aplicação web estática para explorar filmes e artistas usando a API do OMDb. Ela oferece pesquisa por títulos e pessoas, categorias temáticas, previews de filmes, detalhes em modal e gerenciamento de favoritos localmente no navegador.

## ✨ Recursos

- Pesquisa de filmes por título, diretor ou ator
- Busca de artistas e exibição de perfis destacados
- Navegação por abas: Início, Buscar, Artistas e Favoritos
- Listagem de categorias de filmes pré-selecionadas
- Visualização de detalhes de filme em modal com sinopse, elenco e avaliações
- Favoritos persistentes em `localStorage`
- UI responsiva e interativa com efeitos de partículas e animações

## 🧩 Tecnologias usadas

- HTML5
- CSS3 (estrutura, responsividade e animações)
- JavaScript puro (ES6+)
- OMDb API para busca de filmes

## 📁 Estrutura do projeto

- `index.html` - página principal da aplicação
- `css/` - estilos e responsividade
- `js/` - lógica da aplicação
  - `api.js` - integração com a OMDb API
  - `app.js` - controle de navegação, pesquisa, favoritos e carregamento de categorias
  - `artists.js` - busca de artistas e exibição de perfis
  - `favorites.js` - persistência de favoritos com `localStorage`
  - `modal.js` - exibição de detalhes do filme em modal
  - `render.js` - geração de componentes HTML dinâmicos
  - `particles.js` - efeitos visuais de partículas no fundo

## 🚀 Como usar

### Opção 1: Abrir diretamente no navegador

Basta abrir o arquivo `index.html` em um navegador moderno.

> Observação: para evitar possíveis restrições de carregamento de recursos locais, é recomendado usar um servidor local.

### Opção 2: Servir com um servidor local simples

No diretório do projeto, execute um servidor HTTP. Por exemplo:

```bash
python -m http.server 5500
```

Em seguida, acesse:

```text
http://localhost:5500
```

### Opção 3: Usar a extensão Live Server do VS Code

1. Instale a extensão `Live Server`
2. Abra o `index.html`
3. Clique em `Go Live`

## ⚙️ Personalização da API OMDb

A chave da API OMDb está definida em `js/api.js`:

```js
const API_KEY  = 'ad12d0dc';
```

Se desejar usar sua própria chave, substitua esse valor.

## 📝 Observações

- A aplicação depende da OMDb API para pesquisa e carregamento de filmes.
- Favoritos são salvos apenas no navegador atual via `localStorage`.
- A busca de artistas usa heurísticas baseadas em resultados de filmes, pois a OMDb não fornece um endpoint dedicado a pessoas.

## 💡 Sugestões de melhorias

- Adicionar cache de resultados na sessão
- Permitir filtro por ano, gênero ou classificação
- Integrar outra API de artistas para obter biografias e fotos adicionais
- Criar um backend para proteger a chave de API

## 📜 Licença

Este projeto pode ser usado livremente para fins pessoais e educacionais. Adapte conforme necessário.
