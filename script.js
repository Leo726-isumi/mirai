document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = 'お問い合わせありがとうございます。内容を確認のうえ、事務局よりご連絡いたします。';
    form.reset();
  });

  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackNote = document.getElementById('fbFormNote');

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackNote.textContent = 'ご意見ありがとうございました。今後のサイト改善に活用させていただきます。';
    feedbackForm.reset();
  });
});
