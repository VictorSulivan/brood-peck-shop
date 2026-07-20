import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const entrepriseId = searchParams.get("entrepriseId");

  const animaux = await prisma.animal.findMany({
    where: entrepriseId ? { entrepriseId: parseInt(entrepriseId) } : undefined,
    include: {
      espece: true,
      entreprise: true,
    },
    orderBy: { nom: "asc" },
  });
  return NextResponse.json(animaux);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { entrepriseId, especeId, nom, sante } = body;

  if (!entrepriseId || !especeId || !nom) {
    return NextResponse.json({ error: "Entreprise, espèce et nom requis" }, { status: 400 });
  }

  const animal = await prisma.animal.create({
    data: {
      entrepriseId: parseInt(entrepriseId),
      especeId: parseInt(especeId),
      nom,
      sante: sante ?? "Bonne",
    },
    include: { espece: true },
  });
  return NextResponse.json(animal, { status: 201 });
}