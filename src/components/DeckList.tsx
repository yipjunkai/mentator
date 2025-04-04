'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Deck } from '@/lib/supabase'
import Link from 'next/link'

export default function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [newDeckTitle, setNewDeckTitle] = useState('')
  const [newDeckDescription, setNewDeckDescription] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch decks on component mount
  useEffect(() => {
    fetchDecks()
  }, [])

  // Fetch decks from Supabase
  const fetchDecks = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDecks(data || [])
    } catch (error) {
      console.error('Error fetching decks:', error)
      alert('Error fetching decks')
    } finally {
      setLoading(false)
    }
  }

  // Create a new deck
  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('decks')
        .insert([
          {
            user_id: user.id,
            title: newDeckTitle,
            description: newDeckDescription,
          }
        ])

      if (error) throw error

      // Reset form and refresh decks
      setNewDeckTitle('')
      setNewDeckDescription('')
      setShowCreateForm(false)
      fetchDecks()
    } catch (error) {
      console.error('Error creating deck:', error)
      alert('Error creating deck')
    } finally {
      setLoading(false)
    }
  }

  // Delete a deck
  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck? All cards will be deleted.')) {
      return
    }

    try {
      setLoading(true)
      
      // Delete all cards in the deck first
      const { error: cardsError } = await supabase
        .from('cards')
        .delete()
        .eq('deck_id', deckId)
      
      if (cardsError) throw cardsError

      // Then delete the deck
      const { error: deckError } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId)
      
      if (deckError) throw deckError

      fetchDecks()
    } catch (error) {
      console.error('Error deleting deck:', error)
      alert('Error deleting deck')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Decks</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showCreateForm ? 'Cancel' : 'Create New Deck'}
        </button>
      </div>

      {/* Create Deck Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateDeck} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <label htmlFor="deckTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Deck Title
            </label>
            <input
              type="text"
              id="deckTitle"
              value={newDeckTitle}
              onChange={(e) => setNewDeckTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deckDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="deckDescription"
              value={newDeckDescription}
              onChange={(e) => setNewDeckDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Creating...' : 'Create Deck'}
          </button>
        </form>
      )}

      {/* Deck List */}
      {loading ? (
        <div className="text-center py-4">Loading decks...</div>
      ) : decks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No decks yet. Create your first deck!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{deck.title}</h2>
              <p className="text-gray-600 mb-4">{deck.description || 'No description'}</p>
              <div className="flex justify-between">
                <Link
                  href={`/decks/${deck.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Cards
                </Link>
                <button
                  onClick={() => handleDeleteDeck(deck.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 