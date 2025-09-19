import { useState } from 'react';
import { Send, Bot, Loader2, MessageCircle, Sparkles, X } from 'lucide-react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/.netlify/functions/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setShowModal(true);
    } catch (err) {
      setError('Sorry, there was an error processing your question. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAnswer('');
  };

  const handleSampleQuestion = async (sampleQ) => {
    setQuestion(sampleQ);
    
    // Automatically submit the question
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/.netlify/functions/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: sampleQ.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setShowModal(true);
    } catch (err) {
      setError('Sorry, there was an error processing your question. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What are Maddie's key skills?",
    "Tell me about Maddie's work experience",
    "What projects has Maddie worked on?",
    "What makes Maddie a good candidate?",
    "What technologies does Maddie know?",
    "What is Maddie's educational background?",
    "Tell me some fun facts about Maddie!"
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-icon">
              <MessageCircle size={48} />
            </div>
            <h1>Why Hire Maddie?</h1>
            <p>Ask me anything about Maddie's qualifications, experience, and skills</p>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-title">
                <Sparkles className="sparkle-icon" size={32} />
                <h2>AI-Powered Q&A</h2>
              </div>
              <p>Get instant, detailed answers about Maddie's background</p>
            </div>

            <form onSubmit={handleSubmit} className="question-form">
              <div className="input-group">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about Maddie..."
                  className="question-input"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading || !question.trim()}
                >
                  {loading ? <Loader2 className="spinner" /> : <Send />}
                </button>
              </div>
            </form>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <div className="sample-questions">
              <h3>Try asking:</h3>
              <div className="question-chips">
                {sampleQuestions.map((sampleQ, index) => (
                  <button
                    key={index}
                    className="question-chip"
                    onClick={() => handleSampleQuestion(sampleQ)}
                    disabled={loading}
                  >
                    {sampleQ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Response Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="ai-icon-wrapper">
                  <Bot className="bot-icon" />
                </div>
                <span className="ai-response-title">AI Response</span>
              </div>
              <button className="close-button" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>{answer}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Why Hire Maddie. Created by Maddie Mathis.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
