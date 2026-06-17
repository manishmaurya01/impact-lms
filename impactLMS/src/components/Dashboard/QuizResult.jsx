import React from 'react';

export default function QuizResult({ result, onBackToDashboard }) {
  return (
    <div style={styles.container}>
      <h2>Quiz Evaluation Summary</h2>
      <div style={styles.scoreContainer}>
        <div style={styles.metric}>
          <span style={styles.value}>{result.score}</span>
          <span style={styles.label}>Final Score</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.value}>{result.percentage}%</span>
          <span style={styles.label}>Percentage</span>
        </div>
      </div>

      <h3>Answer Breakdown</h3>
      {result.generatedQuestions.map((q, idx) => (
        <div key={idx} style={styles.breakdownCard}>
          <p><strong>Q{idx + 1}:</strong> {q.question}</p>
          <p style={{ color: 'green' }}>✓ Correct Answer: {q.correctAnswer}</p>
          <p style={{ color: result.userAnswers[idx] === q.correctAnswer ? 'green' : 'red' }}>
            ⚿ Your Answer: {result.userAnswers[idx] || "Unanswered"}
          </p>
          <p style={styles.explanation}><em>Explanation:</em> {q.explanation}</p>
        </div>
      ))}

      <button style={styles.closeBtn} onClick={onBackToDashboard}>Return to Dashboard</button>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '700px', margin: '0 auto' },
  scoreContainer: { display: 'flex', gap: '40px', background: '#f0f4f8', padding: '20px', borderRadius: '8px', justifyContent: 'center', marginBottom: '30px' },
  metric: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  value: { fontSize: '32px', fontWeight: 'bold', color: '#0056b3' },
  label: { fontSize: '14px', color: '#666' },
  breakdownCard: { borderLeft: '4px solid #0056b3', paddingLeft: '15px', margin: '15px 0', background: '#fafafa', padding: '10px' },
  explanation: { fontSize: '13px', color: '#555', background: '#eee', padding: '6px', borderRadius: '4px' },
  closeBtn: { marginTop: '20px', padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};