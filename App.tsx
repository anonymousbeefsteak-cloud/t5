import React, { useState, useCallback } from 'react';
import { CartProvider, useCart } from './hooks/useCart';
import { ToastProvider, useToast } from './hooks/useToast';
import Header from './components/Header';
import MenuList from './components/MenuList';
import CheckoutForm from './components/CheckoutForm';
import OrderConfirmation from './components/OrderConfirmation';
import { Order } from './types';
import NetworkStatusNotifier from './components/NetworkStatusNotifier';
import ChatWidget from './components/ChatWidget';

type View = 'menu' | 'checkout' | 'confirmation';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('menu');
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
    const { cart, clearCart } = useCart();
    const { addToast } = useToast();

    const handleCheckout = useCallback(() => {
        if (cart.length === 0) {
            addToast('Your cart is empty!', 'error');
            return;
        }
        setView('checkout');
    }, [cart.length, addToast]);

    const handleOrderSuccess = useCallback((order: Order) => {
        setConfirmedOrder(order);
        setView('confirmation');
        clearCart();
    }, [clearCart]);

    const handleReturnToMenu = useCallback(() => {
        setConfirmedOrder(null);
        setView('menu');
    }, []);

    return (
        <div className="min-h-screen bg-brand-dark">
            <Header onCheckout={handleCheckout} />
            <main className="container mx-auto px-4 py-8">
                {view === 'menu' && <MenuList />}
                {view === 'checkout' && <CheckoutForm onOrderSuccess={handleOrderSuccess} onBack={() => setView('menu')} />}
                {view === 'confirmation' && confirmedOrder && <OrderConfirmation order={confirmedOrder} onReturnToMenu={handleReturnToMenu} />}
            </main>
            <footer className="text-center py-4 text-gray-500 border-t border-gray-700 mt-12">
                <p>&copy; {new Date().getFullYear()} Steakhouse Supreme. All Rights Reserved.</p>
                <p className="text-sm mt-1">This is a demonstration application with enhanced security features.</p>
            </footer>
            <NetworkStatusNotifier />
            <ChatWidget />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </ToastProvider>
    );
};

export default App;