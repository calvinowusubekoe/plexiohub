# PlexioHub Website — Design

**Date:** 2026-10-23
**Owner:** PlexioHub (founder, solo developer)
**Status:** Draft for approval

## 1. Intent and why

PlexioHub is a new Ghana-based digital solutions business with no website yet. It offers:

- Website Design & Development
- WhatsApp Chatbots & AI Automation
- Business Process Automation
- E-commerce Solutions
- IT & Tech Support
- Graphic Design (logos, flyers, social media graphics, branding), added 2026-10-23

Tagline: **"We Build. You Grow."** PlexioHub serves small and growing businesses in Ghana and worldwide.

The website must turn a visiting business owner into a **qualified quote request**. Visitors should quickly understand what PlexioHub does, who it's for and why it matters. Then they request a quote, which collects their project requirements so the founder can reply with a real answer. A visitor should never have to search for contact details.

The site is also PlexioHub's own proof of skill. It is a web agency's website, so its quality *is* the sales pitch.

## 2. Goals

1. A clear hero explaining what PlexioHub does, who it serves and why it matters, with a prominent **Get a Quote** button and a secondary **View Our Work** link.
2. A step-by-step **project brief / quote form** that collects requirements (service, goals, features, budget, deadline, contact details).
3. Every quote request **reaches the founder** by email, by WhatsApp alert, and in a private **admin page**.
4. An admin page where the founder manages quote requests and portfolio projects without editing code.
5. Contact through WhatsApp, email and phone is visible from every page.
6. Good mobile experience and SEO foundations, so the site ranks for searches like "website design Ghana" or "WhatsApp chatbot Ghana".

## 3. Non-goals (not in this version)

- Online payments or invoicing.
- A client portal where customers log in to track their projects.
- A blog or content management beyond portfolio projects and FAQ.
- Multiple admin users or roles (one admin: the founder).
- Multi-language support (English only).
- Live chat or an AI chatbot on the site itself. WhatsApp is the chat channel.

## 4. Anti-goals (would count as failure even if it "works")

- Looking like a generic template agency site. It must feel like a real local partner.
- A quote request getting lost: saved but no notification, or a notification with no saved record.
- Contact details that are hard to find, or a quote form so long that people on phones give up.
- A site Google can't read (empty HTML from a client-only app).
- Fake claims: invented clients, testimonials, statistics or awards. Concept work is labelled as concept.
- Slow on mid-range Android phones over mobile data.

## 5. Audience and context

- Primary visitors: business owners and managers (shops, restaurants, service businesses, SMEs) in Ghana, plus some international clients.
- Most visits are on **phones**, often arriving from WhatsApp links, Instagram/Facebook or Google.
- Many visitors aren't technical. Copy uses plain language and focuses on business outcomes ("get more customers", "save time"), not tech jargon.

## 6. Brand and visual direction (decided)

