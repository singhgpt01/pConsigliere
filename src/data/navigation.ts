export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; isModalTrigger?: boolean }[];
}

export const mainNavLinks: NavLinkItem[] = [
  { id: 'commodities', label: 'Commodities', href: '#commodities' },
  { id: 'approach', label: 'Our Approach', href: '#approach' },
  { id: 'reach', label: 'International Reach', href: '#reach' },
  { id: 'contact', label: 'Commercial Desk', href: '#contact' }
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Commodities',
    links: [
      { label: 'EN590 10 PPM Ultra-Low-Sulphur Diesel', href: '#featured-commodity' },
      { label: 'Jet A-1 Aviation Fuel', href: '#commodities' },
      { label: 'Crude Oil Streams', href: '#commodities' },
      { label: 'Sulphur (Granular / Formed)', href: '#commodities' },
      { label: 'Urea & Selected Fertilizers', href: '#commodities' },
      { label: 'Refined Cane Sugar (ICUMSA 45)', href: '#commodities' }
    ]
  },
  {
    title: 'Facilitation',
    links: [
      { label: 'Commercial Process', href: '#approach' },
      { label: 'Counterparty Qualification', href: '#approach' },
      { label: 'Global Trade Corridors', href: '#reach' },
      { label: 'Direct Commercial Desk', href: '#contact' }
    ]
  },
  {
    title: 'Direct Channels',
    links: [
      { label: 'Desk: info@consigliereholdings.com', href: 'mailto:info@consigliereholdings.com' },
      { label: 'Direct: gs@consigliereholdings.com', href: 'mailto:gs@consigliereholdings.com' },
      { label: 'Initiate Requirement', href: '#contact' }
    ]
  }
];
