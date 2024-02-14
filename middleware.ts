export { auth as middleware } from "auth"
export { default } from "next-auth/middleware"

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/dashboard"],
}
