import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}) {
    try {
        const petId = Number((await params).id);
        const pet = await prisma.pet.findUnique({
            where: { id: petId }
        });

        if (!pet || pet.status !== 'LENT') {
            return NextResponse.json({ error: "Pet cannot be returned" }, { status: 400 });
        }

        const updatedPet = await prisma.pet.update({
            where: {
                id: petId
            },
            data: {
                lenderId: null,
                status: "AVAILABLE"
            },
        });

        return NextResponse.json({ message: "Pet returned successfully", pet: updatedPet }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
