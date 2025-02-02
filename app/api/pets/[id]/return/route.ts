import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const petId = Number(params.id);

        const pet = await prisma.pet.update({
            where: {
                id: petId
            },
            data: {
                lenderId: null,
                status: "AVAILABLE"
            },
        });

        return NextResponse.json({ message: "Pet returned successfully", pet }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
