document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }


  // TikTok officiel ARRAHMA : lien sur toutes les pages et QR sur l'accueil.
  const tiktokUrl = 'https://vm.tiktok.com/ZG9fthHwYooPS-TbkFT/';
  const socialFooter = document.querySelector('.site-footer .social-direct');
  if (socialFooter && !socialFooter.querySelector('[data-arrahma-tiktok]')) {
    const link = document.createElement('a');
    link.href = tiktokUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'TikTok ARRAHMA (nouvel onglet)');
    link.dataset.arrahmaTiktok = 'true';
    link.textContent = 'TikTok ↗';
    socialFooter.appendChild(link);
  }
  const qrGrid = document.getElementById('reseaux-qr');
  if (qrGrid && !qrGrid.querySelector('[data-arrahma-tiktok]')) {
    const card = document.createElement('div');
    card.className = 'qr-card';
    card.dataset.arrahmaTiktok = 'true';
    const anchor = document.createElement('a');
    anchor.href = tiktokUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', 'TikTok ARRAHMA (nouvel onglet)');
    const img = document.createElement('img');
    img.alt = 'QR code TikTok ARRAHMA, compte ASSO.ARRAHMA';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 300;
    img.height = 300;
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=' + encodeURIComponent(tiktokUrl);
    anchor.appendChild(img);
    const name = document.createElement('strong');
    name.textContent = 'TikTok';
    const handle = document.createElement('span');
    handle.textContent = '@asso.arrahma';
    const direct = document.createElement('a');
    direct.className = 'qr-direct-link';
    direct.href = tiktokUrl;
    direct.target = '_blank';
    direct.rel = 'noopener noreferrer';
    direct.textContent = 'Ouvrir TikTok ↗';
    card.append(anchor, name, handle, direct);
    qrGrid.appendChild(card);
    const intro = qrGrid.previousElementSibling?.querySelector('p');
    if (intro && intro.textContent.includes('Instagram, Snapchat et Facebook')) {
      intro.textContent = 'Suivez nos actualités sur Instagram, Snapchat, Facebook et TikTok.';
    }
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
        ? (selectedType === 'ouverte' ? 'Aucune fiche du catalogue n’est annoncée ouverte. Consultez le calendrier en haut de page pour les activités effectivement ouvertes.' : 'Aucune fiche ne correspond à ces critères. Essayez un autre mot-clé ou réinitialisez les filtres.')
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

// Mesure d’audience : module commun, indépendant des filtres et du menu.
(() => {
  const script = document.createElement('script');
  script.src = new URL('analytics.js', document.currentScript.src).href;
  script.defer = true;
  document.head.appendChild(script);
})();

(() => {
  if (!document.querySelector('[data-activities-list]')) return;
  const script = document.createElement('script');
  script.src = new URL('activities.js?v=676b45c1b4', document.currentScript.src).href;
  document.head.appendChild(script);
})();

