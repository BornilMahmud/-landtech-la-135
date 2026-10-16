"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Banknote,
  Building2,
  CheckCircle2,
  Database,
  FileText,
  Gavel,
  Landmark,
  Layers,
  Map,
  MapPin,
  Phone,
  Mail,
  Scale,
  Search,
  ShieldCheck,
  FlaskConical,
  Accessibility,
  Cloud,
  type LucideIcon,
} from "lucide-react";

/* ---------- content ---------- */

const NODES = [
  { short: "MinLand", full: "Ministry of Land" },
  { short: "IGLR", full: "Directorate of Registration" },
  { short: "DLRS", full: "Land Records & Surveys" },
  { short: "BCC", full: "Bangladesh Computer Council" },
  { short: "BB", full: "Bangladesh Bank" },
];

const MODULES: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Sub-Registrar deed registration", href: "#sub-registrar", icon: FileText },
  { label: "AC Land automated e-Mutation", href: "#ac-land", icon: Building2 },
  { label: "Citizen khatian & ledger search", href: "#citizen", icon: Search },
  { label: "Bank mortgage & court lien check", href: "#bank-judiciary", icon: Banknote },
  { label: "DLRS cadastral mouza GIS", href: "#mouza-map", icon: Map },
  { label: "Consensus tamper simulation lab", href: "#tamper-test", icon: FlaskConical },
];

const LAWS = [
  { label: "SAT Act, 1950", note: "Section 143B mutual mutation mandate", href: "#" },
  { label: "The Registration Act, 1908", note: "Sub-registry deed validation standards", href: "#" },
  { label: "Land Crime Prevention Act, 2023", note: "Anti-fraud and double-sale enforcement", href: "#" },
  { label: "Digital Security Standards", note: "SHA-256 cryptographic plot escrow protocol", href: "#" },
];

const AGENCIES = [
  { label: "Ministry of Land (MinLand)", href: "#" },
  { label: "Directorate of Registration (IGLR)", href: "#" },
  { label: "Directorate of Land Records & Surveys (DLRS)", href: "#" },
  { label: "Bangladesh Computer Council (BCC)", href: "#" },
  { label: "Bangladesh Bank (Financial Interoperability)", href: "#" },
  { label: "Judicial Land Survey Tribunal", href: "#" },
];

const GUARANTEES = [
  "Zero-touch mutation automation",
  "Cryptographic parcel escrow",
  "Immutable audit ledger",
];

/* ---------- small pieces ---------- */

function ColumnTitle({ icon: Icon, children, id }: { icon: LucideIcon; children: React.ReactNode; id: string }) {
  return (
    <h3 id={id} className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
      <Icon className="h-4 w-4 text-emerald-300" aria-hidden />
      {children}
    </h3>
  );
}

const linkBase =
  "rounded-sm text-[#C9DCD1] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300";

/* ---------- component ---------- */

export interface FooterProps {
  logoSrc?: string;
  onSelectRole?: (id: any) => void;
  onGoHome?: () => void;
}

