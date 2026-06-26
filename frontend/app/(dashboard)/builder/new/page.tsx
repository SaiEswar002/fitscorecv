import { redirect } from "next/navigation";
import { createNewResume } from "@/lib/actions/resume";

/**
 * /builder/new — Always creates a genuinely blank resume.
 * Unlike /builder (which opens the last resume), this always starts fresh.
 */
export default async function NewResumePage() {
  let id: string;
  try {
    id = await createNewResume();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("schema cache") || message.includes("does not exist")) {
      redirect("/builder"); // shows the setup guide
    }
    redirect("/dashboard");
  }
  redirect(`/builder/${id}`);
}
