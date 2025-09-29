
import { MenuItem } from './types';

// IMPORTANT: This URL is from the Google Apps Script deployment.
export const API_URL = 'https://script.google.com/macros/s/AKfycbzxL2RODj6xDVKGhABQhdnsUakMQOfOGDqXYLdKMi3hmrdLXcPYPHTszp5ozcn3Zax_/exec';

export const SHIPPING_FEE = 5.00;
export const MAX_ITEM_QUANTITY = 10;
export const MAX_CART_ITEMS = 20;
export const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'The Majestic Filet Mignon',
    description: '8oz center-cut, extraordinarily tender, aged to perfection. Served with garlic mashed potatoes.',
    price: 52.99,
    imageUrl: 'https://picsum.photos/seed/filet/400/300',
  },
  {
    id: 2,
    name: 'Ribeye Royale',
    description: '16oz bone-in ribeye, exceptionally marbled for peak flavor and succulence. Served with grilled asparagus.',
    price: 58.50,
    imageUrl: 'https://picsum.photos/seed/ribeye/400/300',
  },
  {
    id: 3,
    name: 'New York Strip Supreme',
    description: '14oz USDA Prime, a perfect balance of flavor and tenderness with a distinct bite. Served with creamed spinach.',
    price: 49.75,
    imageUrl: 'https://picsum.photos/seed/nystrip/400/300',
  },
  {
    id: 4,
    name: 'The Porterhouse King',
    description: '24oz of pure excellence, combining the tenderness of a filet with the rich flavor of a strip. Served with truffle fries.',
    price: 75.00,
    imageUrl: 'https://picsum.photos/seed/porterhouse/400/300',
  },
  {
    id: 5,
    name: 'Wagyu Perfection',
    description: '6oz A5 Japanese Wagyu, an unforgettable, melt-in-your-mouth experience. Served with wasabi-yuzu sauce.',
    price: 120.00,
    imageUrl: 'https://picsum.photos/seed/wagyu/400/300',
  },
  {
    id: 6,
    name: 'Classic Sirloin',
    description: '10oz top sirloin, lean yet flavorful, grilled to your liking. Served with a baked potato.',
    price: 35.50,
    imageUrl: 'https://picsum.photos/seed/sirloin/400/300',
  },
];
