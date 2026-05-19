import Image from "next/image";
import Link from "next/link";

import tutorImg from "@/assets/tutor-teaching.jpg";
import { POSTS } from "@/lib/site";

export default function Blog() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-grid-fade opacity-25" />

        <div className="relative container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Blog & news
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            JAMB updates, study tips & academy news.
          </h1>
        </div>
      </section>

      <section className="container-page py-16">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid md:grid-cols-2 gap-8 rounded-3xl overflow-hidden border border-border bg-card hover:shadow-elevated transition-shadow"
        >
          <div className="aspect-16/10 md:aspect-auto overflow-hidden">
            <Image
              src={tutorImg}
              alt={featured.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Featured · {featured.category}
            </span>

            <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
              {featured.title}
            </h2>

            <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>

            <p className="mt-5 text-xs text-muted-foreground">
              {new Date(featured.date).toLocaleDateString("en-NG", {
                dateStyle: "long",
              })}
            </p>
          </div>
        </Link>
      </section>

      <section className="container-page pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={tutorImg}
                  alt={p.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {p.category}
                </span>

                <h3 className="mt-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {p.excerpt}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleDateString("en-NG", {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
