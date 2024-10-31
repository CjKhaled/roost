/*
  Warnings:

  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Listing` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `FirstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableFrom` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTo` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestsAllowed` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Listing` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `locationLat` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationLng` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petsAllowed` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smokingAllowed` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strictNoisePolicy` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strictParking` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Amenities" AS ENUM ('WIFI', 'PARKING', 'LAUNDRY', 'DISHWASHER', 'GYM', 'POOL', 'STUDY_ROOM', 'TRASH_PICKUP', 'CABLE_TV', 'ELECTRIC_VEHICLE_CHARGING');

-- CreateEnum
CREATE TYPE "Utilities" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'SEWER', 'PEST_CONTROL');

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_createdById_fkey";

-- DropIndex
DROP INDEX "User_Email_key";

-- AlterTable
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_pkey",
DROP COLUMN "Id",
ADD COLUMN     "amenities" "Amenities"[],
ADD COLUMN     "availableFrom" TEXT NOT NULL,
ADD COLUMN     "availableTo" TEXT NOT NULL,
ADD COLUMN     "guestsAllowed" BOOLEAN NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT[],
ADD COLUMN     "locationLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "locationLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "petsAllowed" BOOLEAN NOT NULL,
ADD COLUMN     "smokingAllowed" BOOLEAN NOT NULL,
ADD COLUMN     "strictNoisePolicy" BOOLEAN NOT NULL,
ADD COLUMN     "strictParking" BOOLEAN NOT NULL,
ADD COLUMN     "utilities" "Utilities"[],
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "Email",
DROP COLUMN "FirstName",
DROP COLUMN "Id",
DROP COLUMN "LastName",
DROP COLUMN "Password",
ADD COLUMN     "email" VARCHAR(50) NOT NULL,
ADD COLUMN     "firstName" VARCHAR(30) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lastName" VARCHAR(30) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
