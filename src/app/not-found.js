import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
      <div className="max-w-xl text-center flex flex-col items-center space-y-6">
        <div className="text-[80px] md:text-[100px] font-bold text-accent select-none leading-none">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Page Not Found</h1>
        <p className="text-muted-foreground mb-3">
          Sorry, we couldn&apos;t find the page you were looking for. 
          It may have moved or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-12 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground shadow-elevated hover:bg-accent/90 transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}