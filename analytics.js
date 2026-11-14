/* ARRAHMA — compteur public et accès au tableau de bord privé GoatCounter.
 * Aucune clé privée ne doit figurer dans ce fichier ou dans la configuration.
 */
(() => {
  'use strict';
  const moduleURL = document.currentScript.src;
  const ready = document.readyState === 'loading'
    ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    : Promise.resolve();
  const preferenceKey = 'arrahma-statistiques-desactivees';
  let optedOut = false;
  try { optedOut = localStorage.getItem(preferenceKey) === 'oui'; } catch (_) { /* Choix en mémoire si stockage bloqué. */ }
  const privacySignal = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  let configuration;
  let providerReady = false;
  const events = [];
  const downloads = new Map([
    ['diagnostic.webp', 'Diagnostic territorial participatif'],
    ['projet.webp', 'Conduite de projet participative'],
    ['accompagnement.webp', 'Accompagnement éducatif'],
    ['evaluation.webp', 'Évaluation et amélioration continue']
  ]);

  function trackingAllowed() {
    return !optedOut && !privacySignal;
  }

  function updateChoice() {
    const button = document.getElementById('stats-optout');
    const status = document.getElementById('stats-choice-status');
    if (!button || !status) return;
    button.textContent = optedOut ? 'Réactiver la mesure d’audience' : 'Désactiver la mesure d’audience';
    button.disabled = privacySignal;
    status.textContent = privacySignal
      ? 'La mesure d’audience est désactivée par le réglage de confidentialité de votre navigateur.'
      : optedOut ? 'La mesure d’audience est désactivée sur ce navigateur.' : 'La mesure d’audience est autorisée sur ce navigateur.';
  }

  function sendEvent(event) {
    if (trackingAllowed() && providerReady && typeof window.goatcounter?.count === 'function') {
      window.goatcounter.count(event);
    }
  }

  function loadProvider(endpoint) {
    // Les aperçus et l’espace équipe ne gonflent pas les statistiques du site.
    const production = location.origin === 'https://associationarrahma2025-oss.github.io'
      && location.pathname.startsWith('/association-arrahma.github.io/');
    if (!production || !trackingAllowed() || location.pathname.endsWith('/statistiques.html')) return;
    window.goatcounter = {
      path: () => trackingAllowed() ? location.pathname : null,
      // Aucun paramètre, fragment ou chemin de provenance potentiellement personnel.
      referrer: document.referrer ? (() => { try { return new URL(document.referrer).origin; } catch (_) { return ''; } })() : '',
      no_events: true,
      // Réévalué aussi après une désactivation sur la page courante.
      title: document.title
    };
    const script = document.createElement('script');
    script.src = 'https://gc.zgo.at/count.js';
    script.async = true;
    script.setAttribute('data-goatcounter', endpoint + '/count');
    script.addEventListener('load', () => {
      providerReady = true;
      if (trackingAllowed()) events.splice(0).forEach(sendEvent);
      else events.length = 0;
    }, { once: true });
    script.addEventListener('error', () => { events.length = 0; }, { once: true });
    document.head.appendChild(script);
  }

  async function showTotal(endpoint, value) {
    if (!trackingAllowed()) {
      value.title = 'Mesure d’audience désactivée sur ce navigateur';
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(endpoint + '/counter/TOTAL.json', {
        credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal
      });
      if (!response.ok) throw new Error('Compteur indisponible');
      const data = await response.json();
      // Le service renvoie un nombre formaté ; ne jamais injecter du HTML.
      if (typeof data.count !== 'string' || !/^[0-9][0-9\s,.\u00a0\u202f]*$/.test(data.count) || data.count.length > 32) {
        throw new Error('Réponse inattendue');
      }
      if (trackingAllowed()) {
        value.textContent = data.count;
        value.title = 'Total depuis l’activation ; actualisation différée, jusqu’à quatre heures';
      }
    } catch (_) {
      value.title = 'Compteur indisponible pour le moment';
    } finally { clearTimeout(timeout); }
  }

  ready.then(async () => {
    const bar = document.createElement('aside');
    bar.className = 'site-statistics';
    bar.setAttribute('aria-label', 'Fréquentation du site');
    const inner = document.createElement('div');
    inner.className = 'container';
    const counter = document.createElement('span');
    counter.append('Visites du site : ');
    const value = document.createElement('strong');
    value.textContent = '—';
    value.title = 'Compteur en attente d’activation';
    counter.appendChild(value);
    const access = document.createElement('a');
    access.href = 'statistiques.html';
    access.textContent = 'Espace équipe · Statistiques';
    inner.append(counter, access);
    bar.appendChild(inner);
    const footer = document.querySelector('.site-footer');
    if (footer) footer.insertAdjacentElement('beforebegin', bar);
    else document.body.appendChild(bar);

    updateChoice();
    document.getElementById('stats-optout')?.addEventListener('click', () => {
      optedOut = !optedOut;
      try { localStorage.setItem(preferenceKey, optedOut ? 'oui' : 'non'); } catch (_) { /* La page reste utilisable. */ }
      events.length = 0;
      updateChoice();
      value.textContent = '—';
      value.title = optedOut ? 'Mesure d’audience désactivée sur ce navigateur' : 'Compteur indisponible pour le moment';
      if (configuration && trackingAllowed()) showTotal(configuration, value);
    });

    try {
      const response = await fetch(new URL('analytics-config.json', moduleURL), { credentials: 'omit' });
      if (!response.ok) return;
      const config = await response.json();
      // Le nom d’un compte public suffit : aucune clé API exposée au navigateur.
      if (typeof config.site !== 'string' || !/^[a-z][a-z0-9-]{0,62}$/.test(config.site)) return;
      configuration = 'https://' + config.site + '.goatcounter.com';
    } catch (_) { return; }

    const login = document.getElementById('stats-login');
    if (login) {
      login.href = configuration + '/';
      login.rel = 'noopener noreferrer';
      login.target = '_blank';
      login.hidden = false;
      const status = document.getElementById('stats-access-status');
      if (status) status.textContent = 'La connexion et les droits d’accès sont gérés par GoatCounter. Seuls les comptes autorisés peuvent consulter les détails.';
    }
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[download]');
      if (!link || !trackingAllowed() || !configuration || location.pathname.endsWith('/statistiques.html')) return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin) return;
      const filename = target.pathname.split('/').pop();
      const title = downloads.get(filename);
      if (!title) return;
      const hit = { path: 'telechargement-' + filename.replace('.webp', ''), title: 'Téléchargement · ' + title, event: true, no_session: true };
      if (providerReady) sendEvent(hit);
      else if (events.length < 8) events.push(hit);
    });
    showTotal(configuration, value);
    loadProvider(configuration);
  });
})();
