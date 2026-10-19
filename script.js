'use strict';
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.nav-wrap')) closeMenu(); });

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.architecture-card')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  let visible = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) visible++;
  });
  document.querySelector('#filter-status').textContent = `Showing ${visible} ${visible === 1 ? 'diagram' : 'diagrams'}`;
}));

const dialog = document.querySelector('#diagram-dialog');
let dialogOpener = null;
document.querySelectorAll('.diagram-preview').forEach(button => button.addEventListener('click', () => {
  if (typeof dialog.showModal !== 'function') { window.open(button.dataset.diagram, '_blank', 'noopener'); return; }
  dialogOpener = button;
  document.querySelector('#dialog-title').textContent = button.dataset.title;
  const image = document.querySelector('#dialog-image');
  image.src = button.dataset.diagram;
  image.alt = `${button.dataset.title} architecture diagram`;
  document.querySelector('#dialog-svg').href = button.dataset.diagram;
  document.querySelector('#dialog-walkthrough').href = button.dataset.walkthrough;
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('.dialog-close').focus();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (dialogOpener) dialogOpener.focus();
});

const copyButton = document.querySelector('.copy-email');
let copyTimer;
copyButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyButton.textContent = 'Copied!';
    document.querySelector('#copy-status').textContent = 'Email address copied to clipboard.';
  } catch {
    copyButton.textContent = 'Select email to copy';
    document.querySelector('#copy-status').textContent = 'Automatic copying is unavailable. Select the email address to copy it, or use the email link.';
  }
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => { copyButton.textContent = 'Copy email'; }, 3500);
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
