# Flashcard App with Supabase and Next.js

A modern flashcard application built with Next.js, Supabase, and Tailwind CSS. This app supports spaced repetition learning and different types of flashcards.

## Features

- User authentication with email/password and social login
- Deck management (create, read, update, delete)
- Card management (create, read, update, delete)
- Spaced repetition study system using the SuperMemo 2 algorithm
- Multiple card types:
  - Text cards (front/back)
  - Code cards (JavaScript execution)
- Responsive UI with Tailwind CSS
- Type safety with TypeScript
- Secure database with Row Level Security

## Card Types

### Text Cards

The traditional flashcard format with a front (question) and back (answer).

```
Front: What is the capital of France?
Back: Paris
```

### Code Cards

Interactive cards that allow users to write and execute JavaScript code. These cards include:

- A question or problem statement
- A code editor where users can write JavaScript code
- Expected output that the code should produce
- Real-time code execution in a sandboxed environment

Example:
```
Question: Write a function that returns the sum of two numbers.

Code:
function add(a, b) {
  return a + b;
}
console.log(add(5, 3));

Expected Output: 8
```

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the SQL scripts in the `supabase/migrations` directory

## Usage

1. Sign in or create an account
2. Create decks to organize your flashcards
3. Add cards to your decks (text or code)
4. Study your cards using the spaced repetition system
5. Track your progress over time

## License

MIT
