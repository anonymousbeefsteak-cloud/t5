
import React from 'react';
import { MENU_ITEMS } from '../constants';
import MenuItemCard from './MenuItemCard';
import Cart from './Cart';

const MenuList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-4xl font-serif text-brand-gold mb-8">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MENU_ITEMS.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24">
           <Cart />
        </div>
      </div>
    </div>
  );
};

export default MenuList;
