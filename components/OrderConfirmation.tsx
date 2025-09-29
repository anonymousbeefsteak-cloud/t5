
import React from 'react';
import { Order } from '../types';

interface OrderConfirmationProps {
    order: Order;
    onReturnToMenu: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onReturnToMenu }) => {
    return (
        <div className="max-w-2xl mx-auto text-center bg-brand-gray p-8 rounded-lg shadow-xl border border-brand-gold/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-400 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-4xl font-serif text-brand-gold mb-2">Thank You for Your Order!</h2>
            <p className="text-gray-300 mb-6">Your order has been placed successfully and is being prepared.</p>
            
            <div className="text-left bg-brand-dark p-6 rounded-lg border border-gray-700 space-y-3">
                <p><strong className="text-gray-400">Order Number:</strong> <span className="text-brand-gold font-mono">{order.orderNumber}</span></p>
                <p><strong className="text-gray-400">Name:</strong> {order.customerName}</p>
                <p><strong className="text-gray-400">Total Amount:</strong> <span className="font-bold">${order.total.toFixed(2)}</span></p>
                <p><strong className="text-gray-400">Estimated Delivery:</strong> An SMS confirmation will be sent to {order.customerPhone} shortly.</p>
            </div>

            <button
                onClick={onReturnToMenu}
                className="mt-8 bg-brand-gold text-brand-dark font-bold py-3 px-8 rounded hover:bg-yellow-500 transition-colors duration-300"
            >
                Order Again
            </button>
        </div>
    );
};

export default OrderConfirmation;
