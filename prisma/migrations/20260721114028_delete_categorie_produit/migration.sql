/*
  Warnings:

  - You are about to drop the column `categorie` on the `Produit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "categorie";

-- DropEnum
DROP TYPE "CategorieProduit";
