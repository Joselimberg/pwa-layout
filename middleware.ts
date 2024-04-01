export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/clientes/:path*",
    "/songs/:path*",
    "/api/auth/:path*",
    "/api/artist/:path*",
    "/api/song/:path*",
    // "/api/user/:path*",
  ],

};