'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, TextCard, CodeCard } from '@/lib/types'
import Link from 'next/link'

type CardListProps = {
  deckId: string
}

// Type for card data to be inserted into Supabase
type CardInsertData = {
  deck_id: string
  ease_factor: number
  interval: number
  repetitions: number
  front?: string
  back?: string
  question?: string
  code?: string
  expectedOutput?: string
}

export default function CardList({ deckId }: CardListProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [cardType, setCardType] = useState<'text' | 'code'>('text')
  
  // Text card form state
  const [newCardFront, setNewCardFront] = useState('')
  const [newCardBack, setNewCardBack] = useState('')
  
  // Code card form state
  const [newCardQuestion, setNewCardQuestion] = useState('')
  const [newCardCode, setNewCardCode] = useState('')
  const [newCardExpectedOutput, setNewCardExpectedOutput] = useState('')
  
  // Edit state
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [editFront, setEditFront] = useState('')
  const [editBack, setEditBack] = useState('')
  const [editQuestion, setEditQuestion] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editExpectedOutput, setEditExpectedOutput] = useState('')

  // Fetch cards on component mount
  useEffect(() => {
    fetchCards()
  }, [deckId])

  // Fetch cards from Supabase
  const fetchCards = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to include the card type
      const transformedCards = data.map(card => {
        // Determine the card type based on the presence of certain fields
        if (card.front && card.back) {
          return { ...card, type: 'text' } as Card
        } else if (card.question && card.code) {
          return { ...card, type: 'code' } as Card
        } else {
          // Default to text card if type cannot be determined
          return { ...card, type: 'text', front: card.front || 'Question', back: card.back || 'Answer' } as Card
        }
      })
      
      setCards(transformedCards)
    } catch (error) {
      console.error('Error fetching cards:', error)
      alert('Error fetching cards')
    } finally {
      setLoading(false)
    }
  }

  // Create a new card
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      let cardData: CardInsertData = {
        deck_id: deckId,
        ease_factor: 2.5,
        interval: 0,
        repetitions: 0,
      }
      
      // Add type-specific fields
      if (cardType === 'text') {
        cardData = {
          ...cardData,
          front: newCardFront,
          back: newCardBack,
        }
      } else if (cardType === 'code') {
        cardData = {
          ...cardData,
          question: newCardQuestion,
          code: newCardCode,
          expectedOutput: newCardExpectedOutput,
        }
      }

      const { error } = await supabase
        .from('cards')
        .insert([cardData])

      if (error) throw error

      // Reset form and refresh cards
      setNewCardFront('')
      setNewCardBack('')
      setNewCardQuestion('')
      setNewCardCode('')
      setNewCardExpectedOutput('')
      setShowCreateForm(false)
      fetchCards()
    } catch (error) {
      console.error('Error creating card:', error)
      alert('Error creating card')
    } finally {
      setLoading(false)
    }
  }

  // Start editing a card
  const handleStartEdit = (card: Card) => {
    setEditingCard(card)
    
    if (card.type === 'text') {
      setEditFront(card.front)
      setEditBack(card.back)
    } else if (card.type === 'code') {
      setEditQuestion(card.question)
      setEditCode(card.code)
      setEditExpectedOutput(card.expectedOutput)
    }
  }

  // Save card edits
  const handleSaveEdit = async () => {
    if (!editingCard) return

    try {
      setLoading(true)
      
      let updateData: Partial<TextCard | CodeCard> = {}
      
      if (editingCard.type === 'text') {
        updateData = {
          front: editFront,
          back: editBack,
        }
      } else if (editingCard.type === 'code') {
        updateData = {
          question: editQuestion,
          code: editCode,
          expectedOutput: editExpectedOutput,
        }
      }
      
      const { error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', editingCard.id)

      if (error) throw error

      // Reset edit state and refresh cards
      setEditingCard(null)
      setEditFront('')
      setEditBack('')
      setEditQuestion('')
      setEditCode('')
      setEditExpectedOutput('')
      fetchCards()
    } catch (error) {
      console.error('Error updating card:', error)
      alert('Error updating card')
    } finally {
      setLoading(false)
    }
  }

  // Delete a card
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)

      if (error) throw error
      fetchCards()
    } catch (error) {
      console.error('Error deleting card:', error)
      alert('Error deleting card')
    } finally {
      setLoading(false)
    }
  }

  // Render card content based on type
  const renderCardContent = (card: Card) => {
    if (card.type === 'text') {
      return (
        <>
          <div className="mb-2">
            <h3 className="font-medium text-gray-700">Front:</h3>
            <p className="mt-1">{card.front}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Back:</h3>
            <p className="mt-1">{card.back}</p>
          </div>
        </>
      )
    } else if (card.type === 'code') {
      return (
        <>
          <div className="mb-2">
            <h3 className="font-medium text-gray-700">Question:</h3>
            <p className="mt-1">{card.question}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Code:</h3>
            <pre className="mt-1 bg-gray-100 p-2 rounded font-mono text-sm overflow-x-auto">
              {card.code}
            </pre>
          </div>
        </>
      )
    }
    
    return <div>Unknown card type</div>
  }

  // Render edit form based on card type
  const renderEditForm = (card: Card) => {
    if (card.type === 'text') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Front
            </label>
            <textarea
              value={editFront}
              onChange={(e) => setEditFront(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Back
            </label>
            <textarea
              value={editBack}
              onChange={(e) => setEditBack(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>
      )
    } else if (card.type === 'code') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <textarea
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono"
              rows={5}
              spellCheck="false"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Output
            </label>
            <textarea
              value={editExpectedOutput}
              onChange={(e) => setEditExpectedOutput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono"
              rows={2}
              spellCheck="false"
            />
          </div>
        </div>
      )
    }
    
    return <div>Unknown card type</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cards</h1>
        <div className="flex space-x-2">
          <Link
            href={`/decks/${deckId}/study`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Study Deck
          </Link>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {showCreateForm ? 'Cancel' : 'Add New Card'}
          </button>
        </div>
      </div>

      {/* Create Card Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateCard} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Type
            </label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as 'text' | 'code')}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="text">Text Card (Front/Back)</option>
              <option value="code">Code Card (JavaScript)</option>
            </select>
          </div>
          
          {cardType === 'text' ? (
            <>
              <div className="mb-4">
                <label htmlFor="cardFront" className="block text-sm font-medium text-gray-700 mb-1">
                  Front
                </label>
                <textarea
                  id="cardFront"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cardBack" className="block text-sm font-medium text-gray-700 mb-1">
                  Back
                </label>
                <textarea
                  id="cardBack"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="cardQuestion" className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <textarea
                  id="cardQuestion"
                  value={newCardQuestion}
                  onChange={(e) => setNewCardQuestion(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cardCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <textarea
                  id="cardCode"
                  value={newCardCode}
                  onChange={(e) => setNewCardCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono"
                  rows={5}
                  spellCheck="false"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cardExpectedOutput" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Output
                </label>
                <textarea
                  id="cardExpectedOutput"
                  value={newCardExpectedOutput}
                  onChange={(e) => setNewCardExpectedOutput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono"
                  rows={2}
                  spellCheck="false"
                  required
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Creating...' : 'Create Card'}
          </button>
        </form>
      )}

      {/* Card List */}
      {loading ? (
        <div className="text-center py-4">Loading cards...</div>
      ) : cards.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No cards yet. Add your first card!
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <div key={card.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              {editingCard?.id === card.id ? (
                <div className="space-y-4">
                  {renderEditForm(card)}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingCard(null)}
                      className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {renderCardContent(card)}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleStartEdit(card)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 