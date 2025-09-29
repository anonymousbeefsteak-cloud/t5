
interface CheckoutFormData {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
}

interface FormErrors {
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
}

export const validateCheckoutForm = (formData: CheckoutFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.customerName.trim()) {
        errors.customerName = 'Full name is required.';
    } else if (formData.customerName.length < 2) {
        errors.customerName = 'Name must be at least 2 characters long.';
    }

    if (!formData.customerPhone.trim()) {
        errors.customerPhone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-()]{7,}$/.test(formData.customerPhone)) {
        errors.customerPhone = 'Please enter a valid phone number.';
    }
    
    if (!formData.deliveryAddress.trim()) {
        errors.deliveryAddress = 'Delivery address is required.';
    } else if (formData.deliveryAddress.length < 10) {
        errors.deliveryAddress = 'Please provide a more detailed address.';
    }

    return errors;
};
