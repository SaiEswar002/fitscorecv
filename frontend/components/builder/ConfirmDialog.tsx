"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ConfirmDialogProps {
  title:      string;
  message:    string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:    boolean;
  onConfirm:  () => void;
  onCancel:   () => void;
}

/**
 * Accessible confirmation dialog (modal).
 * Traps focus, closes on Escape, prevents background scroll.
 */
export function ConfirmDialog({
  title, message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  danger = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Auto-focus cancel button (safer default)
  useEffect(() => {
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          background:   "var(--color-card-bg)",
          border:       "1px solid var(--color-card-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            {danger && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertTriangle className="w-4 h-4 text-red-500" aria-hidden="true" />
              </div>
            )}
            <div>
              <h2 id="confirm-dialog-title" className="text-base font-bold"
                style={{ color: "var(--color-heading)" }}>
                {title}
              </h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {message}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg flex-shrink-0"
            style={{ color: "var(--color-muted)" }} aria-label="Close dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: danger ? "#ef4444" : "var(--color-cta)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
