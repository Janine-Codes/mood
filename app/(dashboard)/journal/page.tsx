import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { analyze } from '@/utils/ai'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import Link from 'next/link'

const JournalPage = async () => {
  headers() // 👈 Next.js kräver att du först hämtar headers
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

  const result = await analyze(`
    I'm going to give you a journal entry. I want you to analyze for a few things.
    I need the mood, a summary, what the subject is, and a color representing the mood.
    You need to respond back with formatted JSON like so:
    {"mood": "", "subject": "", "color": "", "negative": ""}.

    entry:
    Found a new coffee shop nearby. They didn't have good tea which is what I usually look for,
    but they had amazing matcha and hospitable service.
  `)

  console.log('AI-resultat:', result)

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
