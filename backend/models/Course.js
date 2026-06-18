const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quizTopic: { type: String, required: true }, // For future on-the-fly dynamic rendering hooks
  duration: { type: String, default: "15 Mins" }
});

const AssignmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignmentObjective: { type: String, required: true },
  complexity: { type: String, default: "Medium" }
});

const ModuleDaySchema = new mongoose.Schema({
  dayId: { type: Number, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['unlocked', 'locked'], default: 'locked' },
  duration: { type: String, required: true }, // e.g., "Day 01"
  objective: { type: String, required: true },
  topics: [{ type: String }],
  schedules: {
    quiz: QuizSchema,
    assignment: AssignmentSchema
  }
});

const CourseRoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ties roadmap dynamically to its user node
  title: { type: String, required: true },
  level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  createdAt: { type: Date, default: Date.now },
  modules: [ModuleDaySchema]
});

module.exports = mongoose.model('Course', CourseRoadmapSchema);