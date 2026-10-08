import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api'

function App() {
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answers, setAnswers] = useState([])

  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  const [answerContent, setAnswerContent] = useState('')

  const [loading, setLoading] = useState(false)


  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/questions`)

      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }

      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error(error)
    }
  }


  const fetchQuestion = async (id) => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/questions/${id}`)

      if (!response.ok) {
        throw new Error('Question not found')
      }

      const data = await response.json()

      setSelectedQuestion(data)

      await fetchAnswers(id)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  const fetchAnswers = async (questionId) => {
    try {
      const response = await fetch(
        `${API_URL}/questions/${questionId}/answers`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch answers')
      }

      const data = await response.json()

      setAnswers(data)
    } catch (error) {
      console.error(error)
    }
  }



  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleQuestionSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !content.trim() || !category.trim()) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create question')
      }

      setTitle('')
      setContent('')
      setCategory('')
      setShowQuestionForm(false)

      await fetchQuestions()
    } catch (error) {
      console.error(error)
      alert('Something went wrong while creating the question')
    } finally {
      setLoading(false)
    }
  }


  const handleAnswerSubmit = async (event) => {
    event.preventDefault()

    if (!answerContent.trim()) {
      alert('Please write an answer')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/questions/${selectedQuestion.id}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: answerContent,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create answer')
      }

      setAnswerContent('')

      await fetchAnswers(selectedQuestion.id)
    } catch (error) {
      console.error(error)
      alert('Something went wrong while adding the answer')
    } finally {
      setLoading(false)
    }
  }



  const openQuestion = (question) => {
    fetchQuestion(question.id)
  }



  const goBack = () => {
    setSelectedQuestion(null)
    setAnswers([])
    setAnswerContent('')
  }



  if (selectedQuestion) {
    return (
      <div className="app">

        <header className="navbar">
          <div
            className="logo"
            onClick={goBack}
          >
            QuestionDrop
          </div>

          <button
            className="secondary-button"
            onClick={goBack}
          >
            ← Back
          </button>
        </header>

        <main className="container">

          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <>
              <section className="question-detail">

                <span className="category">
                  {selectedQuestion.category}
                </span>

                <h1>{selectedQuestion.title}</h1>

                <p className="question-content">
                  {selectedQuestion.content}
                </p>

              </section>

              <section className="answers-section">

                <h2>
                  Answers ({answers.length})
                </h2>

                {answers.length === 0 ? (
                  <div className="empty-state">
                    <p>No answers yet.</p>
                    <p>Be the first person to answer.</p>
                  </div>
                ) : (
                  answers.map((answer) => (
                    <div
                      className="answer-card"
                      key={answer.id}
                    >
                      <p>{answer.content}</p>
                    </div>
                  ))
                )}

              </section>

              <section className="answer-form-section">

                <h2>Your Answer</h2>

                <form onSubmit={handleAnswerSubmit}>

                  <textarea
                    placeholder="Write your answer..."
                    value={answerContent}
                    onChange={(event) =>
                      setAnswerContent(event.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Answer'}
                  </button>

                </form>

              </section>
            </>
          )}

        </main>
      </div>
    )
  }

  // =========================
  // MAIN QUESTIONS PAGE
  // =========================

  return (
    <div className="app">

      <header className="navbar">

        <div
          className="logo"
          onClick={goBack}
        >
          QuestionDrop
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowQuestionForm(!showQuestionForm)
          }
        >
          {showQuestionForm ? 'Cancel' : '+ Ask Question'}
        </button>

      </header>

      <main className="container">

        {/* CREATE QUESTION FORM */}

        {showQuestionForm && (
          <section className="question-form">

            <h2>Ask a Question</h2>

            <form onSubmit={handleQuestionSubmit}>

              <label>Title</label>

              <input
                type="text"
                placeholder="What do you want to ask?"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />

              <label>Question</label>

              <textarea
                placeholder="Explain your question..."
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
              />

              <label>Category</label>

              <input
                type="text"
                placeholder="Example: Java, React, DBMS"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              />

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Question'}
              </button>

            </form>

          </section>
        )}

        {/* QUESTIONS */}

        <section>

          <div className="section-heading">

            <div>
              <h1>Questions</h1>
              <p>
                Ask questions. Share knowledge. Help each other.
              </p>
            </div>

          </div>

          {questions.length === 0 ? (
            <div className="empty-state">

              <h3>No questions yet</h3>

              <p>
                Be the first one to ask a question.
              </p>

            </div>
          ) : (
            <div className="questions-list">

              {questions.map((question) => (

                <article
                  className="question-card"
                  key={question.id}
                  onClick={() => openQuestion(question)}
                >

                  <div className="question-card-top">

                    <span className="category">
                      {question.category}
                    </span>

                  </div>

                  <h2>
                    {question.title}
                  </h2>

                  <p>
                    {question.content}
                  </p>

                  <span className="view-question">
                    View question →
                  </span>

                </article>

              ))}

            </div>
          )}

        </section>

      </main>

      <footer>
        <p>QuestionDrop © 2026</p>
      </footer>

    </div>
  )
}

export default App