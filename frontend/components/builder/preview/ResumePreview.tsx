"use client";

import { useRef, useEffect, useState } from "react";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate }  from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import type { ResumeData, ResumeTemplate } from "@/lib/types/resume";

interface Props {
  data:     ResumeData;
  template: ResumeTemplate;
  /** Explicit zoom factor (0.5–1.25) or "fit" to auto-scale to pane width. */
  zoom?:    number | "fit";
}

const TEMPLATES = {
  classic: ClassicTemplate,
  modern:  ModernTemplate,
  minimal: MinimalTemplate,
} as const;

/** A4 paper dimensions at 96 dpi */
const A4_W = 794;
const A4_H = 1123;

/**
 * A4-proportioned live preview.
 * - zoom="fit" (default): ResizeObserver scales paper to fill pane width
 * - zoom=0.5…1.25: explicit scale factor
 */
export function ResumePreview({ data, template, zoom = "fit" }: Props) {
  const TemplateComponent = TEMPLATES[template] ?? ClassicTemplate;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.62);

  useEffect(() => {
    if (zoom !== "fit") return;

    function recalculate() {
      if (!wrapperRef.current) return;
      const availableWidth = wrapperRef.current.clientWidth - 32; // 16px padding each side
      const newScale = Math.min(availableWidth / A4_W, 1);
      setFitScale(parseFloat(newScale.toFixed(4)));
    }

    recalculate();
    const ro = new ResizeObserver(recalculate);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [zoom]);

  const scale = zoom === "fit" ? fitScale : zoom;

  return (
    <div
      ref={wrapperRef}
      id="resume-preview-wrapper"
      className="h-full overflow-y-auto"
      style={{
        background:     "var(--color-surface-elevated)",
        paddingTop:     "20px",
        paddingBottom:  "20px",
        paddingLeft:    "16px",
        paddingRight:   "16px",
        display:        "flex",
        justifyContent: "center",
        alignItems:     "flex-start",
      }}
    >
      {/* Scaled container — height matches the scaled A4 so scroll works correctly */}
      <div
        style={{
          width:      `${A4_W * scale}px`,
          height:     `${A4_H * scale}px`,
          flexShrink: 0,
          position:   "relative",
        }}
      >
        {/* A4 paper — scaled from top-left origin */}
        <div
          id="resume-preview"
          className="bg-white shadow-2xl overflow-hidden absolute top-0 left-0"
          style={{
            width:           `${A4_W}px`,
            minHeight:       `${A4_H}px`,
            transformOrigin: "top left",
            transform:       `scale(${scale})`,
          }}
        >
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}
