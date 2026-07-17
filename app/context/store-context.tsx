"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  specs: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  orders: Order[];
  theme: "light" | "dark";
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addOrder: (order: Omit<Order, "id" | "date">) => Order;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleTheme: () => void;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "SoundScape Max",
    description: "Premium over-ear active noise-canceling headphones featuring immersive spatial audio, luxury anodized aluminum earcups, and up to 40 hours of playback.",
    price: 299.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewsCount: 124,
    inStock: true,
    specs: {
      "Drivers": "40mm custom dynamic drivers",
      "Battery Life": "Up to 40 hours (ANC on)",
      "Connectivity": "Bluetooth 5.3, USB-C",
      "ANC": "Hybrid active noise cancellation",
      "Weight": "385g"
    }
  },
  {
    id: "prod-2",
    name: "Chronos Watch S3",
    description: "Elegant health and fitness smartwatch with an always-on AMOLED display, heart rate monitor, sleep tracking, and up to 10 days of battery life.",
    price: 199.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviewsCount: 89,
    inStock: true,
    specs: {
      "Display": "1.43-inch Always-on AMOLED",
      "Sensors": "Heart Rate, SpO2, Accelerometer, Gyroscope",
      "Battery Life": "Up to 10 days",
      "Water Resistance": "5ATM (up to 50m)",
      "Compatibility": "iOS & Android"
    }
  },
  {
    id: "prod-3",
    name: "Keystone Pro Keyboard",
    description: "Hot-swappable mechanical keyboard with tactile brown switches, beautiful solid walnut base, double-shot PBT keycaps, and customizable white backlighting.",
    price: 149.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviewsCount: 72,
    inStock: true,
    specs: {
      "Switches": "Gateron Brown Tactile (Hot-swappable)",
      "Layout": "75% layout (84 keys)",
      "Base Material": "Solid American Walnut Wood & Aluminum",
      "Connectivity": "USB-C, Bluetooth 5.1 (Up to 3 devices)",
      "Backlight": "Dimmable warm white LED"
    }
  },
  {
    id: "prod-4",
    name: "Lumina Ambient Glow",
    description: "Smart table lamp featuring interactive touch controls, support for 16 million colors, voice assistant control, and dynamic light patterns syncing with your music.",
    price: 79.99,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewsCount: 145,
    inStock: true,
    specs: {
      "Brightness": "800 Lumens (fully dimmable)",
      "Colors": "16+ Million RGB + Tunable White",
      "Smart Integrations": "Alexa, Google Assistant, HomeKit",
      "Lifespan": "25,000 Hours",
      "Dimensions": "20cm x 12cm"
    }
  },
  {
    id: "prod-5",
    name: "Cortex Wireless Charger",
    description: "A premium 3-in-1 magnetic wireless charging stand built from space-grade aluminum. Powers your smartphone, smartwatch, and wireless earbuds simultaneously.",
    price: 59.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewsCount: 53,
    inStock: true,
    specs: {
      "Output": "15W MagSafe Phone, 5W Watch, 5W Buds",
      "Material": "Anodized Aluminum & Silicone",
      "Input": "USB-C PD (30W Adapter included)",
      "Dimensions": "15cm x 10cm x 12cm",
      "Safety": "Over-voltage, over-temperature protection"
    }
  },
  {
    id: "prod-6",
    name: "AeroBuds Nano",
    description: "True wireless earbuds delivering high-fidelity audio, hybrid active noise cancellation, and a water-resistant design in an ultra-compact pocket-sized case.",
    price: 129.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60",
    rating: 4.4,
    reviewsCount: 95,
    inStock: true,
    specs: {
      "ANC": "Hybrid ANC (Up to 35dB reduction)",
      "Battery Life": "8 hours (32 hours total with case)",
      "IP Rating": "IPX5 sweat and rain resistant",
      "Driver Unit": "6mm Graphene Drivers",
      "Latency": "60ms Ultra-low latency mode"
    }
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hydrated, setHydrated] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const hydrate = () => {
      try {
        const storedProducts = localStorage.getItem("aether_products");
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedCart = localStorage.getItem("aether_cart");
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedWishlist = localStorage.getItem("aether_wishlist");
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

        const storedOrders = localStorage.getItem("aether_orders");
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedTheme = localStorage.getItem("aether_theme");
        if (storedTheme === "light" || storedTheme === "dark") {
          setTheme(storedTheme);
        } else {
          // Default to system preference if no explicit store
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(prefersDark ? "dark" : "light");
        }
      } catch (e) {
        console.error("Failed to load store data", e);
      }
      setHydrated(true);
    };

    const timer = setTimeout(hydrate, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage when state updates
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("aether_products", JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("aether_cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("aether_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("aether_orders", JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("aether_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, hydrated]);

  // Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addOrder = (orderData: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Prevent flash or visual shifts before hydration completes
  if (!hydrated) {
    return null;
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        theme,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        addOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
