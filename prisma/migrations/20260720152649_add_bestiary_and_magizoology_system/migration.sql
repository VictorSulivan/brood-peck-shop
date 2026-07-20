/*
  Warnings:

  - You are about to drop the column `espece` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `especeId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "espece",
DROP COLUMN "type",
ADD COLUMN     "especeId" INTEGER NOT NULL,
ALTER COLUMN "nom" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Espece" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeAnimal" NOT NULL DEFAULT 'creature_magique',
    "description" TEXT,
    "habitat" TEXT,
    "dangerosite" INTEGER NOT NULL DEFAULT 1,
    "pointsForts" TEXT,
    "pointsFaibles" TEXT,
    "regimeAlimentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Espece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportObservation" (
    "id" SERIAL NOT NULL,
    "employeId" INTEGER NOT NULL,
    "especeId" INTEGER,
    "animalId" INTEGER,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lieu" TEXT,
    "dateObservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RapportObservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Espece_nom_key" ON "Espece"("nom");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_especeId_fkey" FOREIGN KEY ("especeId") REFERENCES "Espece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportObservation" ADD CONSTRAINT "RapportObservation_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportObservation" ADD CONSTRAINT "RapportObservation_especeId_fkey" FOREIGN KEY ("especeId") REFERENCES "Espece"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportObservation" ADD CONSTRAINT "RapportObservation_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
