import { MenuItem } from '@/types/pos';

export const menuItems: MenuItem[] = [
  // Burgers
  { id: 'burger-1', name: 'Dube Cheese', price: 24.90, category: 'burgers' },
  { id: 'burger-2', name: 'Dube Bacon', price: 27.90, category: 'burgers' },
  { id: 'burger-3', name: 'Dube Melt', price: 32.90, category: 'burgers' },
  { id: 'burger-4', name: 'Dube Burger', price: 39.90, category: 'burgers' },

  // Drinks
  { id: 'drink-1', name: 'Coca-Cola', price: 6.00, category: 'drinks' },
  { id: 'drink-2', name: 'Guaraná', price: 6.00, category: 'drinks' },
  { id: 'drink-3', name: 'Suco Natural', price: 9.00, category: 'drinks' },
  { id: 'drink-4', name: 'Água Mineral', price: 4.00, category: 'drinks' },
  { id: 'drink-5', name: 'Milk Shake', price: 15.00, category: 'drinks' },
  { id: 'drink-6', name: 'Cerveja', price: 10.00, category: 'drinks' },

  // Sides
  { id: 'side-1', name: 'Batata Frita', price: 14.00, category: 'sides' },
  { id: 'side-2', name: 'Onion Rings', price: 16.00, category: 'sides' },
  { id: 'side-3', name: 'Nuggets (6un)', price: 18.00, category: 'sides' },
  { id: 'side-4', name: 'Salada', price: 12.00, category: 'sides' },
];
