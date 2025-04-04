import React from 'react'
import { TextCard, CardRendererProps } from '@/lib/types'

interface TextCardRendererProps extends Omit<CardRendererProps, 'card'> {
  card: TextCard
}

export default function TextCardRenderer({ 
  card, 
  showAnswer, 
  onShowAnswer, 
  onReview 
}: TextCardRendererProps) {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Front:</h2>
        <p className="text-gray-900">{card.front}</p>
      </div>

      {showAnswer ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Back:</h2>
            <p className="text-gray-900">{card.back}</p>
          </div>
          <div className="mt-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">How well did you know this?</h3>
            <div className="flex justify-between space-x-2">
              <button
                onClick={() => onReview(1)}
                className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Hard
              </button>
              <button
                onClick={() => onReview(2)}
                className="flex-1 py-2 px-4 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Good
              </button>
              <button
                onClick={() => onReview(3)}
                className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Easy
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={onShowAnswer}
          className="mt-auto py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Show Answer
        </button>
      )}
    </>
  )
} 