import {
  Bot,
  Clock,
  Globe,
  Handshake,
  Headset,
  Lightbulb,
  MessagesSquare,
  Palette,
  Repeat,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** One consistent line-icon set for the whole site. Config files refer to icons by these names. */
export const ICONS = {
  website: Globe,
  chatbot: Bot,
  automation: Workflow,
  ecommerce: ShoppingBag,
  support: Wrench,
  design: Palette,
  'not-found': SearchX,
  manual: Repeat,
  outdated: Clock,
  helpdesk: Headset,
  affordable: Wallet,
  personal: Handshake,
  expertise: Lightbulb,
  transparent: MessagesSquare,
  ongoing: ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={className} strokeWidth={1.75} aria-hidden />;
}

/** Icon in a soft rounded tile, used on cards. */
export function IconTile({ name, dark = false }: { name: IconName; dark?: boolean }) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
        dark ? 'bg-white/10 text-blue-200 ring-1 ring-white/15' : 'bg-blue-50 text-brand ring-1 ring-blue-100'
      }`}
    >
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}
