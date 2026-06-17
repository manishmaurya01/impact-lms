const mongoose = require('mongoose');

const ScheduledQuizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  courseId: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: false,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  syllabusTopics: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 5
  },
  quizType: {
    type: String,
    enum: ['MCQ', 'Coding', 'Mixed'],
    default: 'MCQ'
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 10
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledWeek: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Available', 'Completed'],
    default: 'Upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScheduledQuiz', ScheduledQuizSchema);
