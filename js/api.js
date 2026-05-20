const API_KEY  = 'ad12d0dc';
const API_BASE = 'https://www.omdbapi.com';

const buildUrl = (params) =>
  `${API_BASE}/?${new URLSearchParams({ apikey: API_KEY, ...params })}`;

const OmdbApi = {
  search: async (query, page = 1) => {
    const res  = await fetch(buildUrl({ s: query, page, type: 'movie' }));
    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error);
    return data;
  },

  getById: async (imdbId) => {
    const res  = await fetch(buildUrl({ i: imdbId, plot: 'full' }));
    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error);
    return data;
  },

  getByIds: async (ids) => {
    const results = await Promise.all(
      ids.map(id =>
        fetch(buildUrl({ i: id, plot: 'short' }))
          .then(r => r.json())
          .then(d => d.Response === 'True' ? d : null)
          .catch(() => null)
      )
    );
    return results.filter(Boolean);
  },

  searchMovies: async (query, page = 1) => {
    const res  = await fetch(buildUrl({ s: query, page, type: 'movie' }));
    const data = await res.json();
    if (data.Response === 'False') return { Search: [], totalResults: '0' };
    return data;
  },
};