export default function Footer({
  logoSrc = "/logo.png",
  onSelectRole,
  onGoHome,
}: FooterProps) {
  const handleModuleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "");
      const roleKey = targetId.replace("-", "_");
      const targetEl =
        document.getElementById(targetId) ||
        document.getElementById(`role-${targetId}`) ||
        document.getElementById(`role-${roleKey}`);

      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        onSelectRole?.(roleKey);
      }
    }
  };

  const handleScrollTop = () => {
    if (onGoHome) {
      onGoHome();
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#072A20] text-[#C9DCD1]" aria-label="SmartBhoomi site footer">
      {/* flag-coloured hairline: green field, red disc */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />

      {/* ---------- consensus ledger strip (the one memorable element) ---------- */}
      <section
        aria-labelledby="ledger-heading"
        className="border-b border-white/10 bg-[#0B3428]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:gap-12 lg:px-10">
          <div className="shrink-0">
            <h2 id="ledger-heading" className="text-sm font-semibold text-white">
              Consensus ledger
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-emerald-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              5 of 5 nodes in sync
            </p>
          </div>

          {/* node rail */}
          <ol className="relative grid flex-1 grid-cols-5 gap-2" aria-label="Validation nodes">
            <span
              aria-hidden
              className="absolute left-[10%] right-[10%] top-[9px] h-px bg-gradient-to-r from-emerald-400/20 via-emerald-400/70 to-emerald-400/20"
            />
            {NODES.map((n) => (
              <li key={n.short} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-[19px] w-[19px] items-center justify-center rounded-full border border-emerald-400/70 bg-[#0B3428]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="mt-2 text-xs font-semibold text-white">{n.short}</span>
                <span className="hidden text-[11px] leading-tight text-[#9DB8AB] sm:block">{n.full}</span>
                <span className="sr-only"> validated</span>
              </li>
            ))}
          </ol>

          <p className="shrink-0 font-mono text-xs text-[#9DB8AB] lg:text-right">
            Ledger head <span className="text-emerald-200">9f3a…c71e</span>
            <br />
            SHA-256 · Byzantine consensus
          </p>
        </div>
      </section>

      {/* ---------- main ---------- */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <div
              onClick={handleScrollTop}
              className="flex items-center gap-4 cursor-pointer group select-none"
            >
              <Image
                src={logoSrc}
                alt="SmartBhoomi logo"
                width={56}
                height={56}
                className="rounded-xl bg-white p-1 transition-transform group-hover:scale-105"
              />
              <div>
                <p className="text-xl font-semibold leading-tight text-white group-hover:text-emerald-200 transition-colors">
                  SmartBhoomi
                </p>
                <p lang="bn" className="text-base leading-tight text-emerald-200">
                  স্মার্ট ভূমি
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Ministry of Land &amp; Directorate of Registration, Government of Bangladesh.
              A zero-touch pipeline that turns a registered deed into an updated khatian,
              checked by five agencies at once.
            </p>

            <address className="mt-6 flex items-start gap-2 text-sm not-italic text-[#9DB8AB]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Bangladesh Secretariat, Dhaka-1000
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:16122"
                className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                <Phone className="h-4 w-4 text-emerald-300" aria-hidden />
                <span className="leading-tight">
                  <span className="block text-xs text-[#9DB8AB]">Helpline</span>
                  <span className="text-lg font-semibold tracking-wide text-white">16122</span>
                </span>
              </a>
              <a
                href="mailto:support@smartbhoomi.gov.bd"
                className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                <Mail className="h-4 w-4 text-emerald-300" aria-hidden />
                <span className="leading-tight">
                  <span className="block text-xs text-[#9DB8AB]">Email support</span>
                  <span className="text-sm font-medium text-white">support@smartbhoomi.gov.bd</span>
                </span>
              </a>
            </div>
          </div>

          {/* link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            <nav aria-labelledby="f-modules">
              <ColumnTitle id="f-modules" icon={Layers}>Engine modules</ColumnTitle>
              <ul className="space-y-3 text-sm">
                {MODULES.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={(e) => handleModuleClick(e, href)}
                      className={`${linkBase} flex items-start gap-2.5`}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#7FA391]" aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="f-legal">
              <ColumnTitle id="f-legal" icon={Scale}>Legal and regulatory</ColumnTitle>
              <ul className="space-y-4 text-sm">
                {LAWS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={`${linkBase} block font-medium text-white`}>
                      {l.label}
                    </Link>
                    <span className="mt-0.5 block text-xs leading-snug text-[#9DB8AB]">{l.note}</span>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="f-agencies">
              <ColumnTitle id="f-agencies" icon={Landmark}>Integrated agencies</ColumnTitle>
              <ul className="space-y-3 text-sm">
                {AGENCIES.map((a) => (
                  <li key={a.label}>
                    <Link href={a.href} className={`${linkBase} flex items-start gap-2.5`}>
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
                      {a.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* guarantees */}
        <ul className="mt-12 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-3">
          {GUARANTEES.map((g) => (
            <li key={g} className="flex items-center gap-2.5 text-sm text-white">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- bottom bar ---------- */}
      <div className="border-t border-white/10 bg-[#051F17]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 text-xs lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="space-y-1">
            <p>
              © 2026 SmartBhoomi (<span lang="bn">স্মার্ট ভূমি</span>), Government of Bangladesh.
            </p>
            <p className="text-[#7FA391]">LandTech 2026, Track P4. All data shown is synthetic.</p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#9DB8AB]">
            <li className="flex items-center gap-1.5"><Cloud className="h-3.5 w-3.5 text-emerald-300" aria-hidden /> Gov-Cloud</li>
            <li className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-sky-300" aria-hidden /> Synthetic prototype</li>
            <li className="flex items-center gap-1.5"><Accessibility className="h-3.5 w-3.5 text-amber-300" aria-hidden /> WCAG 2.2</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden /> SHA-256 escrow</li>
          </ul>

          <button
            type="button"
            onClick={handleScrollTop}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#072A20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 lg:self-auto cursor-pointer"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
