import React, { useState, useRef, useEffect } from 'react'
import { CodeCard, CardRendererProps } from '@/lib/types'

interface CodeCardRendererProps extends Omit<CardRendererProps, 'card'> {
  card: CodeCard
}

export default function CodeCardRenderer({ 
  card, 
  showAnswer, 
  onShowAnswer, 
  onReview 
}: CodeCardRendererProps) {
  const [userCode, setUserCode] = useState(card.code)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Function to run the code in a sandboxed environment
  const runCode = () => {
    if (!iframeRef.current) return

    try {
      // Clear previous output and errors
      setOutput('')
      setError(null)
      setIsCorrect(null)

      // Create a sandboxed environment using an iframe
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      // Set up the iframe content
      iframeDoc.open()
      iframeDoc.write(`
        <html>
          <head>
            <script>
              // Override console.log to capture output
              const logs = [];
              console.log = (...args) => {
                logs.push(args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '));
              };
              
              // Run the user's code
              try {
                ${userCode}
              } catch (error) {
                console.error(error.message);
              }
              
              // Send the logs back to the parent
              window.parent.postMessage({ type: 'output', logs }, '*');
            </script>
          </head>
          <body></body>
        </html>
      `)
      iframeDoc.close()

      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'output') {
          const outputText = event.data.logs.join('\n')
          setOutput(outputText)
          
          // Check if the output matches the expected output
          const isOutputCorrect = outputText.trim() === card.expectedOutput.trim()
          setIsCorrect(isOutputCorrect)
          
          // Remove the event listener
          window.removeEventListener('message', handleMessage)
        }
      }
      
      window.addEventListener('message', handleMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setIsCorrect(false)
    }
  }

  // Run code when the component mounts or when userCode changes
  useEffect(() => {
    runCode()
  }, [userCode])

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Question:</h2>
        <p className="text-gray-900 mb-4">{card.question}</p>
        
        <h3 className="text-md font-medium text-gray-700 mb-2">Your Code:</h3>
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          className="w-full h-32 p-2 border rounded font-mono text-sm"
          spellCheck="false"
        />
        
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Output:</h3>
          <pre className="bg-gray-100 p-3 rounded font-mono text-sm whitespace-pre-wrap">
            {output || '(No output yet)'}
          </pre>
          
          {error && (
            <div className="mt-2 text-red-500">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {isCorrect !== null && (
            <div className={`mt-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            </div>
          )}
        </div>
      </div>

      {showAnswer ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Expected Output:</h2>
            <pre className="bg-gray-100 p-3 rounded font-mono text-sm whitespace-pre-wrap">
              {card.expectedOutput}
            </pre>
          </div>
          <div className="mt-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">How well did you understand this?</h3>
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
      
      {/* Hidden iframe for sandboxed code execution */}
      <iframe 
        ref={iframeRef} 
        className="hidden" 
        sandbox="allow-scripts"
        title="Code execution sandbox"
      />
    </>
  )
} 