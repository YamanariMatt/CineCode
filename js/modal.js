const Modal = {
  open(imdbId) {
    const overlay = document.getElementById('modal-overlay');
    const body    = document.getElementById('modal-body');
    body.innerHTML = '<div class="modal__loader"><div class="spinner"></div></div>';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    OmdbApi.getById(imdbId)
      .then(movie  => { body.innerHTML = Render.movieDetail(movie); })
      .catch(err   => { body.innerHTML = `<div class="modal__error">Erro: ${err.message}</div>`; });
  },
  close() {
    document.getElementById('modal-overlay').classList.remove('open');
    if (!document.getElementById('artist-modal-overlay').classList.contains('open'))
      document.body.style.overflow = '';
  },
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') { Modal.close(); ArtistModal.close(); } });