- **Style:** "C: light, friendly, people-first." Light background (#F5F7FB / white), approachable, feels like a local partner rather than a cold tech company.
- **Colors** (from the logo): deep navy `#0F1E4A` (text, dark sections), royal blue `#2563EB` (primary buttons, accents), light greys. WhatsApp green `#25D366` only for WhatsApp buttons.
- **Logo:** the PlexioHub wordmark with blue dots. The founder will provide the logo file, ideally an SVG or a transparent PNG.
- **Imagery:** real photos of African/Ghanaian business owners using phones or laptops. Use free stock photos (e.g. Unsplash/Pexels) to start, replaceable later.
- **Tone:** warm, direct, confident, speaking to "you" the business owner.
- Reference mockups: `.superpowers/brainstorm/*/content/hero.html` (option C) and `homepage.html`.

## 7. Site structure

### 7.1 Global (every page)
- **Header:** logo; nav (Services, Work, How We Work, FAQ, Contact); WhatsApp number (click-to-chat); **Get a Quote** button. On mobile it collapses to a menu, but the Get a Quote button stays visible.
- **Floating WhatsApp button** (bottom-right) on every public page. It opens `wa.me/<number>` with a pre-filled message. On service pages the message names that service.
- **Footer:** tagline, short description, contact details (WhatsApp, phone, email), service links, "Based in Ghana 🇬🇭 · Serving businesses worldwide 🌍", social links, copyright.

### 7.2 Homepage (in this order)
1. **Hero:** headline + sub-headline covering what, who and why; **Get a Quote** (primary) and **View Our Work** (secondary, scrolls to or links to Work); location line; photo.
   Draft copy: "Grow your business without the tech headache" / "PlexioHub builds websites, online shops, WhatsApp chatbots and automation for small and growing businesses — at prices that make sense."
2. **Problems we solve:** four cards written to business owners, each pairing the problem with PlexioHub's fix:
   - Customers cannot find your business online.
   - You handle too many tasks manually.
   - Your current website looks outdated.
   - Your business needs reliable technical support.
3. **Services:** six cards, each with an icon, a short benefit-focused description and **Learn more →** linking to that service's page.
4. **How we work (process timeline):** Talk → Quote → Design → Build → Launch → Support, one short line each.
5. **Our work (portfolio):** filterable grid (All · Websites · WhatsApp & AI · Automation · E-commerce · Graphic Design · IT Support). Each card has a screenshot, title, a "Concept" or "Client" label, what it does and the problem it solves, linking to a project detail page. Shows the most recent 6, with "See all work" linking to the `/work` page.
6. **Why choose PlexioHub:** affordable solutions, personalized service, practical technical expertise, transparent communication, ongoing support.
7. **FAQ:** accordion. Starter questions: How much does a website cost? How long does it take? How do payments work? Do you offer support after launch? Do you work with businesses outside Ghana? Can you update my existing website? The content is editable in admin.
8. **Contact and conversion:** WhatsApp, email and phone listed beside a short "Start your project" entry into the quote brief.

### 7.3 Service pages: `/services/<slug>`
One page per service (6 total). Each has: headline, who it's for, what's included, benefits, typical use cases or examples, related portfolio projects (by tag), related FAQ items if any, and a **Get a Quote for this service** button. That button opens the brief with the service pre-selected. Service page content lives in code/config (not admin-editable in v1).

### 7.4 Work: `/work` and `/work/<slug>`
- `/work`: all published projects with the same filters as the homepage.
- `/work/<slug>`: project detail with title, client/concept label, service tags, the problem, what was built, key features, screenshots, live link (if any), and a CTA to get a quote.
- First project: **Palette Pleasers** (https://palette-pleasers.netlify.app), labelled **Concept**: a restaurant website with menu, testimonials and contact. Note for the founder: fix that site's placeholder footer ("Your Restaurant", dummy phone/address) and its hidden-until-scroll sections before featuring it.

### 7.5 Quote brief: `/quote` (optionally `?service=<slug>`)
A step-by-step form with a progress indicator, designed for phones:

1. **Service:** choose one or more of the six services, or "Not sure yet".
2. **Your project:** goals (free text: "What do you want this to achieve?"), features needed (checkboxes that depend on the service), and service-specific questions, for example:
   - Website: new or redesign? existing website URL? number of pages (rough)?
   - WhatsApp chatbot: roughly how many customer messages per day? what should the bot handle (FAQs, orders, bookings)?
   - Automation: which task is taking too much time today?
   - E-commerce: roughly how many products? payment methods wanted (Mobile Money, card)?
   - IT support: one-off issue or ongoing support?
   - Graphic design: what's needed (logo, flyer/poster, social media posts, full branding pack)? Do you already have brand colors or a logo?
3. **Budget and timing:** budget range and deadline/timeline (ASAP, within 1 month, 1–3 months, flexible).
   - PlexioHub's projects range from **GHS 200** (small graphic design jobs) **to GHS 20,000** (larger builds). These are the founder's figures.
   - GHS budget options: Under GHS 500 · GHS 500–1,000 · GHS 1,000–3,000 · GHS 3,000–7,000 · GHS 7,000–12,000 · GHS 12,000–20,000 · Above GHS 20,000 · Not sure yet.
   - USD option for international clients: Under $50 · $50–100 · $100–300 · $300–700 · $700–1,200 · $1,200–2,000 · Above $2,000 · Not sure yet.
   - Ranges live in one config file so they're easy to change. They are not admin-editable in v1.
4. **Your details:** name, business name, WhatsApp number, email, preferred contact method (WhatsApp / email / call), country.

Behaviour:
- Required: service, name, and at least one of WhatsApp number or email.
- Validation on each step, with clear error messages.
- Basic spam protection: a honeypot field plus rate limiting on the server.
- Confirmation screen: "Thanks, we'll get back to you within 24 hours" with a WhatsApp button for anything urgent.
- If saving fails, the user sees an error and the WhatsApp fallback. The request must not silently disappear.

### 7.6 Admin: `/admin` (private)
- Login: email + password (single admin account) or magic link. No public sign-up.
- **Quote requests:** list (newest first) with status filter. Statuses: **New → Contacted → Quoted → Won / Lost**. Detail view shows all brief answers, internal notes, status change, and quick actions: **Reply on WhatsApp** (opens `wa.me` with the client's number) and **Email** (`mailto:`).
- **Portfolio projects:** create, edit, publish/unpublish and delete. Fields: title, slug, Concept/Client label, service tags, short description, problem, what was built, features, live URL, cover image + gallery images (upload), display order.
- **FAQ:** add, edit, reorder and delete questions and answers.
- New-request count badge.

## 8. Notifications (when a quote is submitted)

In this order, server-side:
1. **Save** the request to the database. This is the source of truth.
2. **Email** to the founder with a summary and a link to the admin detail page.
3. **WhatsApp alert** to the founder's own number through **CallMeBot** (free; a one-time activation by messaging their bot). Short message, e.g. "New quote: Ama Mensah, Website Design, GHS 3,000–5,000. Open admin: <link>".

**If step 1 fails** (e.g. the database is down), the server still emails the founder the **full brief** and still sends the WhatsApp alert, marked "NOT SAVED — copy from email". The visitor sees the error screen with the WhatsApp fallback. So a request is only lost if save, email *and* WhatsApp all fail.

**Supabase free-tier pause:** free Supabase projects pause after about a week of inactivity. A scheduled Netlify function runs once a day and makes a small database query to keep it active. If that query fails, the founder gets an email.

Steps 2 and 3 are best-effort. A failure in either must not lose the saved request or show the visitor an error. Failures get logged. The founder accepts CallMeBot's lower reliability to keep v1 free. It can be swapped later for Twilio or the Meta WhatsApp Cloud API behind the same notification function.

Optional (builder's call): a confirmation email to the client if they gave an email address.

## 9. Technology (decided)

- **Framework:** **React via Next.js** (founder chose React; Next.js chosen for SEO, because pages render to real HTML). TypeScript.
- **Hosting:** **Netlify** (founder already uses it; free tier).
- **Database, auth and image storage:** **Supabase** (free tier). Tables for quote requests, projects and FAQs. Supabase Auth for the admin login. Supabase Storage for portfolio images. Row-level security so only the authenticated admin can read requests or write content; the public can only insert quote requests (through the server) and read published projects and FAQs.
- **Email:** **Resend** (free tier) or similar transactional email service.
- **WhatsApp alerts:** **CallMeBot** (free).
- **Secrets** (Supabase service key, Resend key, CallMeBot key, admin phone/email) in Netlify environment variables, never in the browser.
- **Styling:** builder's choice (Tailwind CSS is fine) as long as it matches section 6.

## 10. SEO foundations

- Server-rendered or statically generated public pages (home, services, work, project details, FAQ content).
- A unique title and meta description per page; Open Graph/social share images (logo-based by default, project cover for project pages).
- Structured data: `LocalBusiness`/`ProfessionalService` (name, Ghana location, contact, services) and `FAQPage` for the FAQ.
- `sitemap.xml` and `robots.txt` (admin excluded/noindex).
- Semantic headings, image alt text, readable URLs (`/services/whatsapp-chatbots`).
- Copy naturally uses search phrases such as "website design in Ghana", "WhatsApp chatbot for business", "e-commerce website Ghana".

## 10a. Privacy

- A simple **Privacy Policy** page (`/privacy`), linked in the footer and from the form's last step. It says what's collected (contact and project details), why (to reply to quote requests), who processes it (Supabase, Resend, CallMeBot), how long it's kept, and how to ask for deletion (email). Builder drafts it in plain language; the founder reviews and owns it. It isn't legal advice, so the founder may want it checked.
- The final step of the quote brief includes a consent line with a link: "By sending this, you agree we may contact you about your project. See our Privacy Policy."

## 11. Quality bars

- Mobile-first and fully responsive. Tested on a small Android-size screen (360px wide) up to desktop.
- Fast: optimized images, minimal JavaScript on public pages, Lighthouse performance/SEO/accessibility scores of 90+ on the homepage (mobile).
- Accessible: sufficient color contrast, keyboard navigable, labelled form fields, visible focus states.
- Analytics: builder's choice of a free, privacy-friendly option (or Netlify/Vercel-style analytics). It should at least count quote submissions and WhatsApp-button clicks.

## 12. Content the founder must supply (placeholders until then)

- Logo files (SVG/PNG).
- WhatsApp business number, phone number, email address (domain email preferred, e.g. hello@plexiohub.com).
- Domain name (e.g. plexiohub.com); the site launches on a Netlify subdomain until then.
- Social media links.
- Final pricing language for FAQ (ranges or "from GHS X").
- Optional: a founder photo/bio for an "about" touch in Why PlexioHub.

The builder writes all draft copy (hero, problems, services, process, why-us, FAQ) in the tone from section 6. The founder reviews it.

## 13. Left to the builder

- Exact component structure, styling library, animation (subtle only; nothing that hides content until scroll in a way that breaks screenshots or crawlers).
- Database schema details, within the fields listed.
- Exact service-specific form questions, beyond the examples.
- Icon set and stock photos.
- Whether `/quote` is a page or a modal (it must work as a direct link, and as a pre-selected link from service pages).

## 14. Decisions made by Claude (founder can override)

- Next.js instead of plain React (Vite), for SEO.
- Netlify + Supabase + Resend + CallMeBot as the stack, all on free tiers.
- Quote statuses New / Contacted / Quoted / Won / Lost.
- Process steps Talk → Quote → Design → Build → Launch → Support.
- Budget brackets in GHS and USD (section 7.5), based on the founder's GHS 200–20,000 range. The USD brackets are approximate and rounded, not live exchange rates.
- FAQ and portfolio editable in admin; service page content kept in code for v1.
- Palette Pleasers shown as a "Concept" project.
- Daily keep-alive job for Supabase's free tier, rather than paying for a database plan.
- If saving a quote fails, the full brief is still emailed and WhatsApp-alerted to the founder.
- A plain-language privacy page and consent line, drafted by the builder and owned by the founder.
