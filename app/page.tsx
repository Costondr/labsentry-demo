"use client";
import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <Demo />
      <CTA />
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
        <a href="#request-access" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition">
          Request Access
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Built for Veterinary Diagnostic Labs
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Stop chasing spreadsheets.<br />
          <span className="text-emerald-400">Start catching drift.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          LabSentry monitors your QC in real time — Levy-Jennings charts, 6 Westgard rules, 
          corrective action workflows, and audit trails — so you catch instrument problems 
          before they reach a patient sample.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#walkthrough" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition text-lg">
            See How It Works
          </a>
          <a href="#request-access" className="border border-slate-600 hover:border-slate-400 text-slate-300 px-8 py-3 rounded-lg transition text-lg">
            Request Access
          </a>
        </div>
      </div>
    </section>
  );
}

function Problems() {
  const problems = [
    { icon: "📋", title: "Manual QC Logs", desc: "3-5 hours/week on paper or spreadsheets that no one wants to audit" },
    { icon: "⏰", title: "Delayed Detection", desc: "Instrument drift goes unnoticed for days — caught at inspection, not in real time" },
    { icon: "😰", title: "Audit Anxiety", desc: "Scrambling to compile documentation when accreditation review comes around" },
    { icon: "🔄", title: "No Corrective Action Trail", desc: "When QC fails, there's no standardized workflow or sign-off process" },
  ];
  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Sound familiar?</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Most vet diagnostic labs run QC the same way they did 20 years ago. It works — until it doesn&apos;t.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "📈",
      title: "Levy-Jennings Charts",
      desc: "Real-time L-J charts for every instrument. See trends before they become problems. Color-coded by Westgard rule violations."
    },
    {
      icon: "🛡️",
      title: "6 Westgard Rules",
      desc: "1-2s, 1-3s, 2-2s, R-4s, 4-1s, 10x — all monitored automatically. Flags appear the moment a rule breaks."
    },
    {
      icon: "🚩",
      title: "Corrective Action Workflows",
      desc: "When QC fails, LabSentry generates a corrective action with two-party sign-off. Director approval clears the flag."
    },
    {
      icon: "📝",
      title: "Immutable Audit Trail",
      desc: "Every QC entry, every flag, every corrective action — timestamped and tamper-proof. Pull your full history in one click."
    },
    {
      icon: "🔔",
      title: "Real-Time Notifications",
      desc: "Instant alerts when instruments flag. Per-instrument alert history so nothing falls through the cracks."
    },
    {
      icon: "📊",
      title: "Instrument Dashboard",
      desc: "Status cards for every analyzer. Green/yellow/red at a glance. Know your lab's health in 5 seconds."
    },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">What LabSentry Does</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Everything you need for QC compliance — nothing you don&apos;t.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Add Your Instruments", desc: "Chemistry, hematology, urinalysis — add each analyzer in 30 seconds." },
    { num: "02", title: "Enter QC Results", desc: "Log your daily QC. LabSentry plots L-J charts and checks Westgard rules instantly." },
    { num: "03", title: "Get Alerted", desc: "When a rule breaks, you know immediately. Not next week. Not at inspection." },
    { num: "04", title: "Resolve & Document", desc: "Corrective action workflow with sign-off. Audit trail writes itself." },
  ];
  return (
    <section id="walkthrough" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="text-emerald-400 text-2xl font-bold w-12 shrink-0">{s.num}</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">See It In Action</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          A quick look at the LabSentry dashboard, L-J charts, and corrective action workflow.
        </p>
        <div className="space-y-8">
          <DemoCard
            title="Instrument Dashboard"
            desc="Every analyzer at a glance. Green means QC is passing. Yellow means watch. Red means act now."
            color="emerald"
          />
          <DemoCard
            title="Levy-Jennings Chart"
            desc="Real-time QC plotted against your mean and SD. Westgard violations highlighted automatically with color-coded markers."
            color="blue"
          />
          <DemoCard
            title="Corrective Action Workflow"
            desc="When a rule breaks, document what happened, what you did, and get director sign-off — all in one screen."
            color="amber"
          />
          <DemoCard
            title="Audit Trail"
            desc="Every QC entry, every flag, every corrective action. Timestamped, immutable, export-ready for inspections."
            color="purple"
          />
        </div>
      </div>
    </section>
  );
}

function DemoCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    blue: "border-blue-500/30 bg-blue-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  };
  return (
    <div className={`border rounded-2xl p-8 ${colors[color]}`}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-slate-400">{desc}</p>
        </div>
        <div className="w-full md:w-96 h-48 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 border border-slate-700">
          Screenshot coming soon
        </div>
      </div>
    </div>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [lab, setLab] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lab }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error === "invalid_email"
            ? "Please check your email address and try again."
            : "Something went wrong and your request wasn't saved."
        );
      }
    } catch {
      setError("We couldn't reach the server, so your request wasn't sent.");
    }
    setSending(false);
  }

  return (
    <section id="request-access" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to see LabSentry in your lab?</h2>
        <p className="text-slate-400 mb-8">
          We&apos;re onboarding labs one at a time to make sure the experience is right. 
          Drop your info and we&apos;ll reach out within 24 hours.
        </p>
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-emerald-400 font-semibold text-lg">We got it. Talk soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Lab or practice name"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Request Early Access"}
            </button>
            {error && (
              <p role="alert" className="text-red-400 text-sm">
                {error} You can also email{" "}
                <a href="mailto:Diano.C@thecostongroup.com?subject=LabSentry%20access%20request" className="underline">
                  Diano.C@thecostongroup.com
                </a>{" "}
                directly.
              </p>
            )}
            <p className="text-slate-500 text-sm">No spam. No sales calls. Just a conversation about your QC workflow.</p>
            <p className="text-slate-600 text-xs">We store your lab name and email only to follow up about LabSentry, and never share them.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <div>© 2026 The Coston Group, Inc. All rights reserved.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span>LabSentry is a product of <a href="https://costonai.com" className="text-slate-400 hover:text-white">COAI</a></span>
        </div>
      </div>
    </footer>
  );
}
