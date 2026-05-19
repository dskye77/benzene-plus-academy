"use client"
import { motion } from "framer-motion";
import { Target, Eye, Heart, Award } from "lucide-react";
import tutorImg from "@/assets/tutor-teaching.jpg";
import Image from "next/image";

const TEAM = [
  {
    name: "Mr. Adeyemi Okonkwo",
    role: "Founder · Mathematics",
    initials: "AO",
  },
  { name: "Mrs. Funmi Bakare", role: "Head Tutor · English", initials: "FB" },
  { name: "Dr. Ibrahim Sanni", role: "Physics Lead", initials: "IS" },
  { name: "Ms. Ngozi Eze", role: "Chemistry · Biology", initials: "NE" },
];

export default function About() {
  return (
    <>
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-grid-fade opacity-25" />
        <div className="relative container-page py-20 md:py-28">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            About us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl leading-[1.1]"
          >
            Built on 14 years of preparing Nigerian scholars to win.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-white/80 text-lg leading-relaxed"
          >
            Benzene Plus Academy was founded in 2012 with a single classroom and
            18 students. Today we are one of Nigeria&apos;s most trusted
            tutorial academies for JAMB, WAEC, NECO and Post-UTME — with
            thousands of graduates in universities across the country.
          </motion.p>
        </div>
      </section>

      <section className="container-page py-20 md:py-24 grid lg:grid-cols-2 gap-14 items-center">
        <Image
          src={tutorImg}
          alt=""
          loading="lazy"
          className="rounded-3xl shadow-elevated aspect-4/3 object-cover"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Our story
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            A small classroom. A bold promise.
          </h2>
          <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              What started in 2012 as evening classes in a borrowed schoolroom
              in Ibadan has grown into a full academy serving students across
              Oyo, Lagos and Ogun States.
            </p>
            <p>
              Our promise has never changed: structured teaching, honest
              reporting to parents, and relentless focus on the exam standards
              Nigerian students actually face.
            </p>
            <p>
              In 2025 alone, 47 of our students scored above 300 in JAMB and 89%
              of our WAEC candidates earned five credits including English and
              Mathematics on first sitting.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-24 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Target,
              title: "Mission",
              text: "To equip every Nigerian student with the skills, structure and confidence to excel in national examinations.",
            },
            {
              icon: Eye,
              title: "Vision",
              text: "To become West Africa's most trusted tutorial academy — defined by results, integrity and student outcomes.",
            },
            {
              icon: Heart,
              title: "Philosophy",
              text: "Teach to the standard, not below it. Every student is capable of excellence with the right structure.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl bg-card border border-border p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{b.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Our tutors
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Educators who&apos;ve been there.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every tutor at Benzene Plus has personally trained students to
            top-tier scores.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-hero text-2xl font-display font-bold text-primary-foreground">
                {t.initials}
              </div>
              <h3 className="mt-4 font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-3xl bg-card border border-border p-10 grid md:grid-cols-4 gap-6 text-center">
          {[
            { v: "14yrs", l: "Of operation" },
            { v: "4,200+", l: "Graduates" },
            { v: "312+", l: "Top scorers" },
            { v: "96%", l: "Success rate" },
          ].map((s) => (
            <div key={s.l}>
              <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-3xl font-display font-bold">{s.v}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
