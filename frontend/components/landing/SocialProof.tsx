"use client";

// ── Company Logos (proper React SVG) ─────────────────────────────────────────

const COMPANY_NAMES = [
  "Google",
  "Microsoft",
  "Amazon",
  "TATA",
  "Infosys",
  "Accenture",
  "Meta",
  "Apple",
];

// Duplicate for infinite scroll
const LOGO_TRACK = [...COMPANY_NAMES, ...COMPANY_NAMES];

// ── Logo Item ─────────────────────────────────────────────────────────────────

function LogoItem({ name }: { name: string }) {
  return (
    <div
      className="social-proof-logo flex items-center justify-center px-8 flex-shrink-0"
      style={{ minWidth: "120px" }}
      title={name}
    >
      <span
        className="text-lg font-black tracking-tight select-none"
        style={{
          color: "var(--color-heading)",
          opacity: 0.4,
          letterSpacing: name === "TATA" ? "0.15em" : "-0.02em",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
        }}
      >
        {name}
      </span>
    </div>
  );
}

// ── Main Social Proof ─────────────────────────────────────────────────────────

export function SocialProof() {
  return (
    <section
      className="relative py-12 overflow-hidden"
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface-elevated)",
      }}
      aria-label="Trusted by leading companies"
    >
      {/* CSS for hover effect */}
      <style>{`
        .social-proof-logo:hover span {
          opacity: 0.8 !important;
        }
        .social-proof-logo {
          transition: opacity 0.2s ease;
        }
        @keyframes logo-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* Heading */}
      <div className="container-max px-4 md:px-6 text-center mb-8">
        <p
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-muted)" }}
        >
          Trusted by{" "}
          <span style={{ color: "var(--color-cta)" }}>50,000+</span>{" "}
          job seekers who landed roles at
        </p>
      </div>

      {/* Scrolling Logo Track */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
        role="list"
        aria-label="Company logos"
      >
        <div
          className="flex items-center"
          style={{
            animation: "logo-scroll 30s linear infinite",
            width: "max-content",
          }}
        >
          {LOGO_TRACK.map((name, idx) => (
            <LogoItem key={`${name}-${idx}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialProof;
