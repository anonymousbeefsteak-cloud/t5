
import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const handleAddToCart = () => {
        addToCart(item);
        addToast(`Added ${item.name} to cart!`, 'success');
    };

    return (
        <div className="bg-brand-gray rounded-lg overflow-hidden shadow-xl border border-brand-gold/20 transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <img className="w-full h-48 object-cover" src={item.imageUrl} alt={item.name} />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-brand-gold">{item.name}</h3>
                <p className="text-gray-400 mt-2 flex-grow">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-brand-light">${item.price.toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="bg-brand-gold text-brand-dark font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
