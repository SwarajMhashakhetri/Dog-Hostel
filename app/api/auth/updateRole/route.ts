import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { newRole } = await req.json();
        if (!["OWNER", "LENDER"].includes(newRole)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: { role: newRole },
        });

        return NextResponse.json({ message: "Role updated successfully", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
