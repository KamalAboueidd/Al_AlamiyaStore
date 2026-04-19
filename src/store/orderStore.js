import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, { ...order, id: Date.now().toString() }],
        })),
      updateOrder: (id, updatedOrder) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updatedOrder } : order
          ),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
      getOrder: (id) => get().orders.find((order) => order.id === id),
    }),
    {
      name: 'order-storage',
    }
  )
);

export default useOrderStore;