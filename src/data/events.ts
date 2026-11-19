export interface TicketCategory {
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  posterImage: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  category: string;
  ticketCategories: TicketCategory[];
  featured: boolean;
}

export const events: Event[] = [
  // NAIROBI EVENTS
  {
    id: '1',
    name: 'Black Coffee',
    slug: 'black-coffee',
    description: 'The legendary Black Coffee returns to Nairobi for an exclusive performance. Prepare for an extraordinary night of house music with one of the world\'s most celebrated DJs.',
    posterImage: '/blackcoffee.jpg',
    date: '2026-12-04',
    time: '20:00',
    venue: 'MUZE Open Air',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 4500, availableQuantity: 500 },
      { name: 'Regular', description: 'Admits 1', price: 6500, availableQuantity: 1000 },
      { name: 'VIP', description: 'Admits 1', price: 12000, availableQuantity: 200 },
      { name: 'VVIP', description: 'Admits 1', price: 20000, availableQuantity: 50 },
    ],
    featured: true,
  },
  {
    id: '2',
    name: 'Keinemusik',
    slug: 'keinemusik',
    description: 'Experience the legendary Keinemusik in Nairobi! An unforgettable night of electronic music featuring world-class DJs and producers. Join us for an immersive musical journey.',
    posterImage: '/keinemusik.png',
    date: '2026-11-21',
    time: '20:00',
    venue: 'Uhuru Gardens',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 6500, availableQuantity: 400 },
      { name: 'Phase 1', description: 'Admits 1', price: 7500, availableQuantity: 500 },
      { name: 'Phase 2', description: 'Admits 1', price: 8500, availableQuantity: 500 },
      { name: 'VIP - Tier 1', description: 'Admits 1', price: 10000, availableQuantity: 150 },
      { name: 'VIP - Tier 2', description: 'Admits 1', price: 12500, availableQuantity: 100 },
      { name: 'VVIP', description: 'Admits 1', price: 15000, availableQuantity: 50 },
    ],
    featured: false,
  },
  {
    id: '3',
    name: 'Descendants',
    slug: 'descendants',
    description: 'Join the descendants for an epic dance party! A night of non-stop music, dancing, and celebration. Perfect for groups and party lovers.',
    posterImage: '/descendants.jpg',
    date: '2026-11-28',
    time: '21:00',
    venue: 'FEIL Warehouse',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 2200, availableQuantity: 500 },
      { name: 'Phase 1', description: 'Admits 1', price: 2700, availableQuantity: 500 },
      { name: 'Phase 2', description: 'Admits 1', price: 3700, availableQuantity: 500 },
      { name: 'Phase 3', description: 'Admits 1', price: 4200, availableQuantity: 500 },
      { name: 'VIP - Tier 1', description: 'Admits 1', price: 5000, availableQuantity: 150 },
      { name: 'VIP - Tier 2', description: 'Admits 1', price: 6500, availableQuantity: 100 },
    ],
    featured: false,
  },
  {
    id: '4',
    name: 'Sondela',
    slug: 'sondela',
    description: 'Sondela presents a magical experience. Relax, dine, and dance at one of Nairobi\'s most beautiful venues with live music and entertainment.',
    posterImage: '/sondela.jpg',
    date: '2026-12-04',
    time: '18:00',
    venue: 'KODA',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 1500, availableQuantity: 400 },
      { name: 'Advance', description: 'Admits 1', price: 2000, availableQuantity: 400 },
      { name: 'Gate', description: 'Admits 1', price: 2500, availableQuantity: 400 },
      { name: 'Squad - Group of 10', description: 'Admits 10', price: 30000, availableQuantity: 50 },
    ],
    featured: false,
  },
  {
    id: '5',
    name: 'Thirteen',
    slug: 'thirteen',
    description: 'An exclusive party experience at Thirteen. Limited tickets available for this premium nightlife event featuring top DJs and celebrity guests.',
    posterImage: '/thirteen.png',
    date: '2026-12-05',
    time: '22:00',
    venue: 'KODA',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 1000, availableQuantity: 300 },
      { name: 'Advance', description: 'Admits 1', price: 1500, availableQuantity: 300 },
      { name: 'Gate', description: 'Admits 1', price: 2000, availableQuantity: 300 },
      { name: 'Season Pass - All 4 Nights', description: 'Admits 1 to all 4 nights', price: 5000, availableQuantity: 100 },
    ],
    featured: false,
  },
  {
    id: '6',
    name: 'AmapianoLand',
    slug: 'amapianoland',
    description: 'The ultimate Amapiano experience in Nairobi! Featuring the biggest Amapiano artists from South Africa and Kenya. Non-stop beats and electric atmosphere.',
    posterImage: '/amapianoland.jpg',
    date: '2026-12-05',
    time: '20:00',
    venue: 'MASSHOUSE',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: '1st Release', description: 'Admits 1', price: 1500, availableQuantity: 1000 },
      { name: 'VIP', description: 'Admits 1', price: 3500, availableQuantity: 200 },
    ],
    featured: false,
  },
  {
    id: '7',
    name: 'SolFest: Safari Oontz',
    slug: 'solfest-safari-oontz',
    description: 'SolFest Safari Oontz comes to Nairobi! A music festival featuring top Kenyan artists and international acts. Music, food, and fun at Uhuru Gardens.',
    posterImage: '/solfest.png',
    date: '2026-12-18',
    time: '18:00',
    venue: 'Uhuru Gardens',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 1500, availableQuantity: 800 },
      { name: 'Phase Two', description: 'Admits 1', price: 3500, availableQuantity: 800 },
      { name: 'Superfan - Early Bird', description: 'Admits 1', price: 5026, availableQuantity: 200 },
      { name: 'Superfan - Phase Two', description: 'Admits 1', price: 7026, availableQuantity: 200 },
    ],
    featured: false,
  },
  {
    id: '8',
    name: 'Sounds From The Continent Vol. II',
    slug: 'sounds-from-the-continent-vol-2',
    description: 'Sounds From The Continent Volume II returns! A high-energy show featuring chart-topping hits and spectacular stage production.',
    posterImage: '/sftc.jpg',
    date: '2026-12-24',
    time: '19:00',
    venue: 'FEIL Warehouse',
    location: 'Nairobi',
    category: 'Nairobi',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 1500, availableQuantity: 800 },
      { name: 'Advance', description: 'Admits 1', price: 2500, availableQuantity: 800 },
      { name: 'Gate', description: 'Admits 1', price: 3500, availableQuantity: 800 },
      { name: 'VIP', description: 'Admits 1', price: 6000, availableQuantity: 200 },
    ],
    featured: false,
  },
  // COAST EVENTS
  {
    id: '9',
    name: 'Sound Afrique',
    slug: 'sound-afrique',
    description: 'An authentic African music experience bringing together the best of Afro-house, Amapiano, and traditional African rhythms. A celebration of African music culture at The Tribe Bandas.',
    posterImage: '/soundafrique.jpg',
    date: '2026-12-26',
    time: '20:00',
    venue: 'The Tribe Bandas',
    location: 'Kilifi',
    category: 'Coast',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 500, availableQuantity: 1500 },
      { name: 'Advance', description: 'Admits 1', price: 1000, availableQuantity: 1500 },
      { name: 'Gate', description: 'Admits 1', price: 1500, availableQuantity: 1500 },
    ],
    featured: false,
  },
  {
    id: '10',
    name: 'Beneath The Baobabs',
    slug: 'beneath-the-baobabs',
    description: 'A unique festival set against the iconic baobab trees of Kilifi. Featuring local artists, cultural performances, and a celebration of coastal heritage.',
    posterImage: '/baobabs.png',
    date: '2026-12-30',
    time: '14:00',
    venue: 'Kilifi',
    location: 'Kilifi',
    category: 'Coast',
    ticketCategories: [
      { name: 'Early Bird - 3-Day Pass', description: 'Admits 1 for 3 days', price: 8500, availableQuantity: 500 },
      { name: 'Regular - 3-Day Pass', description: 'Admits 1 for 3 days', price: 12000, availableQuantity: 500 },
      { name: 'VIP - 3-Day Pass', description: 'Admits 1 for 3 days', price: 25000, availableQuantity: 100 },
    ],
    featured: false,
  },
  {
    id: '11',
    name: 'Summer Tides',
    slug: 'summer-tides',
    description: 'The ultimate beach party experience in Nyali, Mombasa! Dance the night away to the best summer hits with DJs from across the region. Food, drinks, and good vibes guaranteed.',
    posterImage: '/summertides.jpg',
    date: '2026-12-30',
    time: '16:00',
    venue: 'Nyali',
    location: 'Mombasa',
    category: 'Coast',
    ticketCategories: [
      { name: 'Early Bird', description: 'Admits 1', price: 2000, availableQuantity: 600 },
      { name: 'Advance', description: 'Admits 1', price: 3000, availableQuantity: 600 },
      { name: 'Gate', description: 'Admits 1', price: 4000, availableQuantity: 600 },
      { name: 'VIP', description: 'Admits 1', price: 8000, availableQuantity: 100 },
    ],
    featured: false,
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug);
}

export function getFeaturedEvent(): Event | undefined {
  return events.find((event) => event.featured);
}

export function filterEvents(category?: string, search?: string): Event[] {
  let filtered = [...events];

  if (category && category !== 'All Events') {
    if (category === 'Nairobi Events') {
      filtered = filtered.filter((event) => event.category === 'Nairobi');
    } else if (category === 'Coast Events') {
      filtered = filtered.filter((event) => event.category === 'Coast');
    } else if (category === 'Upcoming Events') {
      filtered = filtered.filter((event) => new Date(event.date) >= new Date());
    } else if (category === 'Featured Events') {
      filtered = filtered.filter((event) => event.featured);
    }
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.venue.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}
