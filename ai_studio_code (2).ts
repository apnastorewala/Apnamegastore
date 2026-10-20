export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  packSize: string;
  mrp: number;
  price: number;
  image: string;
  description: string;
  badge?: string;
  inStock: boolean;
  unitWeight?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliverySlot {
  id: string;
  label: string;
  badge?: string;
  timeRange: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  landmark: string;
  pincode: string;
  deliverySlot: string;
  paymentMethod: 'cod' | 'upi_doorstep' | 'upi_online';
  orderNotes?: string;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  telegramUsername: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  whatsappNumber: string;
  supportPhone: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  localArea: string;
}

export interface CompletedOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalPayable: number;
  totalSavings: number;
  telegramMessage: string;
  botStatus?: 'sent_via_bot' | 'opened_in_telegram' | 'manual';
}