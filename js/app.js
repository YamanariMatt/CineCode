const CATEGORIES = [
  {
    label: 'Ação',
    ids: ['tt1392190','tt2911666','tt0095016','tt0317919','tt7131622',
          'tt0172495','tt0468569','tt4154796','tt0111257','tt0113277'],
  },
  {
    label: 'Comédia',
    ids: ['tt2278388','tt0829482','tt0099785','tt0107614',
          'tt0107048','tt0091042','tt1119646','tt1477834','tt7322224','tt2704998'],
  },
  {
    label: 'Thriller',
    ids: ['tt2267998','tt1392214','tt6751668','tt0443706','tt0114369',
          'tt0477348','tt0364569','tt1130884','tt2872718','tt1568346'],
  },
  {
    label: 'Ficção Científica',
    ids: ['tt0816692','tt0133093','tt1856101','tt2543164','tt3460252',
          'tt0062622','tt0078748','tt1631867','tt1798709','tt1160419'],
  },
  {
    label: 'Drama',
    ids: ['tt0111161','tt0108052','tt0068646',
          'tt0109830','tt0050083','tt0099685','tt0268978','tt2582802','tt1979376','tt7653254'],
  },
  {
    label: 'Terror',
    ids: ['tt0081505','tt5052448','tt7784604','tt6644200','tt1396484',
          'tt8772262','tt1457767','tt0078935','tt1922777','tt4263482'],
  },
  {
    label: 'Animação',
    ids: ['tt0910970','tt1049413','tt0245429','tt0114709','tt0110357',
          'tt4633694','tt2380307','tt0382932','tt0295297','tt0347149'],
  },
  {
    label: 'Romance',
    ids: ['tt3783958','tt0332280','tt0414387','tt0307479',
          'tt0112471','tt0211915','tt0120338','tt1022603','tt2219695','tt5726616'],
  },
];

