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

// Admin emails
export const adminEmails = ["aa_boucharbat@estin.dz"].map((email) =>
  email.toLowerCase()
);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Optional: restrict to ESTIN emails only
      // return user.email.toLowerCase().endsWith("@estin.dz");

      return true;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();

        token.email = email;
        token.isAdmin = adminEmails.includes(email);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin ?? false;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};  