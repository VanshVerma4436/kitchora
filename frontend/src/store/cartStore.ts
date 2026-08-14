import { create } from 'zustand';

export interface CartCustomization {
  name: string;
  option_name: string;
  price: number;
}

export interface CartItem {
  menu_item_id: number;
  name: string;
  price: number;
  image_url?: string;
  is_veg: boolean;
  quantity: number;
  kitchen_id: number;
  kitchen_name?: string;
  customizations: CartCustomization[];
}

interface CartState {
  items: CartItem[];
  kitchenId: number | null;
  couponCode: string;
  couponDiscount: number;
  pointsToRedeem: number;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  setPointsToRedeem: (pts: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

const safeParseItems = (): CartItem[] => {
  try {
    const item = localStorage.getItem('kitchora_cart');
    if (!item || item === 'undefined') return [];
    return JSON.parse(item);
  } catch (e) {
    localStorage.removeItem('kitchora_cart');
    return [];
  }
};

const safeParseKitchenId = (): number | null => {
  try {
    const item = localStorage.getItem('kitchora_cart_kitchen');
    if (!item || item === 'undefined') return null;
    return JSON.parse(item);
  } catch (e) {
    localStorage.removeItem('kitchora_cart_kitchen');
    return null;
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: safeParseItems(),
  kitchenId: safeParseKitchenId(),
  couponCode: '',
  couponDiscount: 0,
  pointsToRedeem: 0,

  addItem: (newItem) => {
    const { items, kitchenId } = get();

    let currentItems = items;
    if (kitchenId && kitchenId !== newItem.kitchen_id) {
      if (!window.confirm("Adding items from a new kitchen will reset your current cart. Continue?")) {
        return;
      }
      currentItems = [];
    }

    const existingIndex = currentItems.findIndex(
      (i) => i.menu_item_id === newItem.menu_item_id && JSON.stringify(i.customizations) === JSON.stringify(newItem.customizations)
    );

    let updatedItems = [...currentItems];
    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += newItem.quantity;
    } else {
      updatedItems.push(newItem);
    }

    try {
      localStorage.setItem('kitchora_cart', JSON.stringify(updatedItems));
      localStorage.setItem('kitchora_cart_kitchen', JSON.stringify(newItem.kitchen_id));
    } catch (e) {}
    set({ items: updatedItems, kitchenId: newItem.kitchen_id });
  },

  removeItem: (index) => {
    const { items } = get();
    const updated = items.filter((_, i) => i !== index);
    const newKitchenId = updated.length > 0 ? get().kitchenId : null;
    
    try {
      localStorage.setItem('kitchora_cart', JSON.stringify(updated));
      localStorage.setItem('kitchora_cart_kitchen', JSON.stringify(newKitchenId));
    } catch (e) {}
    set({ items: updated, kitchenId: newKitchenId });
  },

  updateQuantity: (index, qty) => {
    const { items } = get();
    if (qty <= 0) {
      get().removeItem(index);
      return;
    }
    const updated = [...items];
    updated[index].quantity = qty;
    try {
      localStorage.setItem('kitchora_cart', JSON.stringify(updated));
    } catch (e) {}
    set({ items: updated });
  },

  applyCoupon: (code, discount) => {
    set({ couponCode: code, couponDiscount: discount });
  },

  setPointsToRedeem: (pts) => {
    set({ pointsToRedeem: pts });
  },

  clearCart: () => {
    try {
      localStorage.removeItem('kitchora_cart');
      localStorage.removeItem('kitchora_cart_kitchen');
    } catch (e) {}
    set({ items: [], kitchenId: null, couponCode: '', couponDiscount: 0, pointsToRedeem: 0 });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, i) => {
      const customSum = (i.customizations || []).reduce((cSum, c) => cSum + c.price, 0);
      return sum + (i.price + customSum) * i.quantity;
    }, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const tax = subtotal * 0.05;
    const delivery = subtotal < 500 ? 30 : 0;
    const ptsDiscount = get().pointsToRedeem / 10.0;
    const totalDiscount = get().couponDiscount + ptsDiscount;
    return Math.max(0, Math.round(subtotal + tax + delivery - totalDiscount));
  },
}));
