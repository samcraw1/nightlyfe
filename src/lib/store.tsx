"use client";

/**
 * Demo-only client store. Everything here (credits, favorites, messages,
 * reservations, cart) is mock state persisted to localStorage. When real
 * services exist, swap these actions for API calls — the component-facing
 * interface can stay the same.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Message, Reservation, TicketOrder } from "@/types";
import { seedMessages, STARTING_CREDITS } from "@/data/messages";

interface CartItem {
  id: string;
  qty: number;
}

interface AppState {
  hydrated: boolean;
  credits: number;
  favorites: string[];
  messages: Message[];
  reservations: Reservation[];
  ticketOrders: TicketOrder[];
  cart: CartItem[];
  buyCreditsOpen: boolean;
  setBuyCreditsOpen: (open: boolean) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addCredits: (amount: number) => void;
  /** Returns false (and does nothing) when the balance is too low. */
  spendCredits: (amount: number) => boolean;
  addMessage: (message: Message) => void;
  addReservation: (reservation: Reservation) => void;
  addTicketOrder: (order: TicketOrder) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppState | null>(null);

const LS_KEY = "onyx-demo-state-v1";

interface PersistedState {
  credits: number;
  favorites: string[];
  userMessages: Message[];
  reservations: Reservation[];
  ticketOrders: TicketOrder[];
  cart: CartItem[];
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [credits, setCredits] = useState(STARTING_CREDITS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);

  // Hydrate persisted demo state from localStorage after mount. This must
  // run in an effect (not render) so the server and first client render
  // match; the one-time cascade is intentional.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      setCredits(saved.credits);
      setFavorites(saved.favorites);
      setUserMessages(saved.userMessages);
      setReservations(saved.reservations);
      setTicketOrders(saved.ticketOrders);
      setCart(saved.cart);
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      const state: PersistedState = {
        credits,
        favorites,
        userMessages,
        reservations,
        ticketOrders,
        cart,
      };
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode) — demo state just won't persist
    }
  }, [hydrated, credits, favorites, userMessages, reservations, ticketOrders, cart]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const addCredits = useCallback((amount: number) => {
    setCredits((c) => c + amount);
  }, []);

  const spendCredits = useCallback(
    (amount: number) => {
      if (credits < amount) return false;
      setCredits((c) => c - amount);
      return true;
    },
    [credits]
  );

  const addMessage = useCallback((message: Message) => {
    setUserMessages((prev) => [...prev, message]);
  }, []);

  const addReservation = useCallback((reservation: Reservation) => {
    setReservations((prev) => [...prev, reservation]);
  }, []);

  const addTicketOrder = useCallback((order: TicketOrder) => {
    setTicketOrders((prev) => [...prev, order]);
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const messages = useMemo(
    () => [...seedMessages, ...userMessages],
    [userMessages]
  );

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      credits,
      favorites,
      messages,
      reservations,
      ticketOrders,
      cart,
      buyCreditsOpen,
      setBuyCreditsOpen,
      toggleFavorite,
      isFavorite,
      addCredits,
      spendCredits,
      addMessage,
      addReservation,
      addTicketOrder,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [
      hydrated,
      credits,
      favorites,
      messages,
      reservations,
      ticketOrders,
      cart,
      buyCreditsOpen,
      toggleFavorite,
      isFavorite,
      addCredits,
      spendCredits,
      addMessage,
      addReservation,
      addTicketOrder,
      addToCart,
      removeFromCart,
      clearCart,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
