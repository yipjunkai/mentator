import { Card as SupabaseCard } from './supabase'

// Base card type that extends the Supabase card
export interface BaseCard extends SupabaseCard {
  type: string
}

// Standard text card (front/back)
export interface TextCard extends BaseCard {
  type: 'text'
  front: string
  back: string
}

// JavaScript code execution card
export interface CodeCard extends BaseCard {
  type: 'code'
  question: string
  code: string
  expectedOutput: string
  testCases?: Array<{
    input: string
    expectedOutput: string
  }>
}

// Union type for all card types
export type Card = TextCard | CodeCard

// Card renderer props
export interface CardRendererProps {
  card: Card
  showAnswer: boolean
  onShowAnswer: () => void
  onReview: (quality: number) => void
} 