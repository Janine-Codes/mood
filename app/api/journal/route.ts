import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async () => {
  // ✅ auth direkt här
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Inte inloggad', { status: 401 })
  }

  // ✅ hämta användaren från databasen
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })

  if (!user) {
    return new NextResponse('Användare hittades inte', { status: 404 })
  }

  // ✅ skapa journalinlägg
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day!',
    },
  })

  // ✅ uppdatera journal-sidan
  revalidatePath('/journal')

  // ✅ svara tillbaka
  return NextResponse.json({ data: entry })
}
