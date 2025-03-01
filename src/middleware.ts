import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = ["/home", "/pricing", "/auth/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  try {
    if (token) {
      const { payload } = await jwtVerify(token, SECRET_KEY);

      // Cek apakah token masih valid berdasarkan expiry time
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      // Jika user sudah login, redirect dari /auth/login ke /home
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      const response = NextResponse.next();
      response.headers.set("x-username", payload.username as string);

      return response;
    }

    // Jika tidak ada token dan mengakses halaman yang dilindungi, redirect ke login
    if (isProtectedRoute) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.set("token", "", { path: "/", expires: new Date(0) }); // Hapus token jika ada
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.log("JWT verification failed", error);

    if (isProtectedRoute) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.set("token", "", { path: "/", expires: new Date(0) }); // Hapus token jika ada
      return response;
    }

    return NextResponse.next();
  }
}
