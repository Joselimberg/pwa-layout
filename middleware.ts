export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/clientes/:path*",
    "/songs/:path*",
    "/api/:path*"
  ],

};