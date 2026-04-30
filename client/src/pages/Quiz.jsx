import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setQuiz } from '../redux/quizSlice'

const Quiz = () => {
  const { quiz } = useSelector((state) => state.quiz)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  // Parse quiz content to extract questions
  const parseQuizContent = () => {
    if (!quiz || typeof quiz !== 'string') return []

    const questions = []
    const lines = quiz.split('\n')
    let currentQ = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Question start
      if (line.startsWith('### Q')) {
        if (currentQ) {
          questions.push(currentQ)
        }
        currentQ = {
          question: line.replace('### ', ''),
          options: [],
          correct: ''
        }
      }
      // Options
      else if (line.startsWith('A)') || line.startsWith('B)') || line.startsWith('C)') || line.startsWith('D)')) {
        if (currentQ) {
          currentQ.options.push(line)
        }
      }
      // Correct answer
      else if (line.startsWith('CORRECT:')) {
        if (currentQ) {
          currentQ.correct = line.replace('CORRECT:', '').trim()
        }
      }
    }

    // Add last question
    if (currentQ) {
      questions.push(currentQ)
    }

    return questions
  }

  const questions = parseQuizContent()

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q, index) => {
      const selected = selectedAnswers[index]
      if (selected && selected.startsWith(q.correct)) {
        correct++
      }
    })
    return correct
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
  }

  const goBack = () => {
    dispatch(setQuiz([]))
    navigate('/dashboard')
  }

  // If no quiz data
  if (!quiz || (Array.isArray(quiz) && quiz.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No Quiz Available</h2>
          <p className="text-text-secondary mb-6">Generate notes first to create a quiz from your content.</p>
          <button
            onClick={goBack}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border-2 border-primary/50 shadow-xl shadow-primary/10 p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Quiz Time!</h1>
            <p className="text-text-secondary">Test your knowledge with {questions.length} questions</p>
          </div>

          <div className="bg-primary/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-text-secondary">Questions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">~{Math.ceil(questions.length * 0.5)}</p>
                <p className="text-sm text-text-secondary">Minutes</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-text-secondary">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">✓</span>
              <span>Select one answer per question</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">✓</span>
              <span>Navigate between questions freely</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">✓</span>
              <span>See your score at the end</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={goBack}
              className="flex-1 py-3 border-2 border-border text-text-secondary rounded-xl font-semibold hover:bg-background transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setQuizStarted(true)}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border-2 border-primary/50 shadow-xl shadow-primary/10 p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${percentage >= 70 ? 'bg-green-500' :
              percentage >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
              <span className="text-5xl">
                {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">Quiz Complete!</h2>
            <p className="text-text-secondary">
              {percentage >= 70 ? 'Excellent work!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-primary/10 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-primary mb-2">{score}/{questions.length}</p>
              <p className="text-lg text-text-secondary">Correct Answers</p>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{percentage}%</p>
                  <p className="text-sm text-text-secondary">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{questions.length - score}</p>
                  <p className="text-sm text-text-secondary">Incorrect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-6 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-3">Review Answers:</h3>
            <div className="space-y-2">
              {questions.map((q, index) => {
                const selected = selectedAnswers[index]
                const isCorrect = selected && selected.startsWith(q.correct)
                return (
                  <div key={index} className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-900/20 border-green-900/50' : 'bg-red-900/20 border-red-900/50'
                    }`}>
                    <p className="text-sm font-medium text-text-primary mb-1">{q.question}</p>
                    <p className={`text-xs ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      Your answer: {selected || 'Not answered'}
                      {!isCorrect && ` | Correct: ${q.correct})`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 border-2 border-primary/50 text-primary rounded-xl font-semibold hover:bg-primary/10 transition-all"
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={goBack}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz question screen
  const currentQ = questions[currentQuestion]
  const selected = selectedAnswers[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-surface rounded-2xl border-2 border-primary/50 shadow-xl shadow-primary/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goBack}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Exit Quiz
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selected === option
                const optionLetter = option.charAt(0)

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${isSelected
                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                      : 'border-border bg-background hover:border-primary hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelected
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary'
                        }`}>
                        {optionLetter}
                      </span>
                      <span className={`font-medium ${isSelected ? 'text-primary' : 'text-text-primary'
                        }`}>
                        {option.substring(3)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all text-sm ${currentQuestion === 0
                ? 'bg-background text-text-secondary cursor-not-allowed'
                : 'bg-background text-text-primary hover:bg-primary/10'
                }`}
            >
              ← Previous
            </button>

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-hide">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all ${index === currentQuestion
                    ? 'bg-primary text-white'
                    : selectedAnswers[index]
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-secondary hover:bg-primary/10'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl font-semibold transition-all text-sm ${Object.keys(selectedAnswers).length !== questions.length
                  ? 'bg-background text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
                  }`}
              >
                Submit Quiz ✓
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all text-sm"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
            <span>Remaining: {questions.length - Object.keys(selectedAnswers).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz