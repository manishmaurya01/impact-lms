import React from 'react';

export default function QuizCard({ quiz, onStartQuiz }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{quiz.title}</h3>
      <p><strong>Topics:</strong> {Array.isArray(quiz.syllabus) ? quiz.syllabus.join(', ') : quiz.syllabus}</p>
      
      <div style={styles.metaGrid}>
        <span><strong>Difficulty:</strong> {quiz.difficulty}</span>
        <span><strong>Questions:</strong> {quiz.totalQuestions}</span>
        <span><strong>Time Limit:</strong> {quiz.timeLimit} Mins</span>
      </div>

      {quiz.status === 'Available' ? (
        <button style={styles.startButton} onClick={() => onStartQuiz(quiz.quizId)}>
          Start Quiz
        </button>
      ) : (
        <button style={styles.disabledButton} disabled>
          {quiz.status}
        </button>
      )}
    </div>
  );
}

const styles = {
  card: { border: '1px solid #ddd', padding: '16px', borderRadius: '8px', margin: '12px 0', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  title: { margin: '0 0 8px 0', color: '#333' },
  metaGrid: { display: 'flex', gap: '16px', margin: '12px 0', fontSize: '14px', color: '#666' },
  startButton: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#cccccc', color: '#666666', padding: '10px 16px', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }
};