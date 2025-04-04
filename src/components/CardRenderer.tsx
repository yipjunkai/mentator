import React from 'react'
import { CardRendererProps } from '@/lib/types'
import TextCardRenderer from './card-types/TextCardRenderer'
import CodeCardRenderer from './card-types/CodeCardRenderer'

export default function CardRenderer({ card, showAnswer, onShowAnswer, onReview }: CardRendererProps) {
  // Render the appropriate card type based on the card.type property
  const renderCardContent = () => {
    switch (card.type) {
      case 'text':
        return <TextCardRenderer card={card} showAnswer={showAnswer} onShowAnswer={onShowAnswer} onReview={onReview} />
      case 'code':
        return <CodeCardRenderer card={card} showAnswer={showAnswer} onShowAnswer={onShowAnswer} onReview={onReview} />
      default:
        return <div className="text-red-500">Unknown card type: {card.type}</div>
    }
  }

  return (
    <div className="border rounded-lg p-6 mb-6 min-h-[300px] flex flex-col">
      {renderCardContent()}
    </div>
  )
} 