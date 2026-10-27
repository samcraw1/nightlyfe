import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps the Supabase session cookie fresh and sends signed-out visitors of
 * /dashboard/* to the login page. Does nothing in demo mode (no Supabase).
 * Staff membership itself is checked server-side in requireStaff().
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || process.env.DIGITAL_STAGE_MODE === "demo") return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard") && path !== "/dashboard/login" && !data.user) {
    const login = new URL("/dashboard/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
