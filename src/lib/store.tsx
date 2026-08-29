import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as seedProducts, type Product } from "./data";

export type CartLine = { product: Product; qty: number };

export type Order = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "Processing" | "In transit" | "Delivered";
  createdAt: string;
  address: string;
  fulfillment?: "delivery" | "pickup";
  mapsLink?: string;
  note?: string;
};

const seedOrders: Order[] = [
  {
    id: "STK-10421",
    phone: "0244123456",
    name: "Ama Boateng",
    items: [{ name: "Marble-Top Center Table", qty: 1, price: 2800 }],
    total: 2800,
    status: "Delivered",
    createdAt: "2026-07-14T10:20:00Z",
    address: "East Legon, Accra",
  },
  {
    id: "STK-10488",
    phone: "0201998877",
    name: "Kwesi Danso",
    items: [
      { name: "Fluted Floating TV Console", qty: 1, price: 4200 },
      { name: "Round LED Backlit Mirror", qty: 1, price: 1650 },
    ],
    total: 5850,
    status: "In transit",
    createdAt: "2026-08-19T15:05:00Z",
    address: "Achimota, Accra",
  },
  {
    id: "STK-10502",
    phone: "0559911223",
    name: "Nana Adjei",
    items: [{ name: "Six-Drawer Modern Dresser", qty: 2, price: 3400 }],
    total: 6800,
    status: "Processing",
    createdAt: "2026-08-26T09:40:00Z",
    address: "Spintex, Accra",
  },
];

export type Notification = { id: string; title: string; body: string; time: string };

const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: "Order STK-10488 is on the way",
    body: "Your TV console and mirror left the workshop this morning.",
    time: "2h ago",
  },
  {
    id: "n2",
    title: "New arrivals in Mirrors",
    body: "Four LED backlit pieces just joined the catalogue.",
    time: "Yesterday",
  },
];

type Store = {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  cart: CartLine[];
  addToCart: (p: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  searchHistory: string[];
  pushSearch: (q: string) => void;
  removeSearch: (q: string) => void;
  notifications: Notification[];
};

const StoreContext = createContext<Store | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (loaded) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, loaded]);
  return [value, setValue] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = usePersisted<Product[]>("stelike.products", []);
  const [overrides, setOverrides] = usePersisted<Record<string, Product>>(
    "stelike.overrides",
    {},
  );
  const [cart, setCart] = usePersisted<CartLine[]>("stelike.cart", []);
  const [orders, setOrders] = usePersisted<Order[]>("stelike.orders", seedOrders);
  const [searchHistory, setSearchHistory] = usePersisted<string[]>("stelike.search", [
    "LED mirror",
    "TV console",
    "Center table",
  ]);

  const products = useMemo(
    () => [...custom, ...seedProducts].map((p) => overrides[p.id] ?? p),
    [custom, overrides],
  );

  const addToCart = useCallback(
    (p: Product, qty = 1) =>
      setCart((prev) => {
        const found = prev.find((l) => l.product.id === p.id);
        if (found)
          return prev.map((l) =>
            l.product.id === p.id ? { ...l, qty: l.qty + qty } : l,
          );
        return [...prev, { product: p, qty }];
      }),
    [setCart],
  );

  const value: Store = {
    products,
    addProduct: (p) => setCustom((prev) => [p, ...prev]),
    updateProduct: (p) => setOverrides((prev) => ({ ...prev, [p.id]: p })),
    cart,
    addToCart,
    setQty: (id, qty) =>
      setCart((prev) =>
        prev
          .map((l) => (l.product.id === id ? { ...l, qty } : l))
          .filter((l) => l.qty > 0),
      ),
    removeFromCart: (id) => setCart((prev) => prev.filter((l) => l.product.id !== id)),
    clearCart: () => setCart([]),
    cartCount: cart.reduce((s, l) => s + l.qty, 0),
    cartTotal: cart.reduce((s, l) => s + l.qty * l.product.price, 0),
    orders,
    placeOrder: (o) => {
      const order: Order = {
        ...o,
        id: `STK-${Math.floor(10000 + Math.random() * 89999)}`,
        createdAt: new Date().toISOString(),
        status: "Processing",
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    searchHistory,
    pushSearch: (q) =>
      setSearchHistory((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 5)),
    removeSearch: (q) => setSearchHistory((prev) => prev.filter((x) => x !== q)),
    notifications: seedNotifications,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
