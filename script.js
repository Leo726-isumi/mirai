// ---- Supabase 接続設定 ----
// Supabase ダッシュボード > Project Settings > API から取得して置き換えてください
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const feedbackSubmitBtn = feedbackForm.querySelector('button[type="submit"]');

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const comment = document.getElementById('fb-comment').value.trim();
    const ratingInput = feedbackForm.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? Number(ratingInput.value) : null;

    feedbackSubmitBtn.disabled = true;
    feedbackNote.textContent = '送信中です…';

    const { error } = await sb.from('feedback').insert([
      { name, email: email || null, rating, comment },
    ]);

    feedbackSubmitBtn.disabled = false;

    if (error) {
      console.error('feedback insert error:', error);
      feedbackNote.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
      return;
    }

    feedbackNote.textContent = 'ご意見ありがとうございました。今後のサイト改善に活用させていただきます。';
    feedbackForm.reset();
  });
});
