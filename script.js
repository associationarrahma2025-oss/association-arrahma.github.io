document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Année du pied de page
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Recherche et filtres de la page « Nos actions »
  const cards = Array.from(document.querySelectorAll('.action-item'));
  if (!cards.length) return;

  const buttons = Array.from(document.querySelectorAll('.filter-button[data-filter]'));
  const search = document.getElementById('action-search');
  const typeSelect = document.getElementById('action-type');
  const count = document.getElementById('action-count');
  const reset = document.getElementById('action-reset');
  let selectedCategory = 'all';

  // Ignore les accents, la casse et les espaces superflus pour une recherche naturelle.
  const normalize = value => (value || '')
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function applyFilters() {
    const query = normalize(search ? search.value : '');
    const selectedType = typeSelect ? typeSelect.value : 'all';
    let visible = 0;

    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      const types = (card.dataset.type || '').split(/\s+/).filter(Boolean);
      // On cherche aussi dans les attributs (catégories/types), pas uniquement dans le texte visible.
      const searchableText = normalize([
        card.textContent,
        card.dataset.category,
        card.dataset.type,
        card.getAttribute('aria-label'),
        ...categories,
        ...types
      ].filter(Boolean).join(' '));
      const matchesCategory = selectedCategory === 'all' || categories.includes(selectedCategory);
      const matchesType = selectedType === 'all' || types.includes(selectedType);
      const matchesSearch = !query || query.split(' ').every(word => searchableText.includes(word));
      const show = matchesCategory && matchesType && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });

    if (count) {
      count.textContent = visible === 0
        ? 'Aucune action ne correspond à ces critères. Essaie un autre mot-clé ou réinitialise les filtres.'
        : `${visible} fiche${visible > 1 ? 's' : ''} affichée${visible > 1 ? 's' : ''}`;
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    selectedCategory = button.dataset.filter || 'all';
    applyFilters();
  }));

  if (search) search.addEventListener('input', applyFilters);
  if (typeSelect) typeSelect.addEventListener('change', applyFilters);
  if (reset) reset.addEventListener('click', () => {
    selectedCategory = 'all';
    if (search) search.value = '';
    if (typeSelect) typeSelect.value = 'all';
    buttons.forEach(button => {
      const active = button.dataset.filter === 'all';
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyFilters();
  });

  // État initial : toutes les fiches visibles.
  buttons.forEach(button => button.setAttribute('aria-pressed', String((button.dataset.filter || 'all') === 'all')));
  applyFilters();
});
