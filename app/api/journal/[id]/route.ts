import { analyze } from '@/utils/ai'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// ✅ Funktion för att hämta params korrekt
export const PATCH = async (
  request: Request,
  context: { params: { id: string } }
) => {
  const { id } = context.params
  const { content } = await request.json()

  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Inte inloggad', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return new NextResponse('Användare saknas', { status: 404 })
  }

  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updatedEntry.content)

  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: analysis,
  })

  console.log(updated)

  return NextResponse.json({ data: updatedEntry })
}
