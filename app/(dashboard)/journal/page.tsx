import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import Link from 'next/link'

const JournalPage = async () => {
  headers()
  const { userId } = await auth()

  if (!userId) return <div>Inte inloggad</div>

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) return <div>Användare hittades inte</div>

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default JournalPage
