
import React from 'react';
import { useCart } from '../hooks/useCart';
import { SHIPPING_FEE } from '../constants';
import { CartItem } from '../types';

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + SHIPPING_FEE;

    return (
        <div className="bg-brand-gray p-6 rounded-lg shadow-xl border border-brand-gold/20">
            <h2 className="text-3xl font-serif text-brand-gold mb-6 border-b border-brand-gold/20 pb-4">Your Order</h2>
            {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {cart.map((item: CartItem) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-brand-light">{item.name}</p>
                                    <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                        className="w-16 bg-brand-dark text-center rounded border border-gray-600 focus:ring-brand-gold focus:border-brand-gold"
                                    />
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-brand-gold/20 space-y-2">
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Shipping Fee</span>
                            <span>${SHIPPING_FEE.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-brand-light font-bold text-xl">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
