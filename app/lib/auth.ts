import prisma from "@/db"; 
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Your Name" },
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials : any) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

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
              name: credentials.name,
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
  secret: process.env.JWT_SECRET ,
  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token } :any) {
      session.user = {
        id: token.id,
        email :token.email,
        role: token.role, 
      };
      return session;
    },
  },
};
