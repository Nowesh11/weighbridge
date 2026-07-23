import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Single shared login for the ticket counter. The username/password live in
// .env — change APP_USERNAME / APP_PASSWORD there any time. If you later
// need individually named logins, swap this provider's `authorize` function
// for a lookup against a Prisma `User` table instead.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validUsername = process.env.APP_USERNAME;
        const validPassword = process.env.APP_PASSWORD;

        if (!validUsername || !validPassword) {
          throw new Error("Server is missing APP_USERNAME / APP_PASSWORD in .env");
        }

        if (
          credentials?.username === validUsername &&
          credentials?.password === validPassword
        ) {
          return { id: "counter-user", name: credentials.username };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.name as string;
      return session;
    },
  },
};
