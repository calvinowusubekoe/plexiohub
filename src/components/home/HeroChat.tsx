import { CheckCheck } from 'lucide-react';

type Message = { from: 'customer' | 'business'; text: string; time: string };

const MESSAGES: Message[] = [
  { from: 'customer', text: 'Hello, do you deliver to Kumasi?', time: '9:41' },
  { from: 'business', text: 'Yes! Delivery to Kumasi is GHS 30 and takes 1–2 days. Would you like to order?', time: '9:41' },
  { from: 'customer', text: 'Yes please. 2 bags of rice.', time: '9:42' },
  { from: 'business', text: 'Done. Order #2041 is confirmed. You can pay with Mobile Money on delivery.', time: '9:42' },
];

/** An example of what a PlexioHub WhatsApp assistant does, shown over the hero photo. */
export function HeroChat({ className = '' }: { className?: string }) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(15,30,74,0.35)] ring-1 ring-navy/10 ${className}`}
      aria-label="Example: a WhatsApp assistant answers a customer's delivery question and confirms their order in under a minute."
      role="img"
    >
      <div aria-hidden>
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">AS</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Ama&apos;s Store</p>
            <p className="text-[11px] text-white/75">Automated replies by PlexioHub</p>
          </div>
        </div>
        <div className="space-y-2 bg-[#EFEAE2] px-3 py-4">
          {MESSAGES.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'customer' ? 'justify-start' : 'justify-end'}`}>
              <p
                className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-snug text-[#111B21] shadow-sm ${
                  m.from === 'customer' ? 'rounded-tl-none bg-white' : 'rounded-tr-none bg-[#D9FDD3]'
                }`}
              >
                {m.text}
                <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 whitespace-nowrap text-[10px] text-[#667781]">
                  {m.time}
                  {m.from === 'business' && <CheckCheck className="h-3.5 w-3.5 text-[#53BDEB]" />}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
