"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Trophy, BookOpen, ShieldCheck, Users, Calendar, CheckCircle2 } from "lucide-react";

import heroImg from "@/assets/hero-students.jpg";
import celebrateImg from "@/assets/students-celebrate.jpg";
import tutorImg from "@/assets/tutor-teaching.jpg";
import { Counter } from "@/components/site/Counter";
import { PROGRAMS, SCORERS, STATS, TESTIMONIALS, POSTS, SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-grid-fade opacity-30" />
        <div className="relative container-page py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center text-primary-foreground">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              JAMB 2026 registration now open
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-4xl md:text-6xl font-bold leading-[1.05]"
            >
              Pass <span className="text-accent">JAMB</span> &{" "}
              <span className="text-accent">WAEC</span>
              <br />
              With Confidence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-xl text-base md:text-lg text-white/80 leading-relaxed"
            >
              A structured tutorial academy built for Nigerian scholars.
              We&apos;ve trained over 4,200 students, with 312+ top scorers
              across JAMB, WAEC, NECO, Post-UTME and CBT.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-12 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-elevated hover:bg-accent/90 transition"
              >
                Register Now <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-12 rounded-full bg-white/10 border border-white/25 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 transition"
              >
                Contact Us
              </Link>
            </motion.div>

            <div className="mt-10 flex items-center gap-4 text-sm text-white/70">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/20 border-2 border-white/30 text-xs font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold text-white">4.9</span>
                <span>· trusted by 4,200+ families</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-accent/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-elevated">
              <Image
                src={heroImg}
                alt="Nigerian students studying at Benzene Plus Academy"
                width={1600}
                height={1200}
                className="aspect-5/4 w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 shadow-elevated border border-border">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Top JAMB 2025</p>
                <p className="text-base font-bold">Aisha Bello · 342</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 rounded-2xl bg-card border border-border shadow-card p-6 md:p-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-display font-bold text-foreground">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Why Benzene Plus
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Built for Nigerian scholars, by educators who&apos;ve done it.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: BookOpen,
              title: "Structured curriculum",
              text: "Subject-by-subject coverage mapped directly to the JAMB & WAEC syllabus.",
            },
            {
              icon: ShieldCheck,
              title: "Proven track record",
              text: "312+ top scorers, 96% pass rate — published with student names every year.",
            },
            {
              icon: Users,
              title: "Small focused classes",
              text: "Capped sessions so every student gets personal attention and feedback.",
            },
            {
              icon: Trophy,
              title: "Weekly mock CBT",
              text: "Computer-based practice that mirrors the exact JAMB exam environment.",
            },
            {
              icon: Calendar,
              title: "Flexible schedules",
              text: "Weekday, weekend, and holiday intensives to fit your school calendar.",
            },
            {
              icon: CheckCircle2,
              title: "Parent reporting",
              text: "Monthly performance reports sent directly to parents and guardians.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Programs
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">
                Choose your exam path
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROGRAMS.map((p) => (
              <div
                key={p.code}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col"
              >
                <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary">
                  {p.code}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.blurb}
                </p>
                <dl className="mt-5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Schedule</dt>
                    <dd className="font-medium">{p.schedule}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">{p.duration}</dd>
                  </div>
                </dl>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=I'd%20like%20to%20register%20for%20${encodeURIComponent(p.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all"
                >
                  Register <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP SCORERS PREVIEW */}
      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Top scorers
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              47 students scored above 300 in JAMB 2025.
            </h2>
          </div>
          <Link
            href="/top-scorers"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            View all scorers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCORERS.slice(0, 4).map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow"
            >
              <div className="aspect-4/5 gradient-hero relative">
                <div className="absolute inset-0 grid place-items-center text-5xl font-display font-bold text-white/85">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold tracking-wider text-accent-foreground">
                  {s.exam}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold">{s.name}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-display font-bold text-primary">
                    {s.score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-20 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
            <Image
              src={celebrateImg}
              alt="Students celebrating success"
              width={1200}
              height={900}
              loading="lazy"
              className="relative rounded-3xl shadow-elevated aspect-4/3 object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              What our families are saying
            </h2>
            <div className="mt-8 space-y-4">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.author}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-foreground leading-relaxed">
                    &quot;{t.quote}&quot;
                  </blockquote>
                  <figcaption className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {t.author}
                    </span>{" "}
                    · {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="container-page py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Latest
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Announcements & study tips
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            All posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {POSTS.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              href="/blog/$slug"
              params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow"
            >
              <div className="aspect-video bg-secondary relative overflow-hidden">
                <Image
                  src={tutorImg}
                  alt=""
                  loading="lazy"
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-14 text-primary-foreground">
          <div className="absolute inset-0 bg-grid-fade opacity-20" />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to start your success story?
              </h2>
              <p className="mt-3 max-w-xl text-white/80">
                Join hundreds of families who trust Benzene Plus to prepare
                their children for the exams that matter most.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground shadow-elevated hover:bg-accent/90"
              >
                Register Now
              </a>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 border border-white/25 px-7 text-sm font-semibold text-white hover:bg-white/15"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
