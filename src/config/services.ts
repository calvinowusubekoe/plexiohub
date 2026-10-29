import type { IconName } from '@/components/ui/Icon';

export type ServiceSlug =
  | 'website-design'
  | 'whatsapp-chatbots'
  | 'business-automation'
  | 'ecommerce'
  | 'it-support'
  | 'graphic-design';

export type ServiceQuestion = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkboxes';
  options?: string[];
};

export type Service = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  filterLabel: string;
  icon: IconName;
  summary: string;
  headline: string;
  forWho: string;
  included: string[];
  benefits: string[];
  useCases: string[];
  /** Options shown as "features needed" checkboxes in the quote brief. */
  features: string[];
  questions: ServiceQuestion[];
};

export const SERVICES: Service[] = [
  {
    slug: 'website-design',
    name: 'Website Design & Development',
    shortName: 'Website Design',
    filterLabel: 'Websites',
    icon: 'website',
    summary: 'Modern, mobile-friendly websites that help customers find you, trust you and contact you.',
    headline: 'A website that brings you customers, not just visitors',
    forWho:
      'Businesses with no website yet, or with a site that looks outdated, loads slowly or does not work well on phones.',
    included: [
      'Custom design that matches your brand',
      'Mobile-first pages that load fast on any phone',
      'Contact, WhatsApp and enquiry forms built in',
      'Basic Google (SEO) setup so people can find you',
      'Training so you can update simple content yourself',
    ],
    benefits: [
      'Look professional and trustworthy online',
      'Get found on Google by people already looking for what you sell',
      'Turn visitors into calls, WhatsApp chats and orders',
    ],
    useCases: [
      'A company profile site for a service business',
      'A menu and booking site for a restaurant',
      'A redesign of an old site that no longer reflects your business',
    ],
    features: ['Contact / enquiry form', 'WhatsApp button', 'Online booking', 'Blog or news', 'Photo gallery', 'Google Maps location'],
    questions: [
      { id: 'website_type', label: 'Is this a new website or a redesign?', type: 'select', options: ['New website', 'Redesign of an existing site'] },
      { id: 'existing_url', label: 'Existing website address (if any)', type: 'text' },
      { id: 'page_count', label: 'Roughly how many pages?', type: 'select', options: ['1 (single page)', '2–5', '6–10', 'More than 10', 'Not sure'] },
    ],
  },
  {
    slug: 'whatsapp-chatbots',
    name: 'WhatsApp Chatbots & AI Automation',
    shortName: 'WhatsApp Chatbots',
    filterLabel: 'WhatsApp & AI',
    icon: 'chatbot',
    summary: 'A WhatsApp assistant that answers customers instantly, takes orders and books appointments, day and night.',
    headline: 'Answer every customer on WhatsApp, even while you sleep',
    forWho:
      'Businesses that get many repeated questions on WhatsApp: prices, opening hours, delivery, orders and bookings.',
    included: [
      'A WhatsApp chatbot set up on your business number',
      'Answers to your most common customer questions',
      'Order taking, bookings or lead capture flows',
      'Hand-over to a real person when needed',
      'Optional AI replies trained on your business information',
    ],
    benefits: [
      'Reply to customers in seconds, 24/7',
      'Stop typing the same answers again and again',
      'Never miss a sale because a message went unanswered',
    ],
    useCases: [
      'A shop bot that shares prices and takes orders',
      'A salon bot that books appointments',
      'A support bot that answers FAQs and escalates complaints',
    ],
    features: ['Answer FAQs', 'Take orders', 'Book appointments', 'Collect customer details', 'Hand over to a staff member', 'AI-powered replies'],
    questions: [
      { id: 'messages_per_day', label: 'Roughly how many customer messages do you get a day?', type: 'select', options: ['Under 20', '20–100', '100–500', 'More than 500'] },
      { id: 'bot_tasks', label: 'What should the bot handle?', type: 'checkboxes', options: ['FAQs', 'Orders', 'Bookings', 'Payments follow-up', 'Something else'] },
    ],
  },
  {
    slug: 'business-automation',
    name: 'Business Process Automation',
    shortName: 'Automation',
    filterLabel: 'Automation',
    icon: 'automation',
    summary: 'Let software handle the repetitive work: records, reminders, reports and follow-ups.',
    headline: 'Spend less time on admin and more time growing',
    forWho:
      'Businesses still copying data between spreadsheets, sending reminders by hand or chasing the same paperwork every week.',
    included: [
      'A review of the tasks eating up your time',
      'Automated workflows connecting the tools you already use',
      'Automatic reminders, reports and notifications',
      'Simple dashboards to see what is happening',
    ],
    benefits: [
      'Save hours every week',
      'Fewer mistakes from manual data entry',
      'Faster follow-ups with customers and staff',
    ],
    useCases: [
      'New orders automatically logged and the team notified',
      'Daily sales summaries sent to your phone',
      'Invoice and payment reminders sent automatically',
    ],
    features: ['Automatic reminders', 'Reports and summaries', 'Connect apps together', 'Data entry automation', 'Staff notifications'],
    questions: [
      { id: 'pain_task', label: 'Which task is taking too much time today?', type: 'textarea' },
      { id: 'current_tools', label: 'Which tools do you use now (e.g. Excel, Google Sheets, WhatsApp)?', type: 'text' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce Solutions',
    shortName: 'E-commerce',
    filterLabel: 'E-commerce',
    icon: 'ecommerce',
    summary: 'Online shops that make it easy to browse, order and pay, including Mobile Money.',
    headline: 'Sell online, day and night',
    forWho: 'Businesses selling products on Instagram, WhatsApp or in-store that want a proper online shop.',
    included: [
      'A product catalogue with photos, prices and categories',
      'Cart and checkout with Mobile Money and card payments',
      'Order notifications for you and your customers',
      'Simple stock and order management',
    ],
    benefits: [
      'Take orders even when your shop is closed',
      'Reach customers beyond your area',
      'Spend less time answering "is this available?"',
    ],
    useCases: [
      'A fashion boutique moving from Instagram to its own shop',
      'A grocery or pharmacy with delivery orders',
      'A crafts business selling to customers abroad',
    ],
    features: ['Mobile Money payments', 'Card payments', 'Delivery options', 'Stock management', 'Discount codes', 'Order tracking'],
    questions: [
      { id: 'product_count', label: 'Roughly how many products?', type: 'select', options: ['Under 20', '20–100', '100–500', 'More than 500'] },
      { id: 'payment_methods', label: 'Which payment methods do you want?', type: 'checkboxes', options: ['Mobile Money', 'Card', 'Cash on delivery', 'Bank transfer'] },
    ],
  },
  {
    slug: 'it-support',
    name: 'IT & Tech Support',
    shortName: 'IT Support',
    filterLabel: 'IT Support',
    icon: 'support',
    summary: 'Reliable help with computers, networks, email and software, so your business keeps running.',
    headline: 'Tech problems sorted, so you can get back to business',
    forWho: 'Businesses without an in-house IT person who need dependable help when technology lets them down.',
    included: [
      'Computer, printer and network setup and repair',
      'Business email and domain setup',
      'Software installation and updates',
      'Data backup and basic security',
      'Remote or on-site support',
    ],
    benefits: [
      'Less downtime when something breaks',
      'Safer data and systems',
      'One trusted contact for all your tech questions',
    ],
    useCases: [
      'Setting up email and Wi-Fi for a new office',
      'Fixing slow or broken computers',
      'Monthly support plan for a small team',
    ],
    features: ['Computer / laptop repair', 'Network & Wi-Fi', 'Business email setup', 'Backups & security', 'Software setup'],
    questions: [
      { id: 'support_type', label: 'Is this a one-off issue or ongoing support?', type: 'select', options: ['One-off issue', 'Ongoing support', 'Not sure'] },
      { id: 'issue', label: 'Briefly describe the issue or what you need', type: 'textarea' },
    ],
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    shortName: 'Graphic Design',
    filterLabel: 'Graphic Design',
    icon: 'design',
    summary: 'Logos, flyers, social media graphics and branding that make your business look professional.',
    headline: 'Designs that make people stop and look',
    forWho: 'Businesses that need a logo, a fresh brand look, or eye-catching flyers and social media posts.',
    included: [
      'Logo design with several concepts to choose from',
      'Flyers, posters and banners for print or WhatsApp',
      'Social media post and story designs',
      'Brand packs: colours, fonts and logo files',
    ],
    benefits: [
      'Look established and trustworthy',
      'Stand out on social media and in print',
      'Consistent branding everywhere you appear',
    ],
    useCases: [
      'A logo and brand pack for a new business',
      'A flyer for a promotion or event',
      'A month of social media post designs',
    ],
    features: ['Logo', 'Flyer / poster', 'Social media posts', 'Business cards', 'Full branding pack'],
    questions: [
      { id: 'design_needed', label: "What's needed?", type: 'checkboxes', options: ['Logo', 'Flyer / poster', 'Social media posts', 'Full branding pack'] },
      { id: 'has_brand', label: 'Do you already have brand colours or a logo?', type: 'select', options: ['Yes', 'No', 'Partly'] },
    ],
  },
];

const SLUGS = new Set<string>(SERVICES.map((s) => s.slug));

export function isServiceSlug(s: string): s is ServiceSlug {
  return SLUGS.has(s);
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
