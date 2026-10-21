import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get("dia_role")?.value; // "mahasiswa" | "psikolog" | "admin"
  const sessionToken = request.cookies.get("dia_session")?.value;

  // Protected paths
  const isPsikologRoute = pathname.startsWith("/psikolog");
  const isAdminRoute = pathname.startsWith("/admin");
  const isMahasiswaRoute =
    pathname.startsWith("/konseling") ||
    pathname.startsWith("/cek-mandiri") ||
    pathname.startsWith("/curhat") ||
    pathname.startsWith("/circle") ||
    pathname.startsWith("/sumber-daya") ||
    pathname.startsWith("/genta") ||
    pathname.startsWith("/akun");

  // Admin access gate
  if (isAdminRoute) {
    if (!sessionToken || userRole !== "admin") {
      const loginUrl = new URL("/staf/masuk", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Psychologist access gate
  if (isPsikologRoute) {
    if (!sessionToken || (userRole !== "psikolog" && userRole !== "admin")) {
      const loginUrl = new URL("/staf/masuk", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Student access gate (if protected subpaths)
  if (isMahasiswaRoute && !sessionToken && process.env.NODE_ENV === "production") {
    const loginUrl = new URL("/masuk", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/psikolog/:path*",
    "/admin/:path*",
    "/konseling/:path*",
    "/cek-mandiri/:path*",
    "/curhat/:path*",
    "/circle/:path*",
    "/sumber-daya/:path*",
    "/genta/:path*",
    "/akun/:path*",
  ],
};
