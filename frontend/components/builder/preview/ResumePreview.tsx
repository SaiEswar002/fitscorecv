"use client";

import { useRef, useEffect, useState } from "react";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import type { ResumeData, ResumeTemplate } from "@/lib/types/resume";

interface Props {
  data: ResumeData;
  template: ResumeTemplate;
}

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
} as const;

/** A4 paper dimensions at 96 dpi */
const A4_W = 794;
const A4_H = 1123;

/**
 * A4-proportioned live preview.
 * Dynamically calculates the scale so the paper always fills the pane width
 * (with 32px padding on each side) regardless of pane size.
 */
export function ResumePreview({ data, template }: Props) {
  const TemplateComponent = TEMPLATES[template] ?? ClassicTemplate;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);

  useEffect(() => {
    function recalculate() {
      if (!wrapperRef.current) return;
      const availableWidth = wrapperRef.current.clientWidth - 48; // 24px padding each side
      const newScale = Math.min(availableWidth / A4_W, 1);
      setScale(parseFloat(newScale.toFixed(4)));
    }

    recalculate();
    const ro = new ResizeObserver(recalculate);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="resume-preview-wrapper"
      className="flex justify-center overflow-y-auto h-full"
      style={{
        background: "#e2e8f0",
        paddingTop: "24px",
        paddingBottom: "24px",
      }}
    >
      {/* Outer container with correct scaled height so scrollbar works properly */}
      <div
        style={{
          width: `${A4_W}px`,
          height: `${A4_H * scale}px`,
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* A4 paper — scaled from top-left */}
        <div
          id="resume-preview"
          className="bg-white shadow-2xl overflow-hidden absolute top-0 left-0"
          style={{
            width: `${A4_W}px`,
            minHeight: `${A4_H}px`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}
