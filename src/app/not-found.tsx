import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="gold-text font-display text-4xl sm:text-5xl">
        This room doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">
        The page you&apos;re looking for isn&apos;t in the building.
      </p>
      <Button href="/" className="mt-8">
        Back to the Club
      </Button>
    </div>
  );
}
