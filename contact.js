/* Formulaire de contact : conserver les champs en cas d’erreur et proposer un recours. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.arrahma-contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status || !window.fetch || !window.FormData) return;
  const submit = form.querySelector('button[type="submit"]');
  const subject = form.querySelector('[name="sujet"]');
  const requested = new URLSearchParams(location.search).get('objet');
  if (requested === 'adhesion') subject.value = 'Adhésion et demande de RIB';
  if (requested === 'newsletter') subject.value = 'Newsletter';
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Envoi en cours…';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
        credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal
      });
      if (!response.ok) throw new Error('Envoi refusé');
      // Une réponse HTML (par exemple un contrôle anti-spam) ne vaut pas confirmation.
      const result = await response.json();
      if (result.ok !== true) throw new Error('Confirmation manquante');
      status.textContent = 'Votre message a été transmis au service de contact. L’association vous répondra par e-mail. Si votre demande concerne la newsletter, votre inscription reste à confirmer par l’équipe.';
      form.reset();
    } catch (_) {
      status.textContent = 'L’envoi n’a pas pu être confirmé. Votre texte est conservé dans le formulaire. Vous pouvez réessayer ou écrire à associationarrahma2025@gmail.com. Si l’envoi a déjà été reçu, un nouvel essai pourrait créer un doublon.';
    } finally {
      clearTimeout(timer);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      sending = false;
      status.focus();
    }
  });
});
