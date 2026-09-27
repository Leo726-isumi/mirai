// ---- Supabase 接続設定 ----
// Supabase ダッシュボード > Project Settings > API から取得して置き換えてください
const SUPABASE_URL = 'https://njnblmhsmxresbawnuiw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sqR7L391kUFfobAVrJv4fg_7pwi6sRF';

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

    try {
      const payload = { name, email: email || null, rating, comment };
      console.log('[feedback] sending payload:', payload);

      const { data, error, status, statusText } = await sb
        .from('feedback')
        .insert([payload])
        .select();

      console.log('[feedback] response:', { data, error, status, statusText });

      if (error) {
        console.error('[feedback] insert error message:', error.message);
        console.error('[feedback] insert error code:', error.code);
        console.error('[feedback] insert error details:', error.details);
        console.error('[feedback] insert error hint:', error.hint);
        feedbackNote.textContent = `送信に失敗しました。(${error.code ?? 'unknown'}: ${error.message ?? '原因不明'})`;
        return;
      }

      feedbackNote.textContent = 'ご意見ありがとうございました。今後のサイト改善に活用させていただきます。';
      feedbackForm.reset();
    } catch (err) {
      console.error('[feedback] unexpected exception:', err);
      feedbackNote.textContent = `送信に失敗しました。(例外: ${err.message ?? err}）`;
    } finally {
      feedbackSubmitBtn.disabled = false;
    }
  });
});
