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
  { id: 'about', label: 'About', href: '#about' },
  { id: 'commodities', label: 'Commodities', href: '#commodities' },
  { id: 'approach', label: 'Our Approach', href: '#approach' },
  { id: 'divisions', label: 'Divisions', href: '#divisions' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Commodities',
    links: [
      { label: 'Ultra-Low-Sulphur Diesel', href: '#commodities' },
      { label: 'Jet A-1 Aviation Fuel', href: '#commodities' },
      { label: 'Crude Oil Streams', href: '#commodities' },
      { label: 'Sulphur & Granular Urea', href: '#commodities' },
      { label: 'Refined Cane Sugar', href: '#commodities' },
      { label: 'Vegetable Edible Oils', href: '#commodities' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Consigliere', href: '#about' },
      { label: 'Our Commercial Approach', href: '#approach' },
      { label: 'Group Divisions', href: '#divisions' },
      { label: 'Commercial Enquiries', href: '#contact' }
    ]
  },
  {
    title: 'Divisions',
    links: [
      { label: 'Consigliere Commodities', href: '#commodities' },
      { label: 'Consigliere Technologies', href: '#divisions', isModalTrigger: true }
    ]
  }
];
