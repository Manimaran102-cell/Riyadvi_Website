export const site = {
  name: 'Riyadvi Software Technologies',
  short: 'Riyadvi',
  tagline: 'A Technology & Digital Solutions Partner',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  // Contact details are taken from Riyadvi's public business listings; confirm before launch.
  phone: '+91 90808 22034',
  phoneHref: 'tel:+919080822034',
  email: 'info@riyadvisoftwaretechnologies.com',
  address: '17, Aarti Arcade, Dr Radha Krishnan Salai, Krishnapuram, Mylapore, Chennai, Tamil Nadu 600004',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919080822034',
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '',
  mapEmbed: process.env.NEXT_PUBLIC_MAP_EMBED_URL ?? '',
  social: {
    linkedin: 'https://www.linkedin.com/company/riyadvi-software-technologies-private-limited',
    facebook: 'https://www.facebook.com/riyadvisoftwaretech',
  },
} as const;

export const whatsappLink = (text = 'Hi Riyadvi, I would like to discuss a project.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
] as const;
