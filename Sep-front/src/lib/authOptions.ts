import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { User } from "lib/lib/objects";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API
    : process.env.NEXT_PUBLIC_PROD_API;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(`${apiUrl}/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                        authType: "basic"
                    });
                    const user = response.data as User;
                    if (!user) return null;
                    return user;
                } catch (error: any) {
                    console.error("Login error:", error?.response?.data);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: User | null }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.userType = user.userType;
                token.token = user.token;
                token.expires = user.expires;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: any }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    firstName: token.firstName as string,
                    lastName: token.lastName as string,
                    userType: token.userType as string,
                    token: token.token as string,
                    expires: token.expires as string,
                    role: token.role as string
                };
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 10800, // Adjust as needed
    },
    pages: {
        signOut:'/login',
        signIn: '/login',
        error: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set correctly
};
