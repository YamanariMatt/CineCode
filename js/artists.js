/* ─────────────────────────────────────────────────────────────────────
   Artists module
   A OMDb não tem endpoint de pessoa, então usamos s= para buscar filmes
   relacionados ao nome digitado, e exibimos os artistas a partir dos
   campos Director / Actors / Writer de cada resultado.
   ───────────────────────────────────────────────────────────────────── */

const FEATURED_ARTISTS = [
  { id:'nm0000093', name:'Brad Pitt',         avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg',         searchTerm:'Brad Pitt' },
  { id:'nm0000148', name:'Harrison Ford',     avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Harrison_Ford_at_the_2016_Comic-Con.jpg/440px-Harrison_Ford_at_the_2016_Comic-Con.jpg',  searchTerm:'Harrison Ford' },
  { id:'nm0000168', name:'Tom Hanks',         avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg',                                 searchTerm:'Tom Hanks' },
  { id:'nm0000138', name:'Leonardo DiCaprio', avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Leonardo_DiCaprio_2010.jpg/440px-Leonardo_DiCaprio_2010.jpg',                           searchTerm:'Leonardo DiCaprio' },
  { id:'nm0000354', name:'Meryl Streep',      avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Meryl_Streep_2012.jpg/440px-Meryl_Streep_2012.jpg',                                     searchTerm:'Meryl Streep' },
  { id:'nm0000229', name:'Scarlett Johansson',avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scarlett_Johansson_2012_%28cropped%29.jpg/440px-Scarlett_Johansson_2012_%28cropped%29.jpg', searchTerm:'Scarlett Johansson' },
  { id:'nm0000151', name:'Morgan Freeman',    avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Morgan_Freeman_at_the_2018_Tribeca_Film_Festival_%28cropped%29.jpg/440px-Morgan_Freeman_at_the_2018_Tribeca_Film_Festival_%28cropped%29.jpg', searchTerm:'Morgan Freeman' },
  { id:'nm0000199', name:'Denzel Washington', avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Denzel_Washington_2019.jpg/440px-Denzel_Washington_2019.jpg',                           searchTerm:'Denzel Washington' },
  { id:'nm0001233', name:'Christopher Nolan', avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Christopher_Nolan_Cannes_2018.jpg/440px-Christopher_Nolan_Cannes_2018.jpg',              searchTerm:'Christopher Nolan' },
  { id:'nm0000142', name:'Quentin Tarantino', avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg/440px-Quentin_Tarantino_by_Gage_Skidmore.jpg',  searchTerm:'Quentin Tarantino' },
  { id:'nm0000399', name:'Cate Blanchett',    avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cate_Blanchett_Cannes_2018.jpg/440px-Cate_Blanchett_Cannes_2018.jpg',                   searchTerm:'Cate Blanchett' },
  { id:'nm0000115', name:'Nicolas Cage',      avatarUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/440px-Nicolas_Cage_2011_CC.jpg',                               searchTerm:'Nicolas Cage' },
];

const ArtistModal = {
  _currentArtist: null,

  open(artistId, artistName) {
    const overlay = document.getElementById('artist-modal-overlay');
    const body    = document.getElementById('artist-modal-body');
    body.innerHTML = '<div class="modal__loader"><div class="spinner"></div></div>';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const known = FEATURED_ARTISTS.find(a => a.id === artistId || a.name === artistName);
    ArtistModal._loadArtist(known || { id: artistId, name: artistName, avatarUrl: null, searchTerm: artistName });
  },

  _loadArtist(artist) {
    const body = document.getElementById('artist-modal-body');
    OmdbApi.search(artist.searchTerm || artist.name, 1)
      .then(data => {
        const movies = (data.Search || []).filter(m => m.Poster && m.Poster !== 'N/A').slice(0, 12);
        body.innerHTML = ArtistModal._buildHtml(artist, movies);
      })
      .catch(() => {
        body.innerHTML = ArtistModal._buildHtml(artist, []);
      });
  },

  _buildHtml(artist, movies) {
    const avatarHtml = artist.avatarUrl
      ? `<img class="artist-modal__avatar" src="${artist.avatarUrl}" alt="${artist.name}" onerror="this.outerHTML='<div class=&quot;artist-modal__avatar-placeholder&quot;>🎭</div>'" />`
      : `<div class="artist-modal__avatar-placeholder">🎭</div>`;

    const movieCards = movies.map(m => `
      <div class="movie-card" onclick="Modal.open('${m.imdbID}'); ArtistModal.close();" style="cursor:pointer">
        <div class="movie-card__poster-wrap">
          <img class="movie-card__poster" src="${m.Poster}" alt="${(m.Title||'').replace(/"/g,'&quot;')}" loading="lazy" />
          <div class="movie-card__overlay"></div>
          ${m.Year && m.Year !== 'N/A' ? `<span class="movie-card__year">${m.Year}</span>` : ''}
        </div>
        <div class="movie-card__info">
          <p class="movie-card__title">${m.Title}</p>
          <p class="movie-card__meta">${m.Year || '—'}</p>
        </div>
      </div>`).join('');

    return `
      <div class="artist-modal__hero">
        ${avatarHtml}
        <div class="artist-modal__meta">
          <h2 class="artist-modal__name">${artist.name}</h2>
          <p class="artist-modal__born">Ator / Diretor / Artista</p>
          <a href="https://www.imdb.com/find?q=${encodeURIComponent(artist.name)}&s=nm"
             target="_blank" rel="noopener noreferrer" class="modal__imdb-link" style="margin-top:0;font-size:12px;padding:7px 16px">
            Ver no IMDb ↗
          </a>
        </div>
      </div>
      ${movies.length > 0 ? `
        <p class="artist-modal__section-title" style="margin-top:28px">Filmes relacionados</p>
        <div class="artist-modal__movies">${movieCards}</div>
      ` : `<p style="padding:28px;color:var(--text2);font-size:14px">Nenhum filme encontrado.</p>`}`;
  },

  close() {
    document.getElementById('artist-modal-overlay').classList.remove('open');
    if (!document.getElementById('modal-overlay').classList.contains('open'))
      document.body.style.overflow = '';
  },
};

const Artists = {
  _timer: null,

  init() {
    const container = document.getElementById('artists-featured');
    if (!container) return;
    container.innerHTML = `
      <p class="artists-featured-title">Artistas em Destaque</p>
      <div class="artists-grid" id="featured-grid">
        ${Render.skeletonArtists(FEATURED_ARTISTS.length)}
      </div>`;
    setTimeout(() => {
      document.getElementById('featured-grid').innerHTML =
        FEATURED_ARTISTS.map(a => Render.artistCard(a)).join('');
    }, 600);
  },

  handleSearch(value) {
    const clearBtn = document.getElementById('artist-clear');
    if (clearBtn) clearBtn.style.display = value ? 'block' : 'none';

    clearTimeout(Artists._timer);
    const status  = document.getElementById('artist-status');
    const results = document.getElementById('artist-results');
    const featured = document.getElementById('artists-featured');

    if (!value.trim()) {
      if (results)  results.innerHTML = '';
      if (status)   status.innerHTML  = '';
      if (featured) featured.style.display = '';
      return;
    }

    if (featured) featured.style.display = 'none';
    if (results)  results.innerHTML = `<div class="artists-grid">${Render.skeletonArtists(6)}</div>`;
    if (status)   status.innerHTML  = '';

    Artists._timer = setTimeout(() => Artists._exec(value), 420);
  },

  _exec(query) {
    const status  = document.getElementById('artist-status');
    const results = document.getElementById('artist-results');

    OmdbApi.search(query, 1)
      .then(data => {
        const movies = (data.Search || []);
        const seen   = new Set();
        const people = [];

        movies.forEach(m => {
          const fields = [m.Director, m.Actors, m.Writer].filter(Boolean).join(',');
          fields.split(',').forEach(raw => {
            const name = raw.trim();
            if (!name || name === 'N/A' || seen.has(name.toLowerCase())) return;
            seen.add(name.toLowerCase());
            if (!name.toLowerCase().includes(query.toLowerCase())) return;
            people.push({ id: name, name, avatarUrl: null, searchTerm: name });
          });
        });

        const matched = FEATURED_ARTISTS.filter(a =>
          a.name.toLowerCase().includes(query.toLowerCase())
        );
        matched.forEach(a => {
          if (!seen.has(a.name.toLowerCase())) people.unshift(a);
        });

        if (status) status.innerHTML = people.length
          ? `${people.length} artista${people.length !== 1 ? 's' : ''} para <strong>"${query}"</strong>`
          : '';

        if (!people.length) {
          Artists._searchMoviesByName(query, results, status);
          return;
        }

        results.innerHTML = `<div class="artists-grid">${people.map(p => Render.artistCard(p)).join('')}</div>`;
      })
      .catch(() => {
        Artists._searchMoviesByName(query, results, status);
      });
  },

  _searchMoviesByName(query, results, status) {
    const featured = FEATURED_ARTISTS.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase())
    );
    if (featured.length) {
      if (status) status.innerHTML = `${featured.length} artista${featured.length !== 1 ? 's' : ''} para <strong>"${query}"</strong>`;
      results.innerHTML = `<div class="artists-grid">${featured.map(a => Render.artistCard(a)).join('')}</div>`;
      return;
    }
    if (status) status.innerHTML = `<span style="color:var(--red)">Nenhum artista encontrado para "${query}".</span>`;
    results.innerHTML = '';
  },

  clear() {
    const input = document.getElementById('artist-input');
    if (input) input.value = '';
    Artists.handleSearch('');
  },
};
