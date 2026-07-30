import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decode JWT payload on the edge
function decodeToken(auth_token: string) {
  try {
    const base64Url = auth_token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const parsed = JSON.parse(jsonPayload);

    if (parsed.exp && Date.now() / 1000 > parsed.exp) {
      return null;
    } 

    return parsed;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  const response = NextResponse.redirect(loginUrl);

  const source = request.nextUrl.searchParams.get("utm_source");
  const medium = request.nextUrl.searchParams.get("utm_medium");
  const campaign = request.nextUrl.searchParams.get("utm_campaign");

  if (source || medium || campaign) {
    response.cookies.set(
      "marketing",
      JSON.stringify({
        source: source || "Direct",
        medium: medium || "",
        campaign: campaign || "",
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    );
  }

  return response;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth_token = request.cookies.get("auth_token")?.value;

  // Auth routes (redirect logged-in users away)
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Publicly accessible store pages for guests
  const guestAllowedRoutes = [
    "/home",
    "/products",
    "/customer-support",
    "/maintenance",
  ];
  const isGuestAllowed =
    guestAllowedRoutes.includes(pathname) || pathname.startsWith("/product/");

  // Protected user pages requiring login
  const protectedRoutes = [
    "/cart",
    "/wishlist",
    "/checkout",
    "/orders",
    "/profile",
    "/settings",
    "/wallet",
    "/refunds",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // ==========================================
  // AUTH ROUTES (/login, /signup, etc.)
  // ==========================================
  if (isAuthRoute) {
    if (auth_token) {
      const decoded = decodeToken(auth_token);

      if (decoded?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (decoded?.role === "customer") {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }

    return NextResponse.next();
  }

  // ==========================================
  // ADMIN ROUTES (/admin/*)
  // ==========================================
  if (isAdminRoute) {
    if (!auth_token) {
      return redirectToLogin(request);
    }

    const decoded = decodeToken(auth_token);

    if (decoded?.role === "customer") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (!decoded || decoded.role !== "admin") {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }

  // ==========================================
  // PUBLIC STORE PAGES (/home, /products, /product/*)
  // ==========================================
  if (isGuestAllowed) {
    return NextResponse.next();
  }

  // ==========================================
  // PROTECTED USER ROUTES (/cart, /wishlist, /checkout, etc.)
  // ==========================================
  if (isProtectedRoute) {
    if (!auth_token) {
      return redirectToLogin(request);
    }

    const decoded = decodeToken(auth_token);

    if (!decoded) {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
