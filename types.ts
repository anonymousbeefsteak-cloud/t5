export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
    orderNumber: string;
    orderTime: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: 'Credit Card' | 'Cash on Delivery';
    orderNotes?: string;
    items: string; // JSON string of CartItem[]
    subtotal: number;
    shippingFee: number;
    total: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    orderNumber?: string;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}