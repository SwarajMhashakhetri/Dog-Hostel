import { NextResponse } from "next/server"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { newRole } = await req.json()
    if (!["OWNER", "LENDER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const userId = Number(session.user.id)

    let updatedUser

    if (newRole === "LENDER") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: newRole,
        },
        include: {
          pets: true,
          lentPets: true,
        },
      })
    } else if (newRole === "OWNER") {
      updatedUser = await prisma.$transaction(async (prisma) => {
        await prisma.pet.updateMany({
          where: { lenderId: userId },
          data: {
            lenderId: null,
            status: "AVAILABLE",
          },
        })

        return prisma.user.update({
          where: { id: userId },
          data: {
            role: newRole,
          },
          include: {
            pets: true,
            lentPets: true,
          },
        })
      })
    }

    return NextResponse.json({ message: "Role updated successfully", user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

