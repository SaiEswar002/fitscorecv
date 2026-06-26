"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { ResumeData, ResumeTemplate } from "@/lib/types/resume";

interface Props {
  data: ResumeData;
  template: ResumeTemplate;
  title: string;
}

/**
 * PDF download button using @react-pdf/renderer.
 * Dynamically imports the PDF generator to avoid SSR issues (react-pdf is client-only).
 */
export function DownloadButton({ data, template, title }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      // Dynamic import to avoid SSR / build issues with react-pdf
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumePDF } = await import("./ResumePDF");
      const React = (await import("react")).default;

      const blob = await pdf(React.createElement(ResumePDF, { data, template, title })).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: "var(--color-cta)" }}
      aria-label="Download PDF"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="w-4 h-4" aria-hidden="true" />
      )}
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
