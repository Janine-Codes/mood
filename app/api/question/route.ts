import { qa } from '@/utils/ai'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'
import { error } from 'console'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const { userId } = auth()
  console.log('Logged in Clerk userId:', userId)
  let entries
  const { question } = await request.json()
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({
        data: 'Jag hittar ingen user :(',
      })
    }

    entries = await prisma.journalEntry.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    })
    console.log('Entries:', entries)
    if (!entries || entries.length === 0) {
      return NextResponse.json({
        data: 'Du har inga journalanteckningar ännu.',
      })
    }

    const answer = await qa(question, entries)

    return NextResponse.json({ data: answer })
  } catch {
    console.log('ERROR:', error)
  }
}
