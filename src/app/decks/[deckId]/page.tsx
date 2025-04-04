import CardList from '@/components/CardList'

type DeckPageProps = {
  params: {
    deckId: string
  }
}

export default function DeckPage({ params }: DeckPageProps) {
  return (
    <main>
      <CardList deckId={params.deckId} />
    </main>
  )
} 