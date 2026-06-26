/**
 * Builder layout — overrides the dashboard's container padding.
 * The BuilderShell handles its own internal layout (sidebar + preview).
 */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
