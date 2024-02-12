import NextAuth from "next-auth"

import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

import type { NextAuthConfig, Session } from "next-auth"
import {JWT} from 'next-auth/jwt'

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    GitHub,
    Credentials({
      name: 'Credentials',
      // credentials: {
      //   username: { label: "Username", type: "text", placeholder: "jsmith" },
      //   email: { label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        // If no error and we have user data, return it
        if (res.ok && data.user) {
          return data.user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    async redirect({ url, baseUrl }) {
      return '/dashboard'
    },
    async session(session:Session, jwt:JWT){
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
