import { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import bcrypt from "bcrypt";

interface CredentialsType {
  name?: string;
  email: string;
  password: string;
}

interface CustomUser extends User {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
}

interface CustomToken extends JWT {
  id: string;
  email: string;
  role: Role;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Your Name" },
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: CredentialsType | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password } = credentials;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          if (isPasswordValid) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
            };
          } else {
            throw new Error("Invalid password");
          }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          const newUser = await prisma.user.create({
            data: {
              name: credentials.name || '',
              email,
              password: hashedPassword,
              role: "OWNER",
            },
          });

          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          };
        } catch (error) {
          console.error("Error creating user:", error);
          throw new Error("Failed to create user");
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.email = customUser.email;
        token.role = customUser.role || "OWNER";
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: CustomToken }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: Role;
  }
}