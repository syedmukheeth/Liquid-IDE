import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-black p-6 font-sans text-white/90 selection:bg-white/10 md:p-20">
      <div className="bg-mesh opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10">
              <ArrowLeft className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Terms of Service</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Last updated: April 2026</p>
            </div>
          </div>
          <FileText className="h-8 w-8 text-white/10" />
        </header>

        <section className="space-y-10 text-sm leading-relaxed text-white/60">
          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--sam-accent)]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SAM Compiler, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--sam-accent)]">2. Use of Service</h2>
            <p>
              SAM Compiler is a cloud-based development environment. You are responsible for all code executed via your account. Prohibited activities include, but are not limited to:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-white/40">
              <li>Using the platform for malware distribution or illegal activities.</li>
              <li>Attempting to breach the gVisor sandbox or backend clusters.</li>
              <li>Automated scraping or resource abuse.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--sam-accent)]">3. Intellectual Property</h2>
            <p>
              You retain ownership of the code you write in SAM. We do not claim any rights to your intellectual property. The platform interface, engine, and AI integration mechanisms remain the exclusive property of SAM Compiler.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--sam-accent)]">4. Liability & Accuracy</h2>
            <p>
              SAM Compiler provides AI-powered code analysis and real-time execution. We do not guarantee the accuracy of AI-generated refactors or the suitability of the execution output for production use. Use the service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--sam-accent)]">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or compromise system stability (e.g., persistent resource abuse).
            </p>
          </div>

          <div className="border-t border-white/5 pt-10">
            <p className="text-xs italic text-white/20 text-center">
              Questions regarding these terms should be sent to <span className="text-white/40 font-bold">compliance@sam-compiler.io</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
