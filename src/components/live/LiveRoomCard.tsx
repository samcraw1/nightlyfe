import Link from "next/link";
import type { Entertainer, LiveRoom } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";

interface LiveRoomCardProps {
  room: LiveRoom;
  girl: Entertainer;
}

/** Discovery card for an entertainer's livestream room. */
export default function LiveRoomCard({ room, girl }: LiveRoomCardProps) {
  return (
    <article className="glass group overflow-hidden rounded-3xl transition duration-300 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,169,78,0.12)]">
      <Link href={`/webcams/${room.id}`} className="block">
        <MockImage
          hue={girl.hue}
          label={girl.name}
          className="aspect-video w-full transition duration-500 group-hover:scale-[1.03]"
        >
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant="live" pulse>
              Live
            </Badge>
            {girl.workingTonight ? (
              <Badge variant="tonight">Tonight</Badge>
            ) : null}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {formatCount(room.viewerCount)} watching
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-display text-xl text-bone drop-shadow">
              {girl.name}
            </h3>
            <p className="line-clamp-1 text-xs text-bone/75">{room.title}</p>
          </div>
        </MockImage>
      </Link>
      <div className="flex gap-2 p-4">
        <Link
          href={`/webcams/${room.id}`}
          className="flex-1 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep py-2 text-center text-[11px] font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
        >
          Watch Live
        </Link>
        <Link
          href={`/messages/conv-${girl.id}`}
          className="flex-1 rounded-full border border-gold/40 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
        >
          Message
        </Link>
      </div>
    </article>
  );
}
