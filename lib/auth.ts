import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}

const GOOGLE_CLIENT_ID_FALLBACK =
  "728490222904-90g1o7uhuprl4gjkrpas02u9acms7qps.apps.googleusercontent.com";

// Admin emails allowed
export const adminEmails = ["aa_boucharbat@estin.dz"].map((e) =>
  e.toLowerCase(),
);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID_FALLBACK,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Allow sign in only if email exists
    async signIn({ user }) {
      if (!user.email) return false;
      return true;
    },

    // Always redirect to home
    async redirect({ baseUrl }) {
      return baseUrl;
    },

    // Put data into JWT
    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();

        token.email = email;
        token.isAdmin = adminEmails.includes(email);
      }

      return token;
    },

    // Send data to client session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
