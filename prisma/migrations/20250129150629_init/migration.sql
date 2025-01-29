-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'LENDER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('AVAILABLE', 'LENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "breed" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "lenderId" INTEGER,
    "specialRequirements" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "lenderId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
