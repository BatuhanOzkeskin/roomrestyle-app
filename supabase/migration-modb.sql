-- ============================================================================
-- RoomRestyle — Mod B ("mobilyanı odana koy") migration
-- Run this ONCE in Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses "if not exists"). No data is lost.
-- ============================================================================

-- mode: 'restyle' (Mod A, mevcut) | 'place' (Mod B, yeni)
alter table public.projects
  add column if not exists mode text not null default 'restyle';

-- ref_path: Mod B'de kullanıcının yüklediği mobilya fotoğrafının storage yolu
alter table public.projects
  add column if not exists ref_path text;

-- buy_url: opsiyonel "Satın Al" linki
alter table public.projects
  add column if not exists buy_url text;

-- Not: mobilya görselleri aynı 'rooms' bucket'ında <user_id>/refs/... altında
-- saklanır; ilk klasör segmenti user_id olduğu için mevcut RLS politikaları
-- bunları da otomatik korur — ek storage politikası GEREKMEZ.
