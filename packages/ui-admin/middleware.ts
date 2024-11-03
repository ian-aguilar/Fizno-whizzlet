import { NextResponse } from "next/server";

export function middleware(request: any) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const routeName = request.nextUrl.pathname;
  const publicRoutes = [
    "/",
    "/signin",
    "/forgot-password",
    "/verification-code",
    "/reset-password",
    "/verify-email",
  ];

  const isPublicRoute = Boolean(
    publicRoutes.find((item) => {
      return item === routeName;
    }),
  );
  if (!isPublicRoute && !accessToken && !refreshToken) {
    if (request.nextUrl.pathname === "/signin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  if (isPublicRoute && accessToken && refreshToken) {
    if (request.nextUrl.pathname === "/home") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!assets|_next/static|_next/image|favicon.ico|manifest.json|icon-[0-9]+x[0-9]+.png|favicon.svg|firebase-messaging-sw.js).*)",
  ],
};
