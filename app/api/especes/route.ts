import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const especes = await prisma.espece.findMany({
    orderBy: { nom: "asc" },
  });
  return NextResponse.json(especes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { nom, type, description, habitat, dangerosite, pointsForts, pointsFaibles, regimeAlimentaire } = body;

  if (!nom) {
    return NextResponse.json({ error: "Le nom de l'espèce est obligatoire" }, { status: 400 });
  }

  const espece = await prisma.espece.create({
    data: {
      nom,
      type: type ?? "creature_magique",
      description,
      habitat,
      dangerosite: dangerosite ? parseInt(dangerosite) : 1,
      pointsForts,
      pointsFaibles,
      regimeAlimentaire,
    },
  });
  return NextResponse.json(espece, { status: 201 });
}