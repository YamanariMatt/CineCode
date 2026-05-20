const STORAGE_KEY = 'cinecode_favorites';

const Favorites = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  },
  save(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  },
  toggle(movie) {
    const list = Favorites.getAll();
    const idx  = list.findIndex(m => m.imdbID === movie.imdbID);
    if (idx > -1) { list.splice(idx, 1); Favorites.save(list); return false; }
    list.unshift({ imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Poster: movie.Poster });
    Favorites.save(list);
    return true;
  },
  has(id) { return Favorites.getAll().some(m => m.imdbID === id); },
  count()  { return Favorites.getAll().length; },
};
