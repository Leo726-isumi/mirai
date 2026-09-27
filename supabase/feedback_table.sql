-- ============================================================
-- いすみ援農プロジェクト「ご意見フォーム」用テーブル
-- Supabase の SQL Editor でそのまま実行してください
-- ============================================================

-- UUID 生成関数(gen_random_uuid)を使うための拡張機能
create extension if not exists pgcrypto;

-- ご意見データ格納テーブル
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,                          -- お名前
  email      text,                                    -- メールアドレス(任意)
  rating     smallint check (rating between 1 and 5), -- 満足度(★1〜5)
  comment    text not null,                            -- ご意見・ご感想
  created_at timestamptz not null default now()        -- 送信日時
);

-- ------------------------------------------------------------
-- 権限(GRANT)の付与
-- RLSはあくまで「追加の絞り込み」であり、その前提として
-- ロールにテーブルへの操作権限(GRANT)が無いとRLSポリシーを
-- 設定していても permission denied for table になり反映されません。
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant insert on public.feedback to anon;
grant select on public.feedback to authenticated;

-- Row Level Security(行レベルセキュリティ)を有効化
alter table public.feedback enable row level security;

-- 既存ポリシーがあれば一旦削除してから作り直す(再実行しても安全にするため)
drop policy if exists "feedback_public_insert" on public.feedback;
drop policy if exists "feedback_authenticated_select" on public.feedback;

-- サイト訪問者(anon = publishableキー)からの新規投稿のみ許可
create policy "feedback_public_insert"
  on public.feedback
  for insert
  to anon
  with check (true);

-- 閲覧は管理者(ログイン済みユーザー)のみ許可する例
-- 管理画面などを作らず、Supabase の Table Editor で直接確認する場合は不要です
create policy "feedback_authenticated_select"
  on public.feedback
  for select
  to authenticated
  using (true);

-- ============================================================
-- テストデータ(動作確認用)
-- ============================================================
insert into public.feedback (name, email, rating, comment, created_at) values
  ('山田 太郎',   'yamada.taro@example.com',   5, 'サイトがとても見やすく、援農の内容がよく分かりました。参加してみたいです。', now() - interval '9 days'),
  ('佐藤 花子',   'sato.hanako@example.com',   4, '写真がもう少しあると活動のイメージが湧きやすいと思います。',                 now() - interval '8 days'),
  ('鈴木 一郎',   null,                        5, '稲刈りのボランティアに参加しました。農家さんに感謝され、とても充実した1日でした。', now() - interval '7 days'),
  ('高橋 美咲',   'takahashi.m@example.com',   3, 'スマホで見たとき、フォームの入力欄が少し狭く感じました。',                     now() - interval '6 days'),
  ('田中 健',     'tanaka.ken@example.com',    5, 'コンバイン援農の取り組みに感動しました。免許を活かせる場があるのは素晴らしいです。', now() - interval '5 days'),
  ('伊藤 沙織',   null,                        4, '年間スケジュールが分かりやすく、次回の参加時期を決めやすかったです。',           now() - interval '4 days'),
  ('渡辺 隆',     'watanabe.t@example.com',    2, '問い合わせへの返信がもう少し早いと助かります。',                              now() - interval '3 days'),
  ('中村 誠',     'nakamura@example.com',      5, '家族で参加しました。子どもも野菜の収穫を楽しめて良い経験になりました。',         now() - interval '2 days'),
  ('小林 由美',   null,                        4, '有機農業への取り組みについて、もっと詳しく知りたいです。',                     now() - interval '1 days'),
  ('加藤 誠',     'kato.makoto@example.com',   5, '長雨で稲が倒れて困っていましたが、資格を持つボランティアの方に本当に助けられました。', now());
