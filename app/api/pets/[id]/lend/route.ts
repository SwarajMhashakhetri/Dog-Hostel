import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import type { BookingStatus } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: NextRequest, { params }: { params:  Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    if (user.role !== "LENDER") {
      return NextResponse.json(
        {
          error: "Only users with LENDER role can lend pets",
        },
        { status: 403 }
      );
    }

    const petId = Number((await params).id); // 

    if (!petId || isNaN(petId)) {
      return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { owner: true },
    });

    if (!existingPet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    if (existingPet.status === "LENT") {
      return NextResponse.json({ error: "Pet is already lent" }, { status: 400 });
    }

    if (existingPet.ownerId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot lend your own pet",
        },
        { status: 400 }
      );
    }

    const pet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        lenderId: user.id,
        status: "LENT" as BookingStatus,
      },
      include: {
        owner: true,
        lender: true,
      },
    });

    return NextResponse.json(
      {
        message: "Pet lent successfully",
        pet,
      },
      { status: 200 }
    );
  } catch  {
    return NextResponse.json(
      {
        error: "Failed to process lending request",
      },
      { status: 500 }
    );
  }
}