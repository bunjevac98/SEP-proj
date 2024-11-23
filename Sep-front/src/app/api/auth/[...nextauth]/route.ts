import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { User } from "lib/lib/objects";
import { authOptions } from "lib/lib/authOptions";



const handler = NextAuth(authOptions);

// Export NextAuth handler
export { handler as GET, handler as POST }

