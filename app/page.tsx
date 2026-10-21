"use client";
import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />
      <Hero />
      <Exploring />
      <Conversation />
      <Contact />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold">LS</div>
          <span className="text-lg font-semibold">LabSentry</span>
        </div>
        <a href="#contact" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition text-sm md:text-base">
          Share your workflow
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Keep lab records organized. <span className="text-emerald-400">Make audit preparation easier.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          LabSentry is exploring a shared workspace for small to medium labs managing QC and
          maintenance in spreadsheets. We&apos;re speaking with lab staff about missing records,
          overdue tasks, and the scramble before audits.
        </p>
        <a href="#contact" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition text-lg">
          Share your lab&apos;s workflow
        </a>
      </div>
    </section>
  );
}

function Exploring() {
  const items = [
    {
      title: "Shared records",
      desc: "QC results, maintenance, calibration, and service history in one place your whole team can reach, not one person's spreadsheet.",
    },
    {
      title: "Clear follow-through",
      desc: "What needs attention, who owns it, and what was completed, so nothing depends on someone remembering.",
    },
    {
      title: "Retrievable history",
      desc: "Records for a review pulled together without searching spreadsheets, folders, and someone's memory.",
    },
  ];
  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">What we&apos;re exploring</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Many smaller labs keep QC and maintenance in spreadsheets, with one person holding the
          process together. We want to learn where that breaks down, and whether a shared workspace
          would help.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-slate-400 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Conversation() {
  const points = [
    "A 15–30 minute conversation, by phone or in writing, at a time that suits you.",
    "Questions about how your lab tracks QC and maintenance today, and what happens before an audit.",
    "No lab data or patient information requested. This is research, not a sales call.",
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Who we want to hear from</h2>
        <p className="text-slate-400 text-center mb-10">
          Lab managers, technologists, and technicians at small to medium clinical and veterinary
          labs. Service engineers who support these labs are welcome too.
        </p>
        <ul className="space-y-4">
          {points.map((p) => (
            <li key={p} className="flex gap-3 items-start">
              <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-300">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const inputClass =
  "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500";

function Contact() {
  const [form, setForm] = useState({ name: "", company: "", role: "", email: "", tracking: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error === "invalid_email"
            ? "Please check your email address and try again."
            : data?.error === "invalid_fields"
            ? "Please fill in your name, lab or organization, role, and email."
            : "Something went wrong and your message wasn't saved."
        );
      }
    } catch {
      setError("We couldn't reach the server, so your message wasn't saved.");
    }
    setSending(false);
  }

  return (
    <section id="contact" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Share your lab&apos;s workflow</h2>
        <p className="text-slate-400 mb-8">
          Leave your details and we&apos;ll reach out to set up a short conversation.
        </p>
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8">
            <p className="text-emerald-400 font-semibold text-lg">Thank you. We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input type="text" placeholder="Name" value={form.name} onChange={set("name")} required maxLength={120} autoComplete="name" className={inputClass} />
            <input type="text" placeholder="Lab or organization" value={form.company} onChange={set("company")} required maxLength={200} autoComplete="organization" className={inputClass} />
            <input type="text" placeholder="Role (for example, lab manager)" value={form.role} onChange={set("role")} required maxLength={120} autoComplete="organization-title" className={inputClass} />
            <input type="email" placeholder="Email" value={form.email} onChange={set("email")} required maxLength={254} autoComplete="email" className={inputClass} />
            <input type="text" placeholder="How do you track QC and maintenance today? (optional)" value={form.tracking} onChange={set("tracking")} maxLength={500} className={inputClass} />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Share your lab\u2019s workflow"}
            </button>
            {error && (
              <p role="alert" className="text-red-400 text-sm text-center">
                {error} You can also email{" "}
                <a href="mailto:Diano.C@thecostongroup.com?subject=LabSentry%20conversation" className="underline">
                  Diano.C@thecostongroup.com
                </a>{" "}
                directly.
              </p>
            )}
            <p className="text-slate-600 text-xs text-center">
              We store your details only to follow up about LabSentry, and never share them.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-2">
        <div>© 2026 The Coston Group, Inc. All rights reserved.</div>
        <div>LabSentry is a product of <a href="https://costonai.com" className="text-slate-400 hover:text-white">COAI</a></div>
      </div>
    </footer>
  );
}
