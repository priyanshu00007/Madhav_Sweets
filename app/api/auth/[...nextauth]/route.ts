import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
           console.warn(" [AUTH_SHIELD] Transmission missing mandatory credentials.");
           return null;
        }
        
        try {
          console.log(` [AUTH_SHIELD] Initiating terminal validation for: ${credentials.email}`);
          const users: any = await executeQuery('SELECT * FROM users WHERE email = ?', [credentials.email]);
          
          if (!users || users.length === 0) {
            console.warn(` [AUTH_SHIELD] Terminal ID not found: ${credentials.email}`);
            return null;
          }
          
          const user = users[0];
          console.log(` [AUTH_SHIELD] Protocol match found. Verifying secret key...`);
          const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
          
          if (!isMatch) {
            console.warn(` [AUTH_SHIELD] Secret key mismatch for terminal: ${credentials.email}`);
            return null;
          }
          
          console.log(` [AUTH_SHIELD] Validation Successful. Welcome elite member: ${user.name}`);
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.avatar_url,
            role: user.role,
          };
        } catch (error) {
          console.error(" [AUTH_CRITICAL] Terminal Access System Failure:", error);
          throw error; // Let NextAuth handle the 500 if it's a real crash
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
