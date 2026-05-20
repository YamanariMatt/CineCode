const FALLBACK_POSTER  = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect fill="#111120" width="300" height="450"/><text fill="#2a2a40" font-size="72" text-anchor="middle" x="150" y="250">🎬</text></svg>')}`;
const FALLBACK_AVATAR  = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#111120" width="200" height="200"/><text fill="#2a2a40" font-size="72" text-anchor="middle" x="100" y="120">🎭</text></svg>')}`;

const Render = {
  posterSrc: (url) => url && url !== 'N/A' ? url : FALLBACK_POSTER,
  avatarSrc: (url) => url && url !== 'N/A' ? url : FALLBACK_AVATAR,

  skeletonCard() {
    return `<div class="movie-card movie-card--skeleton">
      <div class="movie-card__poster-wrap"></div>
      <div class="movie-card__info">
        <div class="movie-card__title"> </div>
        <div class="movie-card__meta"> </div>
      </div>
    </div>`;
  },

  skeletons(n = 8) {
    return Array.from({ length: n }, () => Render.skeletonCard()).join('');
  },

  skeletonArtist() {
    return `<div class="artist-card artist-card--skeleton">
      <div class="artist-card__avatar-wrap"></div>
      <div class="artist-card__name"> </div>
      <div class="artist-card__role"> </div>
    </div>`;
  },

  skeletonArtists(n = 6) {
    return Array.from({ length: n }, () => Render.skeletonArtist()).join('');
  },

  movieCard(movie, context = 'grid') {
    const isFav  = Favorites.has(movie.imdbID);
    const poster = Render.posterSrc(movie.Poster);
    const mJson  = JSON.stringify(movie).replace(/"/g, '&quot;');
    const w      = context === 'row' ? 'style="width:162px"' : '';
    return `
      <div class="movie-card" ${w} onclick="Modal.open('${movie.imdbID}')">
        <div class="movie-card__poster-wrap">
          <img class="movie-card__poster" src="${poster}"
               alt="${(movie.Title||'').replace(/"/g,'&quot;')}" loading="lazy"
               onerror="this.src='${FALLBACK_POSTER}'" />
          <div class="movie-card__overlay"></div>
          ${movie.Year && movie.Year !== 'N/A' ? `<span class="movie-card__year">${movie.Year}</span>` : ''}
          <button class="movie-card__fav-btn" id="fav-btn-${movie.imdbID}"
                  onclick="App.toggleFav(event,'${movie.imdbID}',${mJson})"
                  title="${isFav ? 'Remover' : 'Favoritar'}">${isFav ? '❤' : '♡'}</button>
        </div>
        <div class="movie-card__info">
          <p class="movie-card__title">${movie.Title || '—'}</p>
          <p class="movie-card__meta">${movie.Year && movie.Year !== 'N/A' ? movie.Year : '—'}</p>
        </div>
      </div>`;
  },

  artistCard(artist) {
    const name   = artist.name || artist.Name || '—';
    const birth  = artist.birth_year || '';
    const movies = artist.known_for_count || '';
    const avatar = artist.avatarUrl || FALLBACK_AVATAR;
    const id     = artist.id || artist.imdbID || '';
    return `
      <div class="artist-card" onclick="ArtistModal.open('${id}','${name.replace(/'/g,"\\'")}')"
           title="${name}">
        <div class="artist-card__avatar-wrap">
          <img class="artist-card__avatar" src="${avatar}" alt="${name}"
               loading="lazy" onerror="this.src='${FALLBACK_AVATAR}'" />
        </div>
        <p class="artist-card__name">${name}</p>
        <p class="artist-card__role">${birth ? `b. ${birth}` : 'Artista'}</p>
        ${movies ? `<span class="artist-card__count">${movies} filmes</span>` : ''}
      </div>`;
  },

  ratingPill(source, value) {
    const map = {
      'Internet Movie Database': { cls:'imdb', label:'IMDb' },
      'Rotten Tomatoes':         { cls:'rt',   label:'🍅 RT' },
      'Metacritic':              { cls:'mc',   label:'MC' },
    };
    const c = map[source] || { cls:'other', label: source };
    return `<div class="rating-pill rating-pill--${c.cls}">
      <span class="rating-pill__label">${c.label}</span>
      <span class="rating-pill__value">${value}</span>
    </div>`;
  },

  detailRow(label, value) {
    if (!value || value === 'N/A') return '';
    return `<div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${value}</span>
    </div>`;
  },

  movieDetail(movie) {
    const isFav  = Favorites.has(movie.imdbID);
    const poster = Render.posterSrc(movie.Poster);
    const mJson  = JSON.stringify(movie).replace(/"/g, '&quot;');
    const ratings = (movie.Ratings || []).map(r => Render.ratingPill(r.Source, r.Value)).join('');
    const rows = [
      ['Diretor',    movie.Director],
      ['Roteiro',    movie.Writer],
      ['Elenco',     movie.Actors],
      ['País',       movie.Country],
      ['Idioma',     movie.Language],
      ['Bilheteria', movie.BoxOffice],
      ['Prêmios',    movie.Awards],
    ].map(([l,v]) => Render.detailRow(l,v)).join('');

    return `
      <div class="modal__poster-col">
        <img class="modal__poster" src="${poster}"
             alt="${(movie.Title||'').replace(/"/g,'&quot;')}"
             onerror="this.src='${FALLBACK_POSTER}'" />
      </div>
      <div class="modal__info-col">
        <div class="modal__header-row">
          <div>
            <div class="modal__tags">
              ${movie.Year    !== 'N/A' ? `<span class="modal__tag modal__tag--year">${movie.Year}</span>` : ''}
              ${movie.Rated   !== 'N/A' ? `<span class="modal__tag modal__tag--rated">${movie.Rated}</span>` : ''}
              ${movie.Runtime !== 'N/A' ? `<span class="modal__tag modal__tag--runtime">⏱ ${movie.Runtime}</span>` : ''}
            </div>
            <h2 class="modal__title">${movie.Title}</h2>
            ${movie.Genre !== 'N/A' ? `<p class="modal__genre">${movie.Genre}</p>` : ''}
          </div>
          <button class="modal__fav-btn" id="modal-fav-btn"
                  onclick="App.toggleFavFromModal(${mJson})">${isFav ? '❤' : '♡'}</button>
        </div>
        ${ratings ? `<div class="modal__ratings">${ratings}</div>` : ''}
        ${movie.Plot && movie.Plot !== 'N/A' ? `<p class="modal__plot">${movie.Plot}</p>` : ''}
        <div>${rows}</div>
        <a class="modal__imdb-link" href="https://www.imdb.com/title/${movie.imdbID}"
           target="_blank" rel="noopener noreferrer">Ver no IMDb ↗</a>
      </div>`;
  },
};
