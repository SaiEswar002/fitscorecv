import { notFound } from "next/navigation";
import { getResume } from "@/lib/actions/resume";
import { BuilderShell } from "@/components/builder/BuilderShell";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resume = await getResume(id);
  return {
    title: resume ? `${resume.title} — Resume Builder` : "Resume Builder",
  };
}

/**
 * /builder/[id] — Resume editor page.
 * Server Component: fetches resume server-side, passes to client BuilderShell.
 */
export default async function BuilderPage({ params }: Props) {
  const { id } = await params;
  const resume = await getResume(id);

  if (!resume) notFound();

  return <BuilderShell resume={resume} />;
}
