# PlexioHub website

Marketing site for PlexioHub (**We Build. You Grow.**). It has public pages, a step-by-step quote request form, and a private admin page for managing quote requests, portfolio projects and FAQs.

- Design: [docs/superpowers/specs/2026-10-23-plexiohub-website-design.md](docs/superpowers/specs/2026-10-23-plexiohub-website-design.md)
- Build plan: [docs/superpowers/plans/2026-10-23-plexiohub-website.md](docs/superpowers/plans/2026-10-23-plexiohub-website.md)

**Stack:** Next.js 15 (React, App Router) · TypeScript · Tailwind CSS · Supabase (database, admin login, image storage) · Resend (email alerts) · CallMeBot (WhatsApp alerts) · Netlify (hosting + daily keep-alive job).

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
npm test                     # unit/component tests
```

The site runs without any accounts configured. Portfolio shows "coming soon", FAQs come from `src/config/content.ts`, and quote submissions return "may not have reached us" with the WhatsApp fallback. Fill in the env vars to make everything live.

## Environment variables

| Variable | Where it's used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | links in alerts, sitemap, SEO | e.g. `https://plexiohub.com` (no trailing slash) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp buttons | international digits, e.g. `233241234567` |
| `NEXT_PUBLIC_PHONE` | header/footer | shown as written, e.g. `+233 24 123 4567` |
| `NEXT_PUBLIC_EMAIL` | footer/contact/privacy | e.g. `hello@plexiohub.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | database | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | database (public reads, admin login) | same page, "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | saving quotes, keep-alive | **secret**: same page, "service_role" key |
| `RESEND_API_KEY` | email alerts | **secret**: resend.com → API Keys |
| `RESEND_FROM` | email sender | `PlexioHub <quotes@yourdomain>` once your domain is verified in Resend; until then `PlexioHub <onboarding@resend.dev>` |
| `ADMIN_EMAIL` | where alerts go | your email address |
| `CALLMEBOT_PHONE` | WhatsApp alerts | your WhatsApp number, international digits |
| `CALLMEBOT_API_KEY` | WhatsApp alerts | **secret**: see CallMeBot setup below |
| `RATE_LIMIT_SALT` | spam protection | any long random string |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | analytics (optional) | from cloud.umami.is (free) |

Never put the **secret** values in a variable starting with `NEXT_PUBLIC_`.

## One-time setup

### 1. Supabase (free)
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in the whole of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it. This creates the tables, security rules and image storage, and adds Palette Pleasers and the starter FAQs.
3. Go to **Authentication → Sign In / Providers**, turn **off** "Allow new users to sign up". This matters: the security rules treat any signed-in user as the admin.
4. Go to **Authentication → Users → Add user**. Create your admin login (email + password) and tick "Auto confirm".
5. Copy the URL, anon key and service_role key into your env vars.

The free tier pauses a project after about a week with no activity. The daily `keep-alive` Netlify function prevents that, and emails you if the database ever can't be reached.

### 2. Resend (free email)
1. Sign up at [resend.com](https://resend.com) and create an API key.
2. To send from your own domain (e.g. `quotes@plexiohub.com`), add the domain in Resend and set the DNS records it shows you. Until then, emails come from `onboarding@resend.dev` and can only go to the address you signed up with.

### 3. CallMeBot (free WhatsApp alerts)
1. Save **+34 644 51 95 23** in your phone's contacts (check [callmebot.com](https://www.callmebot.com/blog/free-api-whatsapp-messages/) for the current number).
2. From your WhatsApp, send it: `I allow callmebot to send me messages`
3. It replies with your API key. Put it in `CALLMEBOT_API_KEY`, and your number in `CALLMEBOT_PHONE`.

CallMeBot is free but not guaranteed. Email is the dependable backup, and every request is always in the admin page. To upgrade later, swap `src/lib/notify/whatsapp.ts` for Twilio or the Meta WhatsApp Cloud API.

## Deploy to Netlify
1. Push this repo to GitHub, then in Netlify choose **Add new site → Import an existing project**.
2. The build settings come from `netlify.toml` (`npm run build`, Next.js runtime is detected automatically).
3. Add every env var above under **Site configuration → Environment variables**.
4. Deploy. Then add your custom domain under **Domain management**, and update `NEXT_PUBLIC_SITE_URL` to match.

### Launch checklist
- [ ] Submit a real quote on the live site: a row appears in admin, plus an email and a WhatsApp alert.
- [ ] `/admin` while logged out redirects to the login page; logging in works; changing a status and saving notes persist.
- [ ] Add a project with an image in admin; it appears on the homepage and `/work`.
- [ ] Lighthouse (mobile) on the homepage: Performance, SEO and Accessibility each 90+.
- [ ] On a phone (or 360px wide): no sideways scrolling on `/`, `/quote`, a service page and `/work`.
- [ ] In Netlify → Functions → `keep-alive`, run it once and confirm it succeeds.
- [ ] Submit the sitemap (`/sitemap.xml`) in Google Search Console.

## Content you'll want to replace
- **Logo:** `src/components/layout/Logo.tsx` is a text wordmark. Swap in your SVG/PNG logo.
- **Hero photo:** `public/images/hero.jpg` is a free Unsplash photo by [@mkumbwajr](https://unsplash.com/@mkumbwajr) ([source](https://unsplash.com/photos/H1KbBGUs4bM)). The shop signs show Tanzanian shilling prices, so a photo taken in Ghana would fit better.
- **Social links:** placeholders in `src/config/site.ts`.
- **Copy:** services, problems, process and "why us" text live in `src/config/services.ts` and `src/config/content.ts`. Budget ranges are in `src/config/budget.ts`.
- **Palette Pleasers:** before featuring it, fix that site's placeholder footer ("Your Restaurant", dummy phone/address) and the sections that only appear after scrolling.
- **Privacy policy:** `src/app/(site)/privacy/page.tsx` is a plain-language draft. Review it, and consider having it checked.
