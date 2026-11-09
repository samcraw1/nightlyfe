"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { venue } from "@/config/venue";
import { useApp } from "@/lib/store";
import { conversations } from "@/data/messages";
import type { MobileNavKey } from "@/clubs/types";
import { CalendarIcon, ChatIcon, CrownIcon, HomeIcon, PlayIcon, SparkleIcon, UserIcon } from "./icons";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  feature?: keyof typeof venue.features;
};

/** Every tab a club can put in its mobile bar; `venue.nav.mobile` picks and orders them. */
const catalog: Record<MobileNavKey, NavItem> = {
  home: { href: "/", label: "Home", Icon: HomeIcon, exact: true },
  performers: { href: "/girls", label: venue.labels.performersShort, Icon: SparkleIcon },
  live: { href: "/live", label: "Live", Icon: PlayIcon, feature: "liveStream" },
  messages: { href: "/messages", label: "Messages", Icon: ChatIcon, feature: "messaging" },
  reserve: { href: "/reserve", label: "VIP", Icon: CrownIcon },
  events: { href: "/events", label: "Events", Icon: CalendarIcon },
  account: { href: "/account", label: "Account", Icon: UserIcon },
};

const items = venue.nav.mobile.map((key) => catalog[key]);

export default function BottomNav() {
  const pathname = usePathname();
  const { hydrated } = useApp();
  if (items.length === 0) return null;
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items
          .filter((i) => !i.feature || venue.features[i.feature])
          .map(({ href, label, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                active ? "text-gold" : "text-bone/50 hover:text-bone"
              }`}
            >
              <span className="relative">
                <Icon className="h-5.5 w-5.5" />
                {href === "/messages" && hydrated && unread > 0 ? (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blood px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </span>
              {label}
              {active ? (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
