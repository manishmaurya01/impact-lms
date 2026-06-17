import React, { useState, useEffect } from 'react';

export default function QuizWindow({ quizId, questions, timeLimit, onSubmitQuiz }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert minutes to seconds

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionSelect = (option) => {
    setUserAnswers({ ...userAnswers, [currentIdx]: option });
  };

  const toggleReview = () => {
    setMarkedForReview({ ...markedForReview, [currentIdx]: !markedForReview[currentIdx] });
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Your quiz is being submitted automatically.");
    onSubmitQuiz(userAnswers);
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div style={styles.container}>
      {/* Header Info */}
      <div style={styles.header}>
        <span style={styles.timer}>⏳ Time Remaining: {formatTime(timeLeft)}</span>
        <button style={styles.submitBtn} onClick={() => onSubmitQuiz(userAnswers)}>Manual Submit</button>
      </div>

      <div style={styles.layout}>
        {/* Main Quiz Area */}
        <div style={styles.quizArea}>
          <div style={styles.questionCard}>
            <h3>Question {currentIdx + 1} of {questions.length}</h3>
            <p style={styles.questionText}>{currentQuestion.question}</p>

            <div style={styles.optionsList}>
              {currentQuestion.options.map((option, idx) => (
                <label key={idx} style={styles.optionLabel}>
                  <input
                    type="radio"
                    name={`question-${currentIdx}`}
                    checked={userAnswers[currentIdx] === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  <span style={styles.optionText}>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={styles.controls}>
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)}>Previous</button>
            <button style={styles.reviewBtn} onClick={toggleReview}>
              {markedForReview[currentIdx] ? "Unmark Review" : "Mark For Review"}
            </button>
            <button disabled={currentIdx === questions.length - 1} onClick={() => setCurrentIdx(p => p + 1)}>Next</button>
          </div>
        </div>

        {/* Question Quick-Navigator Side Panel */}
        <div style={styles.sidebar}>
          <h4>Navigator</h4>
          <div style={styles.grid}>
            {questions.map((_, idx) => {
              let btnStyle = { ...styles.navNum };
              if (currentIdx === idx) btnStyle.border = '2px solid #000';
              if (markedForReview[idx]) btnStyle.backgroundColor = '#ffcc00';
              else if (userAnswers[idx] !== undefined) btnStyle.backgroundColor = '#4CAF50';

              return (
                <button key={idx} style={btnStyle} onClick={() => setCurrentIdx(idx)}>
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '10px' },
  timer: { fontSize: '18px', fontWeight: 'bold', color: '#d9534f' },
  submitBtn: { backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  layout: { display: 'flex', gap: '20px', marginTop: '20px' },
  quizArea: { flex: 3 },
  sidebar: { flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' },
  questionCard: { border: '1px solid #e0e0e0', padding: '20px', borderRadius: '6px', backgroundColor: '#fff' },
  questionText: { fontSize: '16px', fontWeight: '500', marginBottom: '20px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', border: '1px solid #eee', borderRadius: '4px' },
  controls: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
  reviewBtn: { backgroundColor: '#ffcc00', border: 'none', padding: '6px 12px', borderRadius: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  navNum: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }
};