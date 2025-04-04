'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/lib/types'
import Link from 'next/link'
import CardRenderer from './CardRenderer'

type StudyDeckProps = {
  deckId: string
}

export default function StudyDeck({ deckId }: StudyDeckProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyComplete, setStudyComplete] = useState(false)

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
        .order('next_review', { ascending: true, nullsFirst: true })

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

  // Handle card review
  const handleReview = async (quality: number) => {
    if (!cards[currentCardIndex]) return

    const card = cards[currentCardIndex]
    const now = new Date()
    
    // Calculate new interval using SuperMemo 2 algorithm
    let newInterval: number
    let newEaseFactor = card.ease_factor
    let newRepetitions = card.repetitions + 1
    
    if (quality >= 3) {
      if (card.repetitions === 0) {
        newInterval = 1
      } else if (card.repetitions === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(card.interval * card.ease_factor)
      }
      
      newEaseFactor = Math.max(1.3, card.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    } else {
      newInterval = 1
      newEaseFactor = Math.max(1.3, card.ease_factor - 0.2)
      newRepetitions = 0
    }
    
    // Calculate next review date
    const nextReview = new Date(now)
    nextReview.setDate(nextReview.getDate() + newInterval)
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('cards')
        .update({
          interval: newInterval,
          repetitions: newRepetitions,
          ease_factor: newEaseFactor,
          last_reviewed: now.toISOString(),
          next_review: nextReview.toISOString(),
        })
        .eq('id', card.id)

      if (error) throw error

      // Move to next card or complete study session
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
        setShowAnswer(false)
      } else {
        setStudyComplete(true)
      }
    } catch (error) {
      console.error('Error updating card:', error)
      alert('Error updating card')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading cards...</div>
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">No cards to study in this deck.</p>
        <Link
          href={`/decks/${deckId}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Return to Deck
        </Link>
      </div>
    )
  }

  if (studyComplete) {
    return (
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold mb-4">Study Session Complete!</h2>
        <p className="text-gray-600 mb-4">You&apos;ve reviewed all cards in this deck.</p>
        <Link
          href={`/decks/${deckId}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Return to Deck
        </Link>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Deck</h1>
        <div className="text-sm text-gray-500">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
      </div>

      <CardRenderer 
        card={currentCard}
        showAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onReview={handleReview}
      />
    </div>
  )
} 