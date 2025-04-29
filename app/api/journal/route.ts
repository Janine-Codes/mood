import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkID()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day!',
    },
  })

  return NextResponse.json({ data: entry })
}
