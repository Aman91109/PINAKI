/**
 * Single source of truth for the studio's business facts.
 *
 * These values were previously duplicated across the hero, contact section,
 * pricing block, footer and chatbot — changing a phone number meant editing
 * five files and missing one.
 */

export const CONTACT = {
  email: 'pinaki.sna@gmail.com',
  phone: '+91 9508725672',
  phoneHref: 'tel:+919508725672',
  whatsappHref: 'https://wa.me/919508725672',
  city: 'Sector 62, Noida',
  region: 'New Delhi NCR, India',
  timezone: 'IST (UTC+5:30)',
  responseTime: 'within 4 hours',
} as const;

export const AVAILABILITY = {
  status: 'Available — taking 2 projects for August',
  detail:
    'We deliberately run a small book so every project gets senior attention. If the month is full we will tell you straight away rather than stringing you along.',
} as const;

export const STACK = ['Next.js', 'Node', 'Python', 'PostgreSQL', 'AWS'] as const;

export const STATS = [
  { value: 120, suffix: '+', label: 'Projects shipped' },
  { value: 50, suffix: '+', label: 'Clients served' },
  { value: 5, suffix: '+', label: 'Years building' },
  { value: 98, suffix: '%', label: 'On-time delivery' },
] as const;

export const NAV_ITEMS = [
  { name: 'Work', href: '#work' },
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'Team', href: '#team' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
] as const;

export const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com' },
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'X', href: 'https://twitter.com' },
] as const;
