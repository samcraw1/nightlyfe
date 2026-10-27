import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { StageEntertainer } from "@/lib/digital-stage/types";
import PerformerAvatar from "./PerformerAvatar";

interface NowPerformingProps {
  active: StageEntertainer | null;
  next: StageEntertainer | null;
  queue: StageEntertainer[];
  stageLive: boolean;
}

/** "LIVE NOW: Goldie" plus the rotation that follows her. */
export default function NowPerforming({ active, next, queue, stageLive }: NowPerformingProps) {
  return (
    <div className="glass rounded-3xl p-5">
      {active && stageLive ? (
        <div className="flex items-center gap-4">
          <PerformerAvatar entertainer={active} className="h-16 w-16 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="live" pulse>Live now</Badge>
            </div>
            <p className="font-display mt-1 truncate text-2xl leading-tight text-bone">{active.stageName}</p>
            {active.bio ? <p className="line-clamp-1 text-xs text-muted">{active.bio}</p> : null}
          </div>
          <Link
            href={`/girls/${active.slug}`}
            className="shrink-0 rounded-full border border-gold/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
          >
            Profile
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-2xl">🎙️</div>
          <div>
            <Badge variant="muted">{stageLive ? "Between sets" : "Stage offline"}</Badge>
            <p className="font-display mt-1 text-xl text-bone">{stageLive ? "Next performer coming up" : "Nobody is on the stage right now"}</p>
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-white/5 pt-4">
        <p className="eyebrow mb-3">Up next</p>
        {next ? (
          <ol className="space-y-2.5">
            {[next, ...queue].map((e, i) => (
              <li key={e.id} className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-bold text-gold">{i + 1}</span>
                <PerformerAvatar entertainer={e} className="h-9 w-9 rounded-full" />
                <Link href={`/girls/${e.slug}`} className="flex-1 truncate text-sm text-bone hover:text-gold">
                  {e.stageName}
                </Link>
                {i === 0 ? <Badge variant="tonight">Next</Badge> : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted">The rotation hasn&apos;t been set yet.</p>
        )}
      </div>
    </div>
  );
}
