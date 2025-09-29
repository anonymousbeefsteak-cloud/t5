import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, MenuItem } from '../types';
import { setItem, getItem, removeItem } from '../services/secureStorage';
import { MAX_ITEM_QUANTITY, MAX_CART_ITEMS } from '../constants';
import { useToast } from './useToast';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'steakhouse_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        try {
            const storedCart = getItem<CartItem[]>(CART_STORAGE_KEY);
            if (storedCart) {
                setCart(storedCart);
            }
        } catch (error) {
            console.error("Failed to load cart from secure storage:", error);
            removeItem(CART_STORAGE_KEY);
        }
    }, []);
    
    useEffect(() => {
        if (cart.length > 0) {
            setItem(CART_STORAGE_KEY, cart);
        } else {
            removeItem(CART_STORAGE_KEY);
        }
    }, [cart]);

    const addToCart = useCallback((item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                const newQuantity = Math.min(existingItem.quantity + 1, MAX_ITEM_QUANTITY);
                 if(newQuantity === existingItem.quantity) {
                    addToast(`Maximum quantity of ${MAX_ITEM_QUANTITY} for ${item.name} reached.`, 'warning');
                 }
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
                );
            } else {
                if (prevCart.length >= MAX_CART_ITEMS) {
                    addToast(`Cannot add more than ${MAX_CART_ITEMS} different items to the cart.`, 'warning');
                    return prevCart;
                }
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    }, [addToast]);

    const removeFromCart = useCallback((itemId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        if (isNaN(quantity)) return;

        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
            const newQuantity = Math.min(quantity, MAX_ITEM_QUANTITY);
            return prevCart.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
        });
    }, []);
    
    const clearCart = useCallback(() => {
        setCart([]);
        removeItem(CART_STORAGE_KEY);
    }, []);


    // FIX: Replace JSX with React.createElement to avoid syntax errors in a .ts file.
    return React.createElement(CartContext.Provider, { value: { cart, addToCart, removeFromCart, updateQuantity, clearCart } }, children);
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};