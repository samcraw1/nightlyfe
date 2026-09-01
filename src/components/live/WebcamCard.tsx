import Link from "next/link";
import type { Webcam } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";

export default function WebcamCard({ cam }: { cam: Webcam }) {
  return (
    <article
      className={`glass group overflow-hidden rounded-3xl transition duration-300 ${
        cam.live ? "hover:border-gold/40" : "opacity-70"
      }`}
    >
      <Link
        href={`/webcams/${cam.id}`}
        className={cam.live ? "block" : "pointer-events-none block"}
        aria-disabled={!cam.live}
        tabIndex={cam.live ? undefined : -1}
      >
        <MockImage
          hue={cam.hue}
          label={cam.name}
          dim={!cam.live}
          className="aspect-video w-full transition duration-500 group-hover:scale-[1.03]"
        >
          <div className="absolute left-3 top-3">
            {cam.live ? (
              <Badge variant="live" pulse>
                Live
              </Badge>
            ) : (
              <Badge variant="muted">Offline</Badge>
            )}
          </div>
          {cam.live ? (
            <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              {formatCount(cam.viewers)} watching
            </div>
          ) : null}
          {/* play affordance */}
          {cam.live ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 pl-1 text-2xl text-ink">
                ▶
              </span>
            </div>
          ) : null}
        </MockImage>
      </Link>
      <div className="flex items-center justify-between p-4">
        <h3 className="font-display text-lg text-bone">{cam.name}</h3>
        {cam.live ? (
          <Link
            href={`/webcams/${cam.id}`}
            className="rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
          >
            Watch
          </Link>
        ) : (
          <span className="text-[11px] uppercase tracking-wider text-muted">
            Back tonight
          </span>
        )}
      </div>
    </article>
  );
}
