import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
