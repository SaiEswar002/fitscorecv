"use client";

import Link from "next/link";

// Brand icons as inline SVGs (lucide-react removed brand icons in v0.441+)
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href: string }>;
}

// ── Footer Data ───────────────────────────────────────────────────────────────

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Resume Builder", href: "/builder" },
      { label: "ATS Checker", href: "/ats" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "API", href: "/api" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    icon: TwitterIcon,
    href: "https://twitter.com/fitscorecv",
    label: "Follow FitScoreCV on Twitter",
  },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/company/fitscorecv",
    label: "Follow FitScoreCV on LinkedIn",
  },
  {
    icon: GithubIcon,
    href: "https://github.com/fitscorecv",
    label: "FitScoreCV on GitHub",
  },
];

// ── Logo ──────────────────────────────────────────────────────────────────────

function FooterLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1 select-none mb-3"
      aria-label="FitScoreCV Home"
    >
      <span className="text-lg font-black tracking-tight text-white">FitScore</span>
      <span
        className="text-lg font-black tracking-tight px-1 py-0.5 rounded"
        style={{
          color: "#ffffff",
          background: "var(--color-cta)",
          lineHeight: 1,
        }}
      >
        CV
      </span>
    </Link>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{ background: "var(--color-footer-bg)" }}
      role="contentinfo"
    >
      {/* CSS hover styles */}
      <style>{`
        .footer-link {
          color: var(--color-footer-text);
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .footer-social-btn {
          background: rgba(255,240,196,0.08);
          border: 1px solid rgba(255,240,196,0.12);
          color: rgba(255,240,196,0.6);
          transition: all 0.2s ease;
        }
        .footer-social-btn:hover {
          background: var(--color-cta);
          border-color: var(--color-cta);
          color: #ffffff;
          transform: translateY(-2px);
        }
        .footer-legal-link {
          color: rgba(255,240,196,0.4);
          transition: color 0.2s ease;
        }
        .footer-legal-link:hover {
          color: #ffffff;
        }
      `}</style>

      {/* Main footer content */}
      <div className="container-max px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <FooterLogo />
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--color-footer-text)" }}
            >
              Build Resumes.
              <br />
              Measure Your Fit.
              <br />
              Get Hired.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn w-9 h-9 rounded-lg flex items-center justify-center"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,240,196,0.5)" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label} role="listitem">
                    <Link
                      href={link.href}
                      className="footer-link text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,240,196,0.08)" }}
      >
        <div className="container-max px-4 md:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "rgba(255,240,196,0.4)" }}>
            © {currentYear} FitScoreCV. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="footer-legal-link text-xs"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
