-- CreateTable
CREATE TABLE "Listing" (
    "Id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bedCount" INTEGER NOT NULL,
    "bathCount" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
