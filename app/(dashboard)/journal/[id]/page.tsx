import Editor from '@/components/Editor'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'

type Props = {
  params: {
    id: string
  }
}

const EntryPage = async ({ params }: Props) => {
  const { id } = params

  const { userId } = await auth()
  if (!userId) return <div>Du är inte inloggad</div>

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) return <div>Användare hittades inte</div>

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: id,
      },
    },
    include: {
      analysis: true,
    },
  })

  if (!entry) return <div>Journalinlägg hittades inte</div>

  return (
    <div className="h-full w-full">
      <Editor entry={entry} />
    </div>
  )
}

export default EntryPage
