import { StoreConfig } from './types/grocery';

export const STORE_SETTINGS: StoreConfig = {
  // 🤖 1. TELEGRAM BOT DETAILS (Orders receive karne ke liye)
  // @BotFather se mila token yahan daalein:
  telegramBotToken: "", // e.g. "7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"

  // @userinfobot se mili apni Chat ID (User ID) yahan daalein:
  telegramChatId: "",   // e.g. "987654321" ya "-1001234567890"

  // Fallback username:
  telegramUsername: "ApnaLocalMart",

  // 🏪 2. STORE & CONTACT DETAILS
  storeName: "Aapka Apna Mart & Grocery",
  storeTagline: "⚡ Fast Home Delivery Available in Local Area",
  supportPhone: "+91 98765 43210",
  whatsappNumber: "+919876543210",
  localArea: "Local Colony, Sector 1 - 15 & Nearby",

  // 🚚 3. DELIVERY CHARGES
  freeDeliveryThreshold: 499, // ₹499 se upar Free Delivery
  deliveryFee: 25,            // Isse kam order par delivery charges
};