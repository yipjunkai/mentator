import Link from 'next/link'

export default function Dashboard() {
  // Mock data for decks
  const decks = [
    {
      id: '1',
      title: 'JavaScript Basics',
      description: 'Learn the fundamentals of JavaScript programming',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'React Hooks',
      description: 'Master React hooks for functional components',
      created_at: new Date().toISOString()
    }
  ]
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <Link 
          href="/decks/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Deck
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div 
            key={deck.id} 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{deck.title}</h2>
            {deck.description && (
              <p className="text-gray-600 mb-4">{deck.description}</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <Link 
                href={`/decks/${deck.id}`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                View Cards
              </Link>
              <Link 
                href={`/decks/${deck.id}/study`}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Study
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 