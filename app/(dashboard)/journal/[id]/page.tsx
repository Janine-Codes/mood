import Editor from '@/components/Editor'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'

type Props = {
  params: {
    id: string
  }
}

const EntryPage = async ({ params }: Props) => {
  const { id } = params // ✅ korrekt: du får ut id utan att använda det direkt på props.params.id

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
        id: id, // ✅ använd id från params
      },
    },
  })

  if (!entry) return <div>Journalinlägg hittades inte</div>

  const analysisData = [
    { name: 'Summary', value: '' },
    { name: 'Subject', value: '' },
    { name: 'Mood', value: '' },
    { name: 'Negative', value: 'False' },
  ]

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="bg-blue-300 px-6 py-10">
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
            >
              <span className="text-lg font-semibold">{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EntryPage
