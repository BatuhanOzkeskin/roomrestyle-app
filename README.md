# RoomRestyle — AI Interior Redesign

Reimagine any room in a new style from a single photo — **while keeping the
room's real architecture** — and then turn the result into an actionable
**shopping & budget list**. Built for the "Visual Experience" AI Product Challenge.

**Live demo:** _(add your Vercel URL here after deploy)_

---

## What problem it solves
People want to see how their space could look before spending money on
renovation or furniture. Existing tools produce pretty but **unbelievable**
images (they warp walls/windows) and give you **no way to act** on the result.
RoomRestyle focuses on the two gaps:

1. **Believability** — it preserves the room's architecture and only changes the
   decor, so it still looks like *your* room.
2. **Actionability** — every design comes with a "make this room real" list of
   the key items with estimated prices (TRY).

## How it works
1. Sign in (Supabase Auth).
2. Upload a photo of your room and pick a style.
3. The server sends the photo + a "structure-lock" prompt to Google's
   **Gemini 2.5 Flash Image (Nano Banana)** model.
4. The original and the result are stored privately (Supabase Storage), a
   project row is recorded, and you see a **before/after** comparison.
5. Optionally generate the **shopping/budget list** for the design.
6. All your designs live under **My Projects**, visible only to you.

## Tech stack
- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS**
- **Supabase** — Auth, Postgres, Storage, **Row Level Security** (per-user data isolation)
- **Google Gemini 2.5 Flash Image (Nano Banana)** — image editing
- **Vercel** — hosting

## Environment variables
See [`.env.example`](./.env.example). Copy it to `.env.local` and fill in:

| Variable | Where to get it | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | no |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **yes** (optional) |
| `GEMINI_API_KEY` | Google AI Studio → Get API key | **yes** |
| `NEXT_PUBLIC_SITE_URL` | your app URL | no |

> Secrets are read on the server only and are **never** committed. `.env*` is gitignored.

## Run locally
```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```
Before first run, open Supabase → SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql)
to create the table, RLS policies, and the private `rooms` storage bucket.

## Deploy (Vercel)
1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the environment variables above in Vercel → Project → Settings → Environment Variables.
4. Deploy. Add your live URL to the top of this README and to `NEXT_PUBLIC_SITE_URL`.

## Security notes
- API routes require an authenticated user.
- Uploads are validated (type + 10MB limit); per-user rate limiting protects the API quota.
- RLS ensures a user can only ever read/write their own rows and files.
- The Gemini API key is used server-side only.

## Known limitations
- Free-tier image generation has daily limits; heavy use may hit them.
- The model occasionally needs a retry (rare artifacts).
- Price estimates in the shopping list are rough AI approximations, not live prices.
- Outputs carry Google's invisible SynthID watermark (AI-generated content).

## AI usage
Built with AI assistance. See [`AI_USAGE_LOG.md`](./AI_USAGE_LOG.md) for the
research / architecture / implementation / debugging transcripts.
