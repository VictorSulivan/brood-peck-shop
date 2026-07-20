-- CreateEnum
CREATE TYPE "OrigineProduit" AS ENUM ('recolte', 'marchand_ambulant', 'elevage_animal', 'autre');

-- CreateEnum
CREATE TYPE "TypeAnimal" AS ENUM ('creature_magique', 'animal_compagnie');

-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "animalId" INTEGER,
ADD COLUMN     "origine" "OrigineProduit" NOT NULL DEFAULT 'recolte';

-- CreateTable
CREATE TABLE "Animal" (
    "id" SERIAL NOT NULL,
    "entrepriseId" INTEGER NOT NULL,
    "nom" INTEGER NOT NULL,
    "espece" TEXT NOT NULL,
    "type" "TypeAnimal" NOT NULL DEFAULT 'creature_magique',
    "sante" TEXT,
    "bonheur" INTEGER DEFAULT 100,
    "dateAcquisition" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
