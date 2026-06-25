import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase OAuth + Magic Link callback handler.
 *
 * Supabase redirects here after:
 *  - Google OAuth login
 *  - Email magic link / OTP
 *  - Password reset (email link)
 *
 * It exchanges the `code` query param for a session,
 * then redirects to the intended destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors from Supabase
  if (error) {
    console.error("Auth callback error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Prevent open redirects — only allow relative paths
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error("Code exchange error:", exchangeError.message);
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`
  );
}
