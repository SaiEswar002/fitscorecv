import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FitScoreCV — Build Resumes. Measure Your Fit. Get Hired.",
  description:
    "FitScoreCV is the #1 ATS resume optimization platform. Create ATS-friendly resumes, analyze your job fit with AI-powered scoring, and get actionable insights to beat the competition and land more interviews.",
  keywords: [
    "ATS resume checker",
    "resume builder",
    "job fit score",
    "ATS optimization",
    "resume scanner",
    "career platform",
    "job application",
    "resume analysis",
  ],
  authors: [{ name: "FitScoreCV" }],
  creator: "FitScoreCV",
  openGraph: {
    title: "FitScoreCV — Build Resumes. Measure Your Fit. Get Hired.",
    description:
      "Create ATS-friendly resumes and get an instant ATS score. Join 50,000+ job seekers who improved their chances with FitScoreCV.",
    type: "website",
    locale: "en_US",
    siteName: "FitScoreCV",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitScoreCV — Build Resumes. Measure Your Fit. Get Hired.",
    description:
      "Create ATS-friendly resumes and get an instant ATS score. Join 50,000+ job seekers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
