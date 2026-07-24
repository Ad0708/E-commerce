// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Decode JWT payload on the edge
// function decodeToken(token: string) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     const parsed = JSON.parse(jsonPayload);

//     // Check expiry
//     if (parsed.exp && Date.now() / 1000 > parsed.exp) {
//       return null;
//     }

//     return parsed;
//   } catch {
//     return null;
//   }
// }

// export default function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;
//   // console.log("Middleware: Token found:", token);

//   // Public routes
//   const publicRoutes = ["/login", "/signup", "/forgot-password"];
//   const isPublicRoute = publicRoutes.includes(pathname);

//   // Admin routes
//   const isAdminRoute = pathname.startsWith("/admin");

//   // ==========================================
//   // PUBLIC ROUTES
//   // ==========================================
//   if (isPublicRoute) {
//     if (token) {
//       const decoded = decodeToken(token);

//       if (decoded?.role === "admin") {
//         return NextResponse.redirect(new URL("/admin", request.url));
//       }

//       if (decoded?.role === "customer") {
//         return NextResponse.redirect(new URL("/home", request.url));
//       }
//     }

//     return NextResponse.next();
//   }

//   // ==========================================
//   // ADMIN ROUTES
//   // ==========================================
//   if (isAdminRoute) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     const decoded = decodeToken(token);

//     if (decoded?.role === "customer") {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }

//     if (!decoded || decoded.role !== "admin") {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     return NextResponse.next();
//   }

//   // ==========================================
//   // USER / PROTECTED ROUTES
//   // ==========================================

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const decoded = decodeToken(token);

//   if (!decoded) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decode JWT payload on the edge
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
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
  const token = request.cookies.get("token")?.value;

  // Public routes
  const publicRoutes = ["/login", "/signup", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  if (isPublicRoute) {
    if (token) {
      const decoded = decodeToken(token);

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
  // ADMIN ROUTES
  // ==========================================
  if (isAdminRoute) {
    if (!token) {
      return redirectToLogin(request);
    }

    const decoded = decodeToken(token);

    if (decoded?.role === "customer") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (!decoded || decoded.role !== "admin") {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  }

  // ==========================================
  // USER / PROTECTED ROUTES
  // ==========================================
  if (!token) {
    return redirectToLogin(request);
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
