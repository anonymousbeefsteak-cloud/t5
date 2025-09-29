
import React, { useState, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { saveOrder } from '../services/apiService';
import { SHIPPING_FEE } from '../constants';
import { Order } from '../types';
import { validateCheckoutForm } from '../utils/validation';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './common/LoadingSpinner';

interface CheckoutFormProps {
    onOrderSuccess: (order: Order) => void;
    onBack: () => void;
}

interface FormErrors {
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderSuccess, onBack }) => {
    const { cart } = useCart();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        paymentMethod: 'Credit Card' as 'Credit Card' | 'Cash on Delivery',
        orderNotes: '',
    });

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const total = useMemo(() => subtotal + SHIPPING_FEE, [subtotal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Prevent malicious long strings
        const sanitizedValue = value.slice(0, 250);
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formErrors = validateCheckoutForm(formData);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            addToast('Please fix the errors in the form.', 'error');
            return;
        }

        setIsLoading(true);
        const orderNumber = `SS-${Date.now()}`;
        const orderTime = new Date().toISOString();

        const order: Order = {
            ...formData,
            orderNumber,
            orderTime,
            items: JSON.stringify(cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))),
            subtotal,
            shippingFee: SHIPPING_FEE,
            total,
        };

        try {
            const result = await saveOrder(order);
            if (result.success) {
                addToast('Order placed successfully!', 'success');
                onOrderSuccess(order);
            } else {
                throw new Error(result.message || 'Failed to save order.');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addToast(`Error: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (cart.length === 0 && !isLoading) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-serif text-brand-gold mb-4">Your cart is empty.</h2>
          <button onClick={onBack} className="bg-brand-gold text-brand-dark font-bold py-2 px-6 rounded hover:bg-yellow-500 transition-colors">
              Back to Menu
          </button>
        </div>
      );
    }

    return (
        <div className="max-w-2xl mx-auto bg-brand-gray p-8 rounded-lg shadow-xl border border-brand-gold/20">
            <h2 className="text-4xl font-serif text-brand-gold mb-6 border-b border-brand-gold/20 pb-4">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} className={`mt-1 block w-full bg-brand-dark rounded border ${errors.customerName ? 'border-red-500' : 'border-gray-600'} p-2 focus:ring-brand-gold focus:border-brand-gold`} />
                    {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>
                <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input type="tel" id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className={`mt-1 block w-full bg-brand-dark rounded border ${errors.customerPhone ? 'border-red-500' : 'border-gray-600'} p-2 focus:ring-brand-gold focus:border-brand-gold`} />
                    {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                </div>
                <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-300">Delivery Address</label>
                    <textarea id="deliveryAddress" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} rows={3} className={`mt-1 block w-full bg-brand-dark rounded border ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-600'} p-2 focus:ring-brand-gold focus:border-brand-gold`}></textarea>
                    {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                </div>
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">Payment Method</label>
                    <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 block w-full bg-brand-dark rounded border border-gray-600 p-2 focus:ring-brand-gold focus:border-brand-gold">
                        <option>Credit Card</option>
                        <option>Cash on Delivery</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-300">Order Notes (Optional)</label>
                    <textarea id="orderNotes" name="orderNotes" value={formData.orderNotes} onChange={handleChange} rows={3} className="mt-1 block w-full bg-brand-dark rounded border border-gray-600 p-2 focus:ring-brand-gold focus:border-brand-gold"></textarea>
                </div>

                <div className="flex items-center justify-between mt-8">
                    <button type="button" onClick={onBack} disabled={isLoading} className="bg-gray-600 text-white font-bold py-3 px-6 rounded hover:bg-gray-500 transition-colors disabled:opacity-50">
                        Back to Menu
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-brand-gold text-brand-dark font-bold py-3 px-6 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isLoading && <LoadingSpinner />}
                        {isLoading ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
