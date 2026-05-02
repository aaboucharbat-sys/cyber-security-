import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID_FALLBACK =
  "728490222904-90g1o7uhuprl4gjkrpas02u9acms7qps.apps.googleusercontent.com";

export const adminEmails = ["admin@estin"];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID_FALLBACK,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user.email?.toLowerCase().endsWith("@estin");
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
