
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
    try {
        const { ownerId, name, breed, age } = await req.json();

        if (!ownerId || !name || !breed || !age) {
            return NextResponse.json({
                error: "All fields are required"
            }, {
                status: 400
            });
        }

        const newPet = await prisma.pet.create({
            data: {
                ownerId:Number(ownerId),
                name,
                breed,
                age,
                status: "AVAILABLE" 
            },
        });

        return NextResponse.json({
            message: "Pet added successfully",
            pet: newPet
        }, {
            status: 201
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function GET() {
    try {
        const pets = await prisma.pet.findMany({ where: { status: "AVAILABLE" } });
        return NextResponse.json(pets, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
