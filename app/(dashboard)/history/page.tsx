import HistoryChart from '@/components/HistoryChart'
import { prisma } from '@/utils/db'
import { auth } from '@clerk/nextjs/server'

const getData = async () => {
  const { userId } = await auth()

  if (!userId) return <div>Inte inloggad</div>

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      sentimentScore: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const sum = analyses.reduce((all, current) => all + current.sentimentScore, 0)
  const avg = Math.round(sum / analyses.length)
  return { analyses, avg }
}

const History = async () => {
  const { avg, analyses } = await getData()
  console.log(analyses)
  return (
    <div className="w-full h-full">
      <div>{`Avg. Sentiment ${avg}`}</div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  )
}

export default History
