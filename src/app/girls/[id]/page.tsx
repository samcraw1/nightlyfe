import { notFound } from "next/navigation";
import { entertainers, getEntertainer } from "@/data/entertainers";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GirlProfileActions from "@/components/girls/GirlProfileActions";
import SocialLinks from "@/components/girls/SocialLinks";
import { formatCount } from "@/lib/format";

export function generateStaticParams() {
  return entertainers.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const girl = getEntertainer((await params).id);
  return { title: girl ? girl.name : "Entertainer" };
}

export default async function GirlProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const girl = getEntertainer((await params).id);
  if (!girl) notFound();

  return (
    <div>
      {/* hero portrait */}
      <section className="relative -mt-16 pt-16">
        <MockImage
          hue={girl.hue}
          label={girl.name}
          className="h-[52svh] min-h-80 w-full sm:h-[60svh]"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="fade-up relative -mt-24 pb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {girl.workingTonight ? (
              <Badge variant="tonight" pulse>
                Working tonight
              </Badge>
            ) : (
              <Badge variant="muted">Off tonight</Badge>
            )}
            {girl.featured ? <Badge variant="gold">Featured</Badge> : null}
          </div>
          <h1 className="gold-text font-display text-5xl sm:text-6xl">
            {girl.name}
          </h1>
          <p className="mt-2 text-sm text-bone/80">{girl.tagline}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted">
            {formatCount(girl.followers)} followers
          </p>
          <SocialLinks socials={girl.socials} name={girl.name} className="mt-4" />
          <div className="mt-6">
            <GirlProfileActions girl={girl} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <section className="glass rounded-3xl p-6">
              <p className="eyebrow mb-3">About</p>
              <p className="text-sm leading-relaxed text-bone/80">{girl.bio}</p>
            </section>

            <section>
              <p className="eyebrow mb-4">Gallery</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {Array.from({ length: girl.galleryCount }, (_, i) => (
                  <MockImage
                    key={i}
                    hue={(girl.hue + i * 24) % 360}
                    label={girl.name}
                    className="aspect-square rounded-2xl"
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {girl.schedule?.length ? (
              <section className="glass rounded-3xl p-6">
                <p className="eyebrow mb-4">Schedule</p>
                <ul className="space-y-2.5 text-sm">
                  {girl.schedule?.map((s) => (
                    <li
                      key={s.day}
                      className="flex justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="text-bone/80">{s.day}</span>
                      <span className="font-semibold text-gold">{s.hours}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="glass relative overflow-hidden rounded-3xl p-6 text-center">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(80% 100% at 50% 0%, rgba(212,169,78,0.15), transparent 70%)",
                }}
              />
              <div className="relative">
                <p className="font-display text-xl text-bone">
                  {girl.workingTonight
                    ? `See ${girl.name} tonight`
                    : "Planning a night out?"}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Reserve a table and skip the line.
                </p>
                <Button href="/reserve" className="mt-4 w-full">
                  Reserve a Table Tonight
                </Button>
              </div>
            </section>
            {girl.socials ? (
              <section className="glass relative overflow-hidden rounded-3xl p-6">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      "radial-gradient(80% 100% at 50% 0%, rgba(212,169,78,0.15), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <p className="mb-4 font-display text-lg text-bone">
                    Follow {girl.name}
                  </p>
                  <SocialLinks
                    socials={girl.socials}
                    name={girl.name}
                    orientation="vertical"
                  />
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
