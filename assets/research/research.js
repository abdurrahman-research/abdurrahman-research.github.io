(() => {
  'use strict';
  const dialog = document.getElementById('paper-dialog');
  const data = document.getElementById('research-papers');
  if (!dialog || !data || typeof dialog.showModal !== 'function') return;
  const papers = JSON.parse(data.textContent);
  let trigger = null;
  const title = document.getElementById('paper-title');
  const meta = document.getElementById('paper-meta');
  const figure = document.getElementById('paper-figure');
  const figureImage = document.getElementById('paper-image');
  const credit = document.getElementById('paper-credit');
  const summary = document.getElementById('paper-summary');
  const sourceLink = document.getElementById('paper-source');
  document.querySelectorAll('.paper-card[data-paper]').forEach(card => {
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const paper = papers[card.dataset.paper];
      if (!paper) return;
      event.preventDefault();
      trigger = card;
      title.textContent = paper.title;
      meta.textContent = [paper.journal, paper.year, paper.doi ? `DOI: ${paper.doi}` : ''].filter(Boolean).join(' · ');
      figure.hidden = !paper.image;
      if (paper.image) {
        figureImage.src = paper.image;
        figureImage.alt = `${paper.figure || 'Research figure'} — ${paper.title}`;
        credit.textContent = [paper.figure, paper.credit, paper.license].filter(Boolean).join(' · ');
      } else {
        figureImage.removeAttribute('src');
        figureImage.alt = '';
        credit.textContent = '';
      }
      summary.textContent = paper.summary;
      sourceLink.href = paper.source_url;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  document.getElementById('paper-close').addEventListener('click', () => dialog.close());
  let pointerDownOnBackdrop = false;
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { pointerDownOnBackdrop = outside(event); });
  dialog.addEventListener('click', event => {
    if (pointerDownOnBackdrop && outside(event)) dialog.close();
    pointerDownOnBackdrop = false;
  });
  dialog.addEventListener('close', () => {
    if (trigger) trigger.focus({ preventScroll: true });
  });
})();
