import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware Denger.in
 *
 * Autentikasi menggunakan JWT dan HttpOnly refresh token.
 * Cookie legacy dia_session dan dia_role tidak digunakan.
 *
 * Middleware ini tidak melakukan autentikasi server-side.
 * Backend wajib memvalidasi JWT dan role pada endpoint API.
 */
export function middleware(_request: NextRequest) {
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
