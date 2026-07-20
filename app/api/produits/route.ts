import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const produits = await prisma.produit.findMany({
    orderBy: { nom: "asc" },
  });
  return NextResponse.json(produits);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
const { nom, categorie, stock, prixAchat, prixVente, description, origine, animalId } = body;

  if (!nom || !categorie || prixAchat == null || prixVente == null) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  // Dans app/api/produits/route.ts (POST)

const produit = await prisma.produit.create({
  data: { 
    nom, 
    categorie, 
    stock: stock ?? 0, 
    prixAchat, 
    prixVente, 
    description,
    origine: origine ?? "recolte",
    animalId: animalId ? parseInt(animalId) : null
  },
});
  return NextResponse.json(produit, { status: 201 });
}