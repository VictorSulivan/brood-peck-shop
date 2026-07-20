import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rapports = await prisma.rapportObservation.findMany({
    include: {
      employe: true,
      espece: true,
      animal: true,
    },
    orderBy: { dateObservation: "desc" },
  });
  return NextResponse.json(rapports);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = session.user;
  const body = await req.json();
  const { titre, contenu, lieu, especeId, animalId } = body;

  if (!titre || !contenu) {
    return NextResponse.json({ error: "Le titre et le contenu sont obligatoires" }, { status: 400 });
  }

  const employe = await prisma.employe.findFirst({
    where: { utilisateur: { id: parseInt(user.id) } },
  });
  if (!employe) return NextResponse.json({ error: "Employé introuvable" }, { status: 400 });

  const rapport = await prisma.rapportObservation.create({
    data: {
      employeId: employe.id,
      titre,
      contenu,
      lieu,
      especeId: especeId ? parseInt(especeId) : null,
      animalId: animalId ? parseInt(animalId) : null,
    },
    include: { employe: true, espece: true, animal: true },
  });

  return NextResponse.json(rapport, { status: 201 });
}