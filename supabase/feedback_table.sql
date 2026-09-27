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

-- Row Level Security(行レベルセキュリティ)を有効化
alter table public.feedback enable row level security;

-- サイト訪問者(anonキー)からの新規投稿のみ許可
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
