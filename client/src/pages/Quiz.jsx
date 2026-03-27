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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">No Quiz Available</h2>
          <p className="text-stone-500 mb-6">Generate notes first to create a quiz from your content.</p>
          <button
            onClick={goBack}
            className="w-full py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/30"
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-xl shadow-teal-500/10 p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-teal-700 mb-2">Quiz Time!</h1>
            <p className="text-stone-500">Test your knowledge with {questions.length} questions</p>
          </div>

          <div className="bg-linear-to-r from-teal-50 to-emerald-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-teal-700">{questions.length}</p>
                <p className="text-sm text-stone-500">Questions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">~{Math.ceil(questions.length * 0.5)}</p>
                <p className="text-sm text-stone-500">Minutes</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-stone-600">
              <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-sm font-bold">✓</span>
              <span>Select one answer per question</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-sm font-bold">✓</span>
              <span>Navigate between questions freely</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-sm font-bold">✓</span>
              <span>See your score at the end</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={goBack}
              className="flex-1 py-3 border-2 border-stone-200 text-stone-600 rounded-xl font-semibold hover:bg-stone-50 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setQuizStarted(true)}
              className="flex-1 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-500 hover:to-emerald-500 transition-all shadow-lg shadow-teal-500/30"
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-xl shadow-teal-500/10 p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${percentage >= 70 ? 'bg-linear-to-r from-green-500 to-emerald-500' :
              percentage >= 50 ? 'bg-linear-to-r from-yellow-500 to-orange-500' :
                'bg-linear-to-r from-red-500 to-pink-500'
              }`}>
              <span className="text-5xl">
                {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Quiz Complete!</h2>
            <p className="text-stone-500">
              {percentage >= 70 ? 'Excellent work!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-linear-to-r from-teal-50 to-emerald-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-teal-700 mb-2">{score}/{questions.length}</p>
              <p className="text-lg text-stone-600">Correct Answers</p>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{percentage}%</p>
                  <p className="text-sm text-stone-500">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">{questions.length - score}</p>
                  <p className="text-sm text-stone-500">Incorrect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-6 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-stone-700 mb-3">Review Answers:</h3>
            <div className="space-y-2">
              {questions.map((q, index) => {
                const selected = selectedAnswers[index]
                const isCorrect = selected && selected.startsWith(q.correct)
                return (
                  <div key={index} className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                    <p className="text-sm font-medium text-stone-700 mb-1">{q.question}</p>
                    <p className={`text-xs ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
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
              className="flex-1 py-3 border-2 border-teal-200 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-all"
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={goBack}
              className="flex-1 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-500 hover:to-emerald-500 transition-all shadow-lg shadow-teal-500/30"
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
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-teal-100 shadow-xl shadow-teal-500/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goBack}
              className="text-stone-500 hover:text-stone-700 transition-colors"
            >
              ← Exit Quiz
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">
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
                      ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/20'
                      : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelected
                        ? 'bg-teal-500 text-white'
                        : 'bg-stone-100 text-stone-600'
                        }`}>
                        {optionLetter}
                      </span>
                      <span className={`font-medium ${isSelected ? 'text-teal-700' : 'text-stone-700'
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
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-stone-100 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all text-sm ${currentQuestion === 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
            >
              ← Previous
            </button>

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all ${index === currentQuestion
                    ? 'bg-teal-500 text-white'
                    : selectedAnswers[index]
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
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
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/30'
                  }`}
              >
                Submit Quiz ✓
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-500 transition-all text-sm"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
            <span>Remaining: {questions.length - Object.keys(selectedAnswers).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz