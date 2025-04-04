import StudyDeck from '@/components/StudyDeck'

type StudyPageProps = {
  params: {
    deckId: string
  }
}

export default function StudyPage({ params }: StudyPageProps) {
  return (
    <main>
      <StudyDeck deckId={params.deckId} />
    </main>
  )
} 