import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize NextAuth handler
const handler = NextAuth(authOptions);

// Export handlers for App Router
export { handler as GET, handler as POST }; 