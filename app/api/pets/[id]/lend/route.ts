import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import type { BookingStatus } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";

// Correct the context parameter typing
interface Context {
  params: { id: string };
}

export async function POST(req: NextRequest, context: Context) {
  try {
    console.log("Lend route called");

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user?.email) {
      console.log("Unauthorized: No valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User role:", user.role);

    if (user.role !== "LENDER") {
      console.log("User is not a LENDER");
      return NextResponse.json(
        {
          error: "Only users with LENDER role can lend pets",
        },
        { status: 403 }
      );
    }

    const petId = Number(context.params.id); // Updated this line

    if (!petId || isNaN(petId)) {
      console.log("Invalid pet ID");
      return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { owner: true },
    });

    if (!existingPet) {
      console.log("Pet not found");
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    if (existingPet.status === "LENT") {
      console.log("Pet is already lent");
      return NextResponse.json({ error: "Pet is already lent" }, { status: 400 });
    }

    if (existingPet.ownerId === user.id) {
      console.log("User trying to lend their own pet");
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

    console.log("Pet lent successfully:", pet);

    return NextResponse.json(
      {
        message: "Pet lent successfully",
        pet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lending error:", error);
    return NextResponse.json(
      {
        error: "Failed to process lending request",
      },
      { status: 500 }
    );
  }
}
