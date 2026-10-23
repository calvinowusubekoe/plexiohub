# PlexioHub Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PlexioHub's marketing website: public pages, a step-by-step quote brief that reaches the founder (database + email + WhatsApp), and a private admin page for managing quote requests, portfolio projects and FAQs.

**Architecture:** One Next.js (App Router) app, deployed to Netlify. Public pages are server-rendered and revalidated, so Google sees real HTML. Supabase holds the data (quote requests, projects, FAQs), admin auth and image storage. The quote submission is a single server route that saves first and then notifies by email (Resend) and WhatsApp (CallMeBot). It degrades gracefully when either side fails. Static content (services, budget ranges, process, copy) lives in typed config files.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · Zod · Supabase (`@supabase/supabase-js`, `@supabase/ssr`) · Resend · CallMeBot · Netlify (+ scheduled functions) · Vitest + React Testing Library · Umami Cloud (free) analytics.

**Spec:** `docs/superpowers/specs/2026-10-23-plexiohub-website-design.md` (read it before starting any task).

## Global Constraints

- Node 20+. TypeScript `strict: true`. Package manager: npm.
- Colors: navy `#0F1E4A`, royal blue `#2563EB`, light bg `#F5F7FB`, white. WhatsApp green `#25D366` only on WhatsApp buttons. Define these as Tailwind theme tokens `navy`, `brand`, `surface`, `whatsapp`.
- Visual style: "C: light, friendly, people-first". Reference mockups: `.superpowers/brainstorm/967-1792712949/content/hero.html` (option C) and `homepage.html`.
- Tagline is exactly "We Build. You Grow." Location line is exactly "Based in Ghana 🇬🇭 · Serving businesses worldwide 🌍".
- Six services, in this order: Website Design & Development · WhatsApp Chatbots & AI Automation · Business Process Automation · E-commerce Solutions · IT & Tech Support · Graphic Design.
- No invented clients, testimonials, statistics or awards. Concept work is labelled "Concept".
- No animation may hide content until scroll (the content must be in the HTML and visible without JS).
- Secrets live only in server env vars and are never imported into client components: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CALLMEBOT_API_KEY`, `CALLMEBOT_PHONE`, `ADMIN_EMAIL`, `RATE_LIMIT_SALT`.
- Public env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (optional).
- Mobile-first: every page must work at 360px wide with no horizontal scroll.
- Admin routes (`/admin/**`) are `noindex` and excluded from the sitemap.

## Review Focus

1. **Database down or paused when a quote is submitted.** The founder still gets the full brief by email and WhatsApp, marked "NOT SAVED". The visitor sees an error with the WhatsApp fallback, not a fake success. (Test: Task 5, `submit.test.ts › db failure still notifies with NOT SAVED`.)
2. **Email or WhatsApp provider failing or not configured.** The request is still saved and the visitor sees success. The failure is logged. (Test: Task 5, `submit.test.ts › notification failure does not fail the request`.)
3. **Phone numbers typed in Ghanaian local formats** (`024 123 4567`, `+233 24…`, `0024…`). The admin "Reply on WhatsApp" link and the floating button produce a valid `wa.me/233…` link. (Test: Task 1, `whatsapp.test.ts`.)
4. **Visitor text containing HTML or `<script>`** in goals, name or notes. It's escaped in the notification email and rendered as text in admin. (Test: Task 4, `format.test.ts › escapes HTML`.)
5. **Bots and double-clicks:** a filled honeypot gets a silent fake success with no save and no notification; more than 5 submissions per IP per hour get 429; the submit button is disabled while sending. (Tests: Task 5 `submit.test.ts › honeypot`, `› rate limit`; Task 9 `QuoteWizard.test.tsx › disables submit while sending`.)

---

## File Structure

```
plexiohub/
  .env.example                      all env vars listed in Global Constraints
  netlify.toml                      build cmd, Next runtime, functions dir
  netlify/functions/keep-alive.mts  daily Supabase ping (Task 13)
  supabase/migrations/0001_init.sql tables, RLS, storage bucket (Task 3)
  src/
    config/
      site.ts        name, tagline, contact details, socials, siteUrl
      services.ts    6 services: slug, names, copy, per-service quote questions
      budget.ts      BUDGET_RANGES, TIMELINES, PREFERRED_CONTACT
      content.ts     problems, process steps, why-us items, hero copy
    lib/
      whatsapp.ts    normalizePhone, waLink
      analytics.ts   track(event)
      supabase/      server.ts, browser.ts, service.ts (service role), middleware.ts
      data/          projects.ts, faqs.ts, quotes.ts (typed queries)
      quote/         schema.ts, format.ts, submit.ts
      notify/        email.ts, whatsapp.ts
      seo/           jsonld.ts, metadata.ts
    components/
      layout/        Header.tsx, Footer.tsx, WhatsAppFab.tsx
      home/          Hero, Problems, ServicesGrid, Process, WorkPreview, WhyUs, Faq, ContactCta
      work/          PortfolioGrid.tsx (client, filters), ProjectCard.tsx
      quote/         QuoteWizard.tsx (client) + step components
      admin/         StatusBadge, RequestTable, ProjectForm, FaqEditor
    app/
      (site)/layout.tsx, page.tsx, services/[slug]/page.tsx, work/page.tsx,
      work/[slug]/page.tsx, quote/page.tsx, privacy/page.tsx
      api/quote/route.ts
      admin/login/page.tsx
      admin/(protected)/layout.tsx, page.tsx (requests), requests/[id]/page.tsx,
      projects/page.tsx, projects/[id]/page.tsx, faqs/page.tsx, actions.ts
      sitemap.ts, robots.ts, layout.tsx (root), globals.css
    middleware.ts                    session refresh + /admin guard
  tests/ (colocated *.test.ts(x) next to source is fine; vitest picks up src/**)
```

Shared types (defined in the task named, used everywhere after):

```ts
// src/config/services.ts (Task 2)
export type ServiceSlug = 'website-design' | 'whatsapp-chatbots' | 'business-automation'
  | 'ecommerce' | 'it-support' | 'graphic-design';
export type ServiceQuestion = { id: string; label: string; type: 'text' | 'textarea' | 'select' | 'checkboxes'; options?: string[] };
export type Service = { slug: ServiceSlug; name: string; shortName: string; filterLabel: string; icon: string;
  summary: string; headline: string; forWho: string; included: string[]; benefits: string[]; useCases: string[];
  features: string[]; questions: ServiceQuestion[] };

// src/lib/quote/schema.ts (Task 4)
export type QuoteSubmission = z.infer<typeof quoteSchema>;
// src/lib/data/quotes.ts (Task 3)
export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
// src/lib/data/projects.ts (Task 3)
export type Project = { id: string; slug: string; title: string; kind: 'concept' | 'client'; serviceTags: ServiceSlug[];
  summary: string; problem: string; built: string; features: string[]; liveUrl: string | null;
  coverImageUrl: string | null; galleryUrls: string[]; sortOrder: number; published: boolean; createdAt: string };
// src/lib/data/faqs.ts (Task 3)
export type Faq = { id: string; question: string; answer: string; sortOrder: number };
```

---

### Task 1: Project scaffold, brand tokens, site config, WhatsApp helpers

**Files:**
- Create: Next.js app at repo root (`npx create-next-app@15 . --ts --tailwind --app --src-dir --eslint --import-alias "@/*"`), `vitest.config.ts`, `vitest.setup.ts`, `.env.example`, `.gitignore` (add `.env*.local`, `.superpowers/`, `.playwright-mcp/`), `src/config/site.ts`, `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `site` object `{ name: 'PlexioHub', tagline: 'We Build. You Grow.', locationLine, url, whatsappNumber, phone, email, socials: {label,url}[] }` (values from env, with placeholder defaults); `normalizePhone(input: string): string | null`; `waLink(number: string, message?: string): string | null`.

- [ ] **Step 1:** `git init`, scaffold the Next app, install `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`. Add `"test": "vitest run"` to package.json. Add Tailwind tokens `navy #0F1E4A`, `brand #2563EB`, `surface #F5F7FB`, `whatsapp #25D366`. Load the Inter font through `next/font`.
- [ ] **Step 2: Write the failing test** `whatsapp.test.ts`:

```ts
expect(normalizePhone('024 123 4567')).toBe('233241234567');
expect(normalizePhone('+233 24 123 4567')).toBe('233241234567');
expect(normalizePhone('00233241234567')).toBe('233241234567');
expect(normalizePhone('+44 7700 900123')).toBe('447700900123');
expect(normalizePhone('')).toBeNull();
expect(normalizePhone('call me')).toBeNull();
expect(waLink('024 123 4567', "Hi PlexioHub, I'm interested in Graphic Design"))
  .toBe('https://wa.me/233241234567?text=Hi%20PlexioHub%2C%20I\'m%20interested%20in%20Graphic%20Design');
expect(waLink('024 123 4567')).toBe('https://wa.me/233241234567');
expect(waLink('nope')).toBeNull();
```

- [ ] **Step 3:** Run `npm test -- whatsapp`. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement in `src/lib/whatsapp.ts`. Rule: keep digits only; drop a leading `00`; a 10-digit number starting with `0` becomes `233` + the last 9 digits; fewer than 8 digits returns `null`. Use `encodeURIComponent` for `text`.
- [ ] **Step 5:** Run `npm test`. Expected: PASS. Also run `npm run build`. Expected: success.
- [ ] **Step 6:** Commit `chore: scaffold Next.js app with brand tokens and WhatsApp helpers`.

### Task 2: Content config (services, budget, process, copy)

**Files:**
- Create: `src/config/services.ts`, `src/config/budget.ts`, `src/config/content.ts`
- Test: `src/config/config.test.ts`

**Interfaces:**
- Produces: `SERVICES: Service[]`, `getService(slug: string): Service | undefined`, `isServiceSlug(s: string): s is ServiceSlug`; `BUDGET_RANGES: Record<'GHS'|'USD', string[]>`, `TIMELINES: string[]`, `PREFERRED_CONTACT = ['whatsapp','email','call'] as const`; `content` with `hero`, `problems` (4 × {icon,title,fix}), `process` (6 × {title,line}), `whyUs` (5 × {icon,title,line}), `seedFaqs` ({question,answer}[]).

- [ ] **Step 1: Write the failing test** `config.test.ts`:

```ts
expect(SERVICES.map(s => s.slug)).toEqual(['website-design','whatsapp-chatbots','business-automation','ecommerce','it-support','graphic-design']);
expect(SERVICES.map(s => s.name)).toEqual(['Website Design & Development','WhatsApp Chatbots & AI Automation',
  'Business Process Automation','E-commerce Solutions','IT & Tech Support','Graphic Design']);
SERVICES.forEach(s => { expect(s.questions.length).toBeGreaterThan(0); expect(s.features.length).toBeGreaterThan(0); });
expect(BUDGET_RANGES.GHS).toEqual(['Under GHS 500','GHS 500–1,000','GHS 1,000–3,000','GHS 3,000–7,000',
  'GHS 7,000–12,000','GHS 12,000–20,000','Above GHS 20,000','Not sure yet']);
expect(BUDGET_RANGES.USD).toEqual(['Under $50','$50–100','$100–300','$300–700','$700–1,200','$1,200–2,000','Above $2,000','Not sure yet']);
expect(TIMELINES).toEqual(['ASAP','Within 1 month','1–3 months','Flexible']);
expect(content.process.map(p => p.title)).toEqual(['Talk','Quote','Design','Build','Launch','Support']);
expect(content.problems.map(p => p.title)).toEqual(['Customers cannot find your business online.',
  'You handle too many tasks manually.','Your current website looks outdated.','Your business needs reliable technical support.']);
expect(content.whyUs.map(w => w.title)).toEqual(['Affordable solutions','Personalized service',
  'Practical technical expertise','Transparent communication','Ongoing support']);
expect(content.hero.headline).toBe('Grow your business without the tech headache');
expect(isServiceSlug('ecommerce')).toBe(true); expect(isServiceSlug('hacking')).toBe(false);
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Write the config. Use the service-specific questions from spec §7.5 verbatim as the minimum per service. Write the remaining copy (summaries, page content, problem fixes, process lines, FAQ answers) in the spec §6 tone. Hero subheadline is exactly: "PlexioHub builds websites, online shops, WhatsApp chatbots and automation for small and growing businesses — at prices that make sense." The seed FAQs are the six starter questions in spec §7.2 item 7. Pricing answers say projects range from GHS 200 to GHS 20,000 depending on scope.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add services, budget and site copy config`.

### Task 3: Supabase schema, clients and data access

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `src/lib/supabase/{server,browser,service,middleware}.ts`, `src/lib/data/{projects,faqs,quotes}.ts`
- Test: `src/lib/data/mappers.test.ts`

**Interfaces:**
- Consumes: `ServiceSlug`, `content.seedFaqs` (Task 2).
- Produces: `createServerClient()` (cookie-bound, anon key), `createBrowserClient()`, `createServiceClient()` (service role, server-only; file starts with `import 'server-only'`).
  - projects: `getPublishedProjects(): Promise<Project[]>`, `getProjectBySlug(slug): Promise<Project | null>`, `getAllProjects()`, `upsertProject(input)`, `deleteProject(id)`, `mapProjectRow(row): Project`
  - faqs: `getFaqs(): Promise<Faq[]>`, `saveFaq`, `deleteFaq`, `reorderFaqs(ids: string[])`
  - quotes: `insertQuote(q: QuoteSubmission, ipHash: string): Promise<{id: string}>`, `countRecentQuotes(ipHash: string, sinceIso: string): Promise<number>`, `listQuotes(status?: QuoteStatus)`, `getQuote(id)`, `updateQuote(id, {status?, notes?})`, `countNewQuotes()`, `QuoteRow` type

Schema (`0001_init.sql`):
- `quote_requests`: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `status text not null default 'new' check (status in ('new','contacted','quoted','won','lost'))`, `services text[] not null`, `goals text`, `features text[]`, `service_answers jsonb default '{}'`, `budget_currency text`, `budget_range text`, `timeline text`, `name text not null`, `business_name text`, `whatsapp text`, `email text`, `preferred_contact text`, `country text`, `notes text`, `ip_hash text`. Index on `(ip_hash, created_at)`.
- `projects`: columns matching `Project` (snake_case), `slug text unique not null`, `kind text check (kind in ('concept','client'))`, `published boolean default false`, `sort_order int default 0`.
- `faqs`: `id`, `question`, `answer`, `sort_order`.
- RLS on all three. `anon`: `select` on `projects where published` and on `faqs`; nothing on `quote_requests` (inserts go through the service role only). `authenticated`: full access to all three. Storage bucket `project-images`: public read; write for `authenticated`.
- Seed: Palette Pleasers (`kind 'concept'`, tags `{website-design}`, `live_url 'https://palette-pleasers.netlify.app'`, published) and the seed FAQs.
- Document in `README.md`: in the Supabase dashboard, **disable sign-ups** and create the single admin user manually. Because sign-ups are off, `authenticated` means the admin.

- [ ] **Step 1: Write the failing test.** `mapProjectRow` converts snake_case to the `Project` type (`service_tags → serviceTags`, nulls → `[]` for arrays); `mapProjectRow` drops unknown tags not in `SERVICES`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement the migration, clients (`@supabase/ssr` patterns) and data functions. Each query function throws on a Supabase `error`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Apply the migration to the Supabase project (`supabase db push`, or paste into the SQL editor). Verify with a quick script or the dashboard: the anon key can read the published project and cannot read `quote_requests`.
- [ ] **Step 5:** Commit `feat: add Supabase schema, RLS and data access`.

### Task 4: Quote schema, validation and notification formatting

**Files:**
- Create: `src/lib/quote/schema.ts`, `src/lib/quote/format.ts`
- Test: `src/lib/quote/schema.test.ts`, `src/lib/quote/format.test.ts`

**Interfaces:**
- Consumes: `SERVICES`, `BUDGET_RANGES`, `TIMELINES`, `PREFERRED_CONTACT`.
- Produces:
  - `quoteSchema` (Zod) with fields: `services: (ServiceSlug|'not-sure')[]` (min 1), `goals: string` (max 2000), `features: string[]`, `serviceAnswers: Record<string,string>`, `budgetCurrency: 'GHS'|'USD'`, `budgetRange` (must be one of `BUDGET_RANGES[budgetCurrency]`), `timeline` (one of `TIMELINES`), `name` (1–100, required), `businessName?`, `whatsapp?`, `email?` (valid email if present), `preferredContact`, `country` (default 'Ghana'), `consent: literal(true)`, `company_website?: string` (honeypot). Refinement: at least one of `whatsapp` / `email`, with error message "Please give a WhatsApp number or an email so we can reply."
  - `STEP_FIELDS: Record<1|2|3|4, (keyof QuoteSubmission)[]>` and `validateStep(step, data): Record<string,string>` (field → message; empty object = valid)
  - `formatQuote(q, opts: {id?: string; saved: boolean; adminUrl: string}): { subject: string; html: string; text: string; whatsapp: string }`

- [ ] **Step 1: Write failing tests.**

```ts
// schema.test.ts
expect(quoteSchema.safeParse({...valid, whatsapp: undefined, email: undefined}).success).toBe(false);
expect(quoteSchema.safeParse({...valid, budgetCurrency:'USD', budgetRange:'GHS 500–1,000'}).success).toBe(false);
expect(quoteSchema.safeParse({...valid, consent: false}).success).toBe(false);
expect(quoteSchema.safeParse({...valid, services: ['hacking']}).success).toBe(false);
expect(validateStep(1, {services: []})).toHaveProperty('services');
expect(validateStep(4, {...valid, email:'', whatsapp:''})).toHaveProperty('whatsapp');
// format.test.ts
const out = formatQuote({...valid, name:'Ama Mensah', services:['website-design'], budgetCurrency:'GHS', budgetRange:'GHS 3,000–7,000'}, {id:'abc', saved:true, adminUrl:'https://x/admin/requests/abc'});
expect(out.whatsapp).toBe('New quote: Ama Mensah, Website Design & Development, GHS 3,000–7,000. Open admin: https://x/admin/requests/abc');
expect(out.subject).toBe('New quote request: Ama Mensah (Website Design & Development)');
// test: 'escapes HTML'
expect(formatQuote({...valid, goals:'<script>alert(1)</script>'}, o).html).not.toContain('<script>');
// test: 'NOT SAVED marking'
const ns = formatQuote(valid, {saved:false, adminUrl:'https://x/admin'});
expect(ns.subject.startsWith('NOT SAVED — ')).toBe(true);
expect(ns.whatsapp.startsWith('NOT SAVED — copy from email. ')).toBe(true);
expect(ns.text).toContain(valid.goals); // full brief in the email
```

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. The email lists every answer, including service-specific answers labelled with the question text from `SERVICES`. It shows `Reply on WhatsApp` (built with `waLink`) and `mailto:` links. All visitor text goes through an `escapeHtml` helper. Multiple services are joined with `, `; `not-sure` displays as "Not sure yet".
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add quote schema and notification formatting`.

### Task 5: Quote submission service, notifiers and API route

**Files:**
- Create: `src/lib/notify/email.ts`, `src/lib/notify/whatsapp.ts`, `src/lib/quote/submit.ts`, `src/app/api/quote/route.ts`
- Test: `src/lib/quote/submit.test.ts`

**Interfaces:**
- Consumes: `quoteSchema`, `formatQuote`, `insertQuote`, `countRecentQuotes`.
- Produces:
  - `sendEmail(msg: {subject: string; html: string; text: string}): Promise<void>`: Resend; `to` = `ADMIN_EMAIL`; `from` = `PlexioHub <quotes@<verified domain>>` (until a domain is verified, use Resend's `onboarding@resend.dev`). Throws if not configured.
  - `sendWhatsApp(text: string): Promise<void>`: `GET https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(text)}&apikey=${CALLMEBOT_API_KEY}`; throws on a non-2xx status or when not configured. Truncate `text` to 900 characters.
  - `type SubmitDeps = { save: typeof insertQuote; countRecent: typeof countRecentQuotes; sendEmail; sendWhatsApp; log: (msg: string, err?: unknown) => void; now: () => Date; adminUrl: string }`
  - `type SubmitResult = {status:'saved'; id: string} | {status:'not_saved'} | {status:'rate_limited'} | {status:'invalid'; errors: Record<string,string>} | {status:'spam'}`
  - `submitQuote(raw: unknown, ipHash: string, deps: SubmitDeps): Promise<SubmitResult>`
  - `POST /api/quote` maps results to: saved → 200 `{ok:true}`; spam → 200 `{ok:true}`; invalid → 400 `{ok:false, errors}`; rate_limited → 429 `{ok:false, reason:'rate_limited'}`; not_saved → 503 `{ok:false, reason:'not_saved'}`. `ipHash` = SHA-256 of (`x-nf-client-connection-ip` ?? `x-forwarded-for` first entry ?? `'unknown'`) + `RATE_LIMIT_SALT`.

Order inside `submitQuote`: honeypot → validate → rate limit (5 per IP in the last 60 minutes; if `countRecent` throws, allow) → save → notify both with `Promise.allSettled` (pass `saved:false` and no id if the save threw) → result.

- [ ] **Step 1: Write failing tests** using fake deps (vi.fn):
  - `saves then notifies`: `save` is called once, `sendEmail` and `sendWhatsApp` each once, and the result is `{status:'saved', id:'q1'}`.
  - `honeypot`: `company_website: 'x'` → `{status:'spam'}`; `save`, `sendEmail` and `sendWhatsApp` are not called.
  - `invalid`: missing name → `{status:'invalid'}` with an `errors.name` key; nothing saved.
  - `rate limit`: `countRecent` resolves to 5 → `{status:'rate_limited'}`; `countRecent` is called with an ISO time 60 minutes before `now()`.
  - `rate-limit check failing allows`: `countRecent` rejects → still saves.
  - `db failure still notifies with NOT SAVED`: `save` rejects → `{status:'not_saved'}`; `sendEmail` is called with a subject starting `NOT SAVED — `; `sendWhatsApp` is called with text starting `NOT SAVED — copy from email.`; `log` is called.
  - `notification failure does not fail the request`: both senders reject → `{status:'saved'}` and `log` is called twice.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement `submit.ts`, the two notifiers and the route (it builds the real deps; `log` = `console.error`).
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Then run `npm run dev` with real keys in `.env.local` and `curl -X POST localhost:3000/api/quote -H 'content-type: application/json' -d @sample-quote.json`. Expected: 200, a row in Supabase, an email and a WhatsApp message arrive.
- [ ] **Step 5:** Commit `feat: quote submission with save-first notifications and spam protection`.

### Task 6: Site shell (header, footer, floating WhatsApp, privacy page, analytics)

**Files:**
- Create: `src/app/(site)/layout.tsx`, `src/components/layout/{Header,Footer,WhatsAppFab}.tsx`, `src/app/(site)/privacy/page.tsx`, `src/lib/analytics.ts`
- Modify: `src/app/layout.tsx` (fonts, Umami `<Script>` when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set)
- Test: `src/components/layout/layout.test.tsx`

**Interfaces:**
- Consumes: `site`, `SERVICES`, `waLink`.
- Produces: `track(event: 'quote_submitted' | 'whatsapp_click' | 'quote_started', data?: Record<string,string>): void` (calls `window.umami?.track`; no-op otherwise); `<WhatsAppFab message?: string />` (service pages pass a service-specific message).

- [ ] **Step 1: Write failing tests:** Header renders a link named "Get a Quote" with `href="/quote"` and a WhatsApp link whose href starts `https://wa.me/`; nav contains Services, Work, How We Work, FAQ, Contact. Footer contains "We Build. You Grow.", the exact location line, a link to `/privacy`, and links to all 6 service pages. WhatsAppFab with `message="Hi PlexioHub, I'm interested in Graphic Design"` has an href containing `text=Hi%20PlexioHub`; clicking it calls `track('whatsapp_click')`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. On mobile, the menu collapses to a button, but **Get a Quote stays visible** in the header bar. The privacy page follows spec §10a: what's collected, why, processors (Supabase, Resend, CallMeBot), retention (say "up to 2 years, or deleted sooner on request"), deletion by email to `site.email`, and a dated "Last updated" line.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Then run `npm run dev`, check at 360px and at desktop width, and confirm there is no horizontal scroll.
- [ ] **Step 5:** Commit `feat: site shell with header, footer, WhatsApp button and privacy page`.

### Task 7: Homepage sections and portfolio filter

**Files:**
- Create: `src/components/home/*.tsx` (Hero, Problems, ServicesGrid, Process, WorkPreview, WhyUs, Faq, ContactCta), `src/components/work/{PortfolioGrid,ProjectCard}.tsx`, `src/app/(site)/page.tsx`
- Test: `src/components/work/PortfolioGrid.test.tsx`, `src/components/home/home.test.tsx`

**Interfaces:**
- Consumes: `content`, `SERVICES`, `getPublishedProjects`, `getFaqs`.
- Produces: `<PortfolioGrid projects: Project[]; limit?: number />`. Filters: "All" plus one button per `SERVICES[i].filterLabel` (Websites · WhatsApp & AI · Automation · E-commerce · IT Support · Graphic Design). Only the 'All' filter and tags present in `projects` are enabled. `<ProjectCard project />` shows a "Concept" or "Client" badge.

- [ ] **Step 1: Write failing tests:** PortfolioGrid with 3 projects (tags website-design, ecommerce, graphic-design) shows 3 cards; clicking "E-commerce" shows 1; "All" restores 3; `limit={2}` shows 2 cards and a "See all work" link to `/work`; with 0 projects it shows "New projects coming soon" rather than an empty grid. Home: sections appear in the order Hero, Problems, Services, How we work, Our work, Why PlexioHub, FAQ, Contact (assert heading order); hero has a "Get a Quote" link to `/quote` and "View Our Work" linking to `#work`; the services grid has 6 "Learn more" links to `/services/<slug>`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement to match the style C mockup. Sections get ids `services`, `how-we-work`, `work`, `faq`, `contact` (nav anchors). The page uses `export const revalidate = 300`. The FAQ is a native `<details>` accordion, so it works without JS. The hero photo comes from `next/image` (a free stock image of a Ghanaian/African business owner, saved locally in `public/images/`, with credit noted in README).
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Run `npm run build`. Expected: success.
- [ ] **Step 5:** Commit `feat: homepage sections and filterable portfolio`.

### Task 8: Service pages and work pages

**Files:**
- Create: `src/app/(site)/services/[slug]/page.tsx`, `src/app/(site)/work/page.tsx`, `src/app/(site)/work/[slug]/page.tsx`
- Test: `src/app/(site)/services/service-page.test.tsx`

**Interfaces:**
- Consumes: `getService`, `SERVICES`, `getPublishedProjects`, `getProjectBySlug`, `PortfolioGrid`, `WhatsAppFab`.
- Produces: `generateStaticParams` for all 6 services; unknown slugs → `notFound()`.

- [ ] **Step 1: Write failing tests:** the service page for `graphic-design` renders the h1 headline, the included/benefits lists, and a "Get a Quote for this service" link with `href="/quote?service=graphic-design"`. Its WhatsAppFab message contains "Graphic Design". Related projects show only projects tagged with that slug. The page for an unknown slug calls `notFound`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement per spec §7.3 and §7.4. The project detail page shows the label, tags, problem, what was built, features, a gallery (`next/image`), a live link (`rel="noopener"`, new tab), and a quote CTA. Work pages use `revalidate = 300`.
- [ ] **Step 4:** Run `npm test` and `npm run build`. Expected: PASS and build success, with 6 service pages prerendered.
- [ ] **Step 5:** Commit `feat: service and portfolio pages`.

### Task 9: Quote wizard (`/quote`)

**Files:**
- Create: `src/app/(site)/quote/page.tsx`, `src/components/quote/QuoteWizard.tsx`, `src/components/quote/steps/{ServiceStep,ProjectStep,BudgetStep,DetailsStep}.tsx`
- Test: `src/components/quote/QuoteWizard.test.tsx`

**Interfaces:**
- Consumes: `SERVICES`, `isServiceSlug`, `BUDGET_RANGES`, `TIMELINES`, `validateStep`, `STEP_FIELDS`, `track`, `waLink`, `POST /api/quote` contract (Task 5).
- Produces: `<QuoteWizard initialServices?: ServiceSlug[] />`. The page reads `searchParams.service` (comma-separated allowed), keeps only valid slugs, and passes them in.

- [ ] **Step 1: Write failing tests** (mock `fetch`):
  - `?service=graphic-design` → Graphic Design is pre-checked on step 1.
  - `?service=hacking,ecommerce` → only E-commerce pre-checked, no crash.
  - Pressing Next on step 1 with nothing selected shows the services error and stays on step 1.
  - Step 2 shows the questions of every selected service (select Website + WhatsApp → both question groups visible).
  - Switching currency to USD swaps the budget options to the USD list and clears the selected range.
  - Step 4 without WhatsApp or email shows "Please give a WhatsApp number or an email so we can reply."
  - The consent line links to `/privacy`, and the checkbox is required.
  - `disables submit while sending`: after the click, the button is disabled and reads "Sending…" until fetch resolves; fetch is called once even when clicked twice.
  - 200 → thank-you screen ("Thanks, we'll get back to you within 24 hours") with a WhatsApp button; `track('quote_submitted')` is called.
  - 503 or network error → error screen that says the request may not have been received and offers a WhatsApp button whose prefilled text includes the visitor's name and services. Form data is kept, so "Try again" resubmits.
  - 429 → message "You've sent several requests recently. Please contact us on WhatsApp." with the WhatsApp button.
  - The honeypot input `company_website` is rendered visually hidden, with `tabIndex={-1}` and `autoComplete="off"`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Progress indicator "Step N of 4". Save the draft to `sessionStorage` (wrapped in try/catch) so a refresh doesn't lose answers. Clear it on success. Call `track('quote_started')` on the first Next. Large tap targets (≥44px). The page has `metadata.title` "Get a Quote | PlexioHub".
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Then do a manual end-to-end run in `npm run dev` at 360px: submit a real brief and confirm the row, email and WhatsApp alert arrive.
- [ ] **Step 5:** Commit `feat: step-by-step quote brief`.

### Task 10: Admin login and quote request management

**Files:**
- Create: `src/middleware.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/(protected)/layout.tsx`, `src/app/admin/(protected)/page.tsx`, `src/app/admin/(protected)/requests/[id]/page.tsx`, `src/app/admin/(protected)/actions.ts`, `src/components/admin/{StatusBadge,RequestTable}.tsx`
- Test: `src/app/admin/admin-requests.test.tsx`, `src/app/admin/actions.test.ts`

**Interfaces:**
- Consumes: `createServerClient`, `listQuotes`, `getQuote`, `updateQuote`, `countNewQuotes`, `waLink`, `SERVICES`.
- Produces: server actions `updateQuoteStatus(id: string, status: QuoteStatus)`, `saveQuoteNotes(id: string, notes: string)`, `signOut()`. Each starts with `requireAdmin()` (`supabase.auth.getUser()`; redirect to `/admin/login` if no user) and calls `revalidatePath('/admin')`.

- [ ] **Step 1: Write failing tests:** RequestTable lists rows newest first with name, services, budget, a status badge and a relative date; the status filter tabs All/New/Contacted/Quoted/Won/Lost filter rows. The detail view renders `goals` containing `<b>x</b>` as literal text. "Reply on WhatsApp" href = `waLink(row.whatsapp, 'Hi <name>, this is PlexioHub about your project request.')`, and the button is hidden when the number is invalid. `updateQuoteStatus` rejects a status outside the five values and redirects when there is no user (mock the client).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. The middleware refreshes the Supabase session and redirects `/admin/*` (except `/admin/login`) to login when there is no user. Login uses email + password (`signInWithPassword`). The admin layout shows nav (Requests · Projects · FAQs · Sign out) and a badge with `countNewQuotes()`. Every admin page exports `metadata.robots = { index: false }`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Manual check: logged out, `/admin` → login; after login, change a status and add a note, then reload and both persist.
- [ ] **Step 5:** Commit `feat: admin login and quote request management`.

### Task 11: Admin portfolio and FAQ editing

**Files:**
- Create: `src/app/admin/(protected)/projects/page.tsx`, `src/app/admin/(protected)/projects/[id]/page.tsx` (`id = 'new'` for create), `src/app/admin/(protected)/faqs/page.tsx`, `src/components/admin/{ProjectForm,FaqEditor}.tsx`
- Modify: `src/app/admin/(protected)/actions.ts`
- Test: `src/components/admin/ProjectForm.test.tsx`, `src/app/admin/content-actions.test.ts`

**Interfaces:**
- Consumes: `upsertProject`, `deleteProject`, `getAllProjects`, `saveFaq`, `deleteFaq`, `reorderFaqs`, `SERVICES`.
- Produces: actions `saveProject(form: FormData)`, `removeProject(id)`, `saveFaqAction(form)`, `removeFaq(id)`, `moveFaq(id, dir: 'up'|'down')`. Every content action calls `revalidatePath('/')`, `revalidatePath('/work')`, `revalidatePath('/work/[slug]', 'page')` and `revalidatePath('/services/[slug]', 'page')`.

- [ ] **Step 1: Write failing tests:** ProjectForm auto-fills the slug from the title (`'Palette Pleasers'` → `'palette-pleasers'`) until the slug is edited by hand; it requires title, summary and at least one service tag; it offers the six services as tag checkboxes. `saveProject` rejects a duplicate slug with the message "That URL name is already used by another project." Content actions call `revalidatePath('/')`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Image upload goes from the browser to the Supabase Storage bucket `project-images` (path `projects/<uuid>.<ext>`). Accept only jpg/png/webp up to 5 MB, and show a clear error otherwise. Deleting asks for confirmation. Publish/unpublish is a toggle. Sort order uses up/down buttons.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Manual check: add a project with an image in admin, and it appears on `/` and `/work` after reload.
- [ ] **Step 5:** Commit `feat: admin editing for portfolio and FAQ`.

### Task 12: SEO foundations

**Files:**
- Create: `src/lib/seo/jsonld.ts`, `src/lib/seo/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.png` (logo-based default)
- Modify: page files to export `generateMetadata`/`metadata` and render JSON-LD.
- Test: `src/lib/seo/seo.test.ts`

**Interfaces:**
- Produces: `organizationJsonLd(): object` (`@type: 'ProfessionalService'`, name, url, telephone, email, `address.addressCountry: 'GH'`, `areaServed: ['GH','Worldwide']`, `hasOfferCatalog` listing the 6 services); `faqPageJsonLd(faqs: Faq[]): object`; `pageMetadata({title, description, path, image?}): Metadata` (canonical URL, OG, Twitter card; title format `"<title> | PlexioHub"`, home is `"PlexioHub — Websites, WhatsApp Chatbots & Automation in Ghana"`).

- [ ] **Step 1: Write failing tests:** `organizationJsonLd().hasOfferCatalog.itemListElement` has 6 entries; `faqPageJsonLd([{question:'Q',answer:'A'}])` produces `mainEntity[0]` `{ '@type':'Question', name:'Q', acceptedAnswer:{ '@type':'Answer', text:'A' } }`. `sitemap()` includes `/`, `/quote`, `/work`, `/privacy`, the 6 service URLs and published project URLs, and contains no `/admin`. `robots()` disallows `/admin` and `/api`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Render the JSON-LD with `<script type="application/ld+json">` on the home page (organization + FAQ) and on service pages (a `Service` entity). Every public page has a unique title and description that naturally use the phrases from spec §10.
- [ ] **Step 4:** Run `npm test` and `npm run build`. Then run `curl -s localhost:3000/ | grep -c "We Build"` against `npm start`. Expected: ≥1 (proves the HTML is server-rendered).
- [ ] **Step 5:** Commit `feat: SEO metadata, structured data, sitemap and robots`.

### Task 13: Keep-alive, deploy and launch checks

**Files:**
- Create: `netlify/functions/keep-alive.mts`, `netlify.toml`, `README.md`
- Test: `netlify/functions/keep-alive.test.ts`

**Interfaces:**
- Consumes: `createServiceClient`, `sendEmail`.
- Produces: a scheduled function (`export const config = { schedule: '@daily' }`) that runs `select id from faqs limit 1`; on error, it calls `sendEmail` with subject `PlexioHub: database keep-alive failed` and the error text.

- [ ] **Step 1: Write failing tests:** with a fake client that succeeds, `sendEmail` is not called; with one that errors, `sendEmail` is called once with that subject.
- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** `netlify.toml`: `build.command = "npm run build"`, `publish = ".next"`, `functions.directory = "netlify/functions"`. Write a README covering: local setup, every env var, Supabase setup (run the migration, disable sign-ups, create the admin user), CallMeBot activation (message their bot from the founder's WhatsApp to get the API key), Resend setup, and how to deploy.
- [ ] **Step 6:** Deploy to Netlify (with founder approval, since it publishes the site). Set the env vars in Netlify. Launch checks on the live URL:
  - submit a real quote → row + email + WhatsApp
  - Lighthouse mobile on `/`: Performance, SEO and Accessibility each ≥ 90
  - 360px: no horizontal scroll on `/`, `/quote`, a service page and `/work`
  - `/admin` while logged out redirects to login
  - `view-source:` of `/` shows the hero text
  - trigger the keep-alive function manually from the Netlify UI; it succeeds
- [ ] **Step 7:** Commit `chore: keep-alive job, Netlify config and README`.

---

## Spec coverage map

§7.1 global → T6 · §7.2 homepage → T7 · §7.3 services → T8 · §7.4 work → T3, T7, T8 · §7.5 quote brief → T4, T5, T9 · §7.6 admin → T10, T11 · §8 notifications, save-failure fallback, keep-alive → T5, T13 · §9 tech → T1, T3 · §10 SEO → T12 · §10a privacy → T6, T9 · §11 quality bars → T6–T9 checks and T13 launch checks · §12 founder content → env vars/placeholders (T1) and README (T13).
