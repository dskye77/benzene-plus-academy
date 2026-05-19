"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin, Send } from "lucide-react";

import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-grid-fade opacity-25" />

        <div className="relative container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Contact us
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            We&apos;d love to hear from you.
          </h1>

          <p className="mt-5 max-w-2xl text-white/80 text-lg">
            Speak with our admissions team about programs, schedules and
            registration.
          </p>
        </div>
      </section>

      <section className="container-page py-16 grid lg:grid-cols-[1.1fr_1fr] gap-10">
        <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
          <h2 className="text-2xl font-bold">Send us a message</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We respond within 24 hours.
          </p>

          {sent ? (
            <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
              <p className="font-semibold text-primary">
                Thanks — your message is on its way.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-7 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" name="name" />

                <Field label="Phone" name="phone" type="tel" />
              </div>

              <Field label="Email" name="email" type="email" />

              <Field label="Subject" name="subject" />

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Message
                </label>

                <textarea
                  required
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
              >
                Send message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Phone,
              label: "Phone",
              value: SITE.phone,
              href: `tel:${SITE.phone}`,
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Chat with admissions",
              href: `https://wa.me/${SITE.whatsapp}`,
            },
            {
              icon: Mail,
              label: "Email",
              value: SITE.email,
              href: `mailto:${SITE.email}`,
            },
            {
              icon: MapPin,
              label: "Visit us",
              value: SITE.address,
            },
          ].map((c) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <c.icon className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>

                  <p className="font-semibold mt-0.5">{c.value}</p>
                </div>
              </>
            );

            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-card transition-shadow"
              >
                {inner}
              </a>
            ) : (
              <div
                key={c.label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
              >
                {inner}
              </div>
            );
          })}

          <div className="rounded-2xl overflow-hidden border border-border aspect-4/3">
            <iframe
              title="Benzene Plus Academy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d880.0367433525531!2d3.25819221631639!3d6.517067452690043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b855f1a53cc89%3A0x7edc781e949b3f26!2sBenzene%20Plus%20Tutorial!5e1!3m2!1sen!2sng!4v1779209372647!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0, width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold text-foreground">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required
        className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
