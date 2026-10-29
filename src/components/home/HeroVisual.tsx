import { CheckCheck, CircleCheck, Lock } from 'lucide-react';

type Message = { from: 'client' | 'plexiohub'; text: string; time: string };

const MESSAGES: Message[] = [
  { from: 'client', text: 'Hi, I need a website for my salon. Can you help?', time: '9:41' },
  { from: 'plexiohub', text: 'Yes! Do you also want customers to book appointments online?', time: '9:41' },
  { from: 'client', text: 'Yes please', time: '9:42' },
  { from: 'plexiohub', text: "Great. Here's a 2-minute form so we can send your quote today.", time: '9:42' },
];

const AUTOMATION_STEPS = ['Saved to your dashboard', 'Email alert sent', 'Follow-up scheduled'];

/** Browser being built, PlexioHub's WhatsApp assistant, and an automation run: the three things PlexioHub makes. */
export function HeroVisual() {
  return (
    <figure
      className="@container relative mx-auto aspect-square w-full max-w-xl sm:aspect-[10/9] lg:max-w-none"
      role="img"
      aria-label="Illustration: a website being designed in a browser, PlexioHub's WhatsApp assistant replying to a salon owner who wants a website, and an automation that saves the quote request and sends alerts."
    >
      <div aria-hidden>
        {/* Browser: a website taking shape */}
        <div className="absolute left-0 top-0 w-[86%] overflow-hidden rounded-xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(15,30,74,0.35)]">
          <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </span>
            <span className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-ink-muted ring-1 ring-line">
              <Lock className="h-3 w-3" />
              glowsalon.com
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-navy">Glow Salon</span>
              <span className="flex gap-3">
                <span className="h-1.5 w-8 rounded-full bg-line" />
                <span className="h-1.5 w-8 rounded-full bg-line" />
                <span className="h-1.5 w-8 rounded-full bg-line" />
              </span>
            </div>
            <div className="mt-6 grid grid-cols-[1.2fr_1fr] gap-5">
              <div>
                <p className="text-[clamp(0.8rem,4.6cqw,1.4rem)] font-extrabold leading-tight text-navy">Look your best this weekend</p>
                <span className="mt-2 block h-1.5 w-11/12 rounded-full bg-line" />
                <span className="mt-1.5 block h-1.5 w-3/4 rounded-full bg-line" />
                <span className="mt-4 inline-block rounded-md bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">Book now</span>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {['Hair', 'Nails', 'Makeup'].map((s) => (
                <div key={s} className="rounded-lg border border-line p-2.5">
                  <span className="block h-8 rounded bg-surface" />
                  <span className="mt-2 block text-[11px] font-semibold text-navy">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation: what happens after someone asks for a quote */}
        <div className="absolute bottom-[2%] left-[3%] hidden w-[43%] rounded-xl border border-line bg-white p-4 shadow-[0_24px_50px_-24px_rgba(15,30,74,0.4)] sm:block">
          <p className="text-[13px] font-semibold text-navy">New quote request</p>
          <p className="text-[11px] text-ink-muted">Glow Salon, website + booking</p>
          <ul className="mt-3 space-y-2">
            {AUTOMATION_STEPS.map((s) => (
              <li key={s} className="flex items-center gap-2 text-[12px] text-navy">
                <CircleCheck className="h-4 w-4 shrink-0 text-green-600" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Phone: PlexioHub's own WhatsApp assistant */}
        <div className="absolute bottom-0 right-0 w-[48%] max-w-[16.5rem] rounded-[1.75rem] bg-navy p-1.5 shadow-[0_30px_60px_-20px_rgba(15,30,74,0.55)]">
          <div className="overflow-hidden rounded-[1.4rem] bg-[#EFEAE2]">
            <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-navy">PH</span>
              <div className="leading-tight">
                <p className="text-[12px] font-semibold">PlexioHub</p>
                <p className="text-[10px] text-white/75">online</p>
              </div>
            </div>
            <div className="space-y-1.5 px-2 py-3">
              {MESSAGES.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[88%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug text-[#111B21] shadow-sm ${
                      m.from === 'client' ? 'rounded-tr-none bg-[#D9FDD3]' : 'rounded-tl-none bg-white'
                    }`}
                  >
                    {m.text}
                    <span className="ml-1.5 inline-flex translate-y-0.5 items-center gap-0.5 whitespace-nowrap text-[9px] text-[#667781]">
                      {m.time}
                      {m.from === 'client' && <CheckCheck className="h-3 w-3 text-[#53BDEB]" />}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
