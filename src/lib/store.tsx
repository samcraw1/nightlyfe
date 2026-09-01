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
import type { LiveRoom, Message, Reservation, TicketOrder } from "@/types";
import { seedMessages, STARTING_CREDITS } from "@/data/messages";
import { liveRooms as seedLiveRooms } from "@/data/liveRooms";

interface CartItem {
  id: string;
  qty: number;
}

/** Runtime deltas layered over the seed rooms in data/liveRooms.ts. */
type RoomOverride = Partial<
  Pick<LiveRoom, "isLive" | "title" | "startedAt" | "viewerCount">
>;

interface AppState {
  hydrated: boolean;
  credits: number;
  favorites: string[];
  messages: Message[];
  reservations: Reservation[];
  ticketOrders: TicketOrder[];
  cart: CartItem[];
  /** Seed rooms merged with any runtime overrides (a dancer going live). */
  liveRooms: LiveRoom[];
  /** Mock credits earned by the logged-in dancer (tips received). */
  dancerEarnings: number;
  buyCreditsOpen: boolean;
  setBuyCreditsOpen: (open: boolean) => void;
  /**
   * INTEGRATION BOUNDARY — mock startStream()/endStream() today. With a real
   * provider these become API calls that create/close a LiveKit room, Mux
   * live stream, or IVS channel and store the returned playbackId.
   */
  startStream: (roomId: string, title: string) => void;
  endStream: (roomId: string) => void;
  addDancerEarnings: (credits: number) => void;
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
  roomOverrides?: Record<string, RoomOverride>;
  dancerEarnings?: number;
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
  const [roomOverrides, setRoomOverrides] = useState<
    Record<string, RoomOverride>
  >({});
  const [dancerEarnings, setDancerEarnings] = useState(0);
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
      setRoomOverrides(saved.roomOverrides ?? {});
      setDancerEarnings(saved.dancerEarnings ?? 0);
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
        roomOverrides,
        dancerEarnings,
      };
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode) — demo state just won't persist
    }
  }, [hydrated, credits, favorites, userMessages, reservations, ticketOrders, cart, roomOverrides, dancerEarnings]);

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

  // INTEGRATION BOUNDARY: mock stream lifecycle. A real implementation calls
  // the provider here (LiveKit CreateRoom / Mux create live stream / IVS
  // create channel) and stores the returned playbackId in the override.
  const startStream = useCallback((roomId: string, title: string) => {
    setRoomOverrides((prev) => ({
      ...prev,
      [roomId]: {
        isLive: true,
        title,
        startedAt: new Date().toISOString(),
        viewerCount: 12,
      },
    }));
  }, []);

  const endStream = useCallback((roomId: string) => {
    setRoomOverrides((prev) => ({
      ...prev,
      [roomId]: { isLive: false, viewerCount: 0, startedAt: undefined },
    }));
  }, []);

  const addDancerEarnings = useCallback((amount: number) => {
    setDancerEarnings((e) => e + amount);
  }, []);

  const liveRooms = useMemo(
    () =>
      seedLiveRooms.map((room) => ({
        ...room,
        ...roomOverrides[room.id],
      })),
    [roomOverrides]
  );

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
      liveRooms,
      dancerEarnings,
      buyCreditsOpen,
      setBuyCreditsOpen,
      startStream,
      endStream,
      addDancerEarnings,
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
      liveRooms,
      dancerEarnings,
      buyCreditsOpen,
      startStream,
      endStream,
      addDancerEarnings,
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