const App = {
  _searchTimer:  null,
  _searchMode:   'movie',
  _currentQuery: '',
  _currentPage:  1,
  _totalResults: 0,
  _results:      [],

  init() {
    App._updateFavBadge();
    App._loadCategories();
    Artists.init();
  },

  navigate(tab) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${tab}`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    if (tab === 'favorites') App._renderFavorites();
  },

  setSearchMode(mode, btn) {
    App._searchMode = mode;
    document.querySelectorAll('.sbar-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const placeholder = mode === 'person' ? 'Nome do artista...' : 'Título, diretor, ator...';
    document.getElementById('search-input').placeholder = placeholder;
    if (App._currentQuery.trim()) App.handleSearch(App._currentQuery);
  },

  handleSearch(value) {
    App._currentQuery = value;
    const clearBtn = document.getElementById('search-clear');
    clearBtn.classList.toggle('visible', value.length > 0);
    clearTimeout(App._searchTimer);

    if (!value.trim()) {
      App._results = [];
      document.getElementById('search-grid').innerHTML = '';
      document.getElementById('search-status').innerHTML = '';
      document.getElementById('load-more-wrap').style.display = 'none';
      return;
    }

    App.navigate('search');

    if (App._searchMode === 'person') {
      document.getElementById('search-grid').innerHTML = '';
      document.getElementById('search-status').innerHTML = '';
      App._searchTimer = setTimeout(() => App._execPersonSearch(value), 420);
      return;
    }

    document.getElementById('search-grid').innerHTML = Render.skeletons(8);
    document.getElementById('search-status').innerHTML = '';
    document.getElementById('load-more-wrap').style.display = 'none';

    App._searchTimer = setTimeout(() => {
      App._currentPage = 1;
      App._results     = [];
      App._execMovieSearch(value, 1);
    }, 420);
  },

  clearSearch() {
    const input = document.getElementById('search-input');
    input.value = '';
    App.handleSearch('');
    input.focus();
  },

  loadMore() {
    App._currentPage += 1;
    App._execMovieSearch(App._currentQuery, App._currentPage);
  },

  toggleFav(event, imdbId, movie) {
    event.stopPropagation();
    const added = Favorites.toggle(movie);
    App._updateFavBadge();
    App._syncFavButtons(imdbId, added);
    App._showToast(added ? '❤ Adicionado aos favoritos' : '♡ Removido dos favoritos');
    if (document.getElementById('view-favorites').classList.contains('active')) App._renderFavorites();
  },

  toggleFavFromModal(movie) {
    const added = Favorites.toggle(movie);
    App._updateFavBadge();
    App._syncFavButtons(movie.imdbID, added);
    const btn = document.getElementById('modal-fav-btn');
    if (btn) { btn.textContent = added ? '❤' : '♡'; btn.classList.add('heart-pop'); setTimeout(() => btn.classList.remove('heart-pop'), 400); }
    App._showToast(added ? '❤ Adicionado aos favoritos' : '♡ Removido dos favoritos');
    if (document.getElementById('view-favorites').classList.contains('active')) App._renderFavorites();
  },

  _execMovieSearch(query, page) {
    OmdbApi.search(query, page)
      .then(data => {
        App._totalResults = parseInt(data.totalResults, 10);
        App._results      = page === 1 ? data.Search : [...App._results, ...data.Search];
        const grid   = document.getElementById('search-grid');
        const status = document.getElementById('search-status');
        grid.innerHTML   = App._results.map(m => Render.movieCard(m, 'grid')).join('');
        status.innerHTML = `${App._totalResults} resultado${App._totalResults !== 1 ? 's' : ''} para <strong>"${query}"</strong>`;
        const wrap = document.getElementById('load-more-wrap');
        wrap.style.display = App._results.length < App._totalResults ? 'block' : 'none';
      })
      .catch(() => {
        document.getElementById('search-grid').innerHTML = '';
        document.getElementById('search-status').innerHTML =
          `<span style="color:var(--red)">Nenhum resultado para "${query}".</span>`;
        document.getElementById('load-more-wrap').style.display = 'none';
      });
  },

  _execPersonSearch(query) {
    const status = document.getElementById('search-status');
    const grid   = document.getElementById('search-grid');

    const matched = (window.FEATURED_ARTISTS || []).filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matched.length) {
      status.innerHTML = `${matched.length} artista${matched.length !== 1 ? 's' : ''} encontrado${matched.length !== 1 ? 's' : ''}`;
      grid.innerHTML = `<div class="artists-grid" style="grid-column:1/-1">${matched.map(a => Render.artistCard(a)).join('')}</div>`;
      document.getElementById('load-more-wrap').style.display = 'none';
      return;
    }

    status.innerHTML = `<span style="color:var(--text2)">Buscando artistas por filmes relacionados a "${query}"...</span>`;
    OmdbApi.search(query, 1)
      .then(data => {
        const movies  = data.Search || [];
        const seen    = new Set();
        const people  = [];
        movies.forEach(m => {
          [m.Director, m.Actors, m.Writer].filter(Boolean).join(',')
            .split(',')
            .map(s => s.trim())
            .filter(s => s && s !== 'N/A' && s.toLowerCase().includes(query.toLowerCase()))
            .forEach(name => {
              if (!seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                people.push({ id: name, name, avatarUrl: null, searchTerm: name });
              }
            });
        });
        if (people.length) {
          status.innerHTML = `${people.length} artista${people.length !== 1 ? 's' : ''} relacionado${people.length !== 1 ? 's' : ''} a <strong>"${query}"</strong>`;
          grid.innerHTML = `<div class="artists-grid" style="grid-column:1/-1">${people.map(a => Render.artistCard(a)).join('')}</div>`;
        } else {
          status.innerHTML = `<span style="color:var(--red)">Nenhum artista encontrado para "${query}".</span>`;
          grid.innerHTML = '';
        }
        document.getElementById('load-more-wrap').style.display = 'none';
      })
      .catch(() => {
        status.innerHTML = `<span style="color:var(--red)">Erro na busca.</span>`;
        grid.innerHTML   = '';
      });
  },

  _renderFavorites() {
    const grid   = document.getElementById('favorites-grid');
    const empty  = document.getElementById('fav-empty');
    const label  = document.getElementById('fav-count-label');
    const favs   = Favorites.getAll();
    label.textContent = `${favs.length} filme${favs.length !== 1 ? 's' : ''}`;
    if (!favs.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    grid.innerHTML = favs.map(m => Render.movieCard(m, 'grid')).join('');
  },

  _loadCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = CATEGORIES.map(({ label }) => `
      <section class="category-section">
        <div class="category-header">
          <h2 class="category-title">${label}</h2>
          <div class="category-line"></div>
        </div>
        <div class="category-row">${Render.skeletons(7)}</div>
      </section>`).join('');

    const rows = container.querySelectorAll('.category-row');
    CATEGORIES.forEach(({ ids }, i) => {
      OmdbApi.getByIds(ids).then(movies => {
        if (!rows[i]) return;
        const valid = movies.filter(m => m.Poster && m.Poster !== 'N/A');
        rows[i].innerHTML = valid
          .map(m => `<div style="flex-shrink:0;width:162px">${Render.movieCard(m, 'row')}</div>`)
          .join('');
      });
    });
  },

  _updateFavBadge() {
    const count = Favorites.count();
    const badge = document.getElementById('fav-badge');
    badge.textContent  = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  },

  _syncFavButtons(imdbId, isFav) {
    document.querySelectorAll(`#fav-btn-${imdbId}`).forEach(btn => {
      btn.textContent = isFav ? '❤' : '♡';
      btn.classList.add('heart-pop');
      setTimeout(() => btn.classList.remove('heart-pop'), 400);
    });
  },

  _showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(App._toastT);
    App._toastT = setTimeout(() => t.classList.remove('show'), 2400);
  },
};

// expose for artists.js
window.FEATURED_ARTISTS = (typeof FEATURED_ARTISTS !== 'undefined') ? FEATURED_ARTISTS : [];

document.addEventListener('DOMContentLoaded', () => App.init());
