const mongoose = require('mongoose');

// Symmetrical Onboarding Data Schema corresponding with frontend states
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'User full name is mandatory'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Valid email profile is mandatory'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // FIXED: Google Auth users ke liye password mandatory nahi hoga
    required: function() { return !this.googleId; }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null/crypto profiles without collision leaks
  },
  
  // Adaptive LMS metadata configuration options
  role: {
    type: String,
    default: 'Student'
  },
  domain: {
    type: String,
    default: 'Programming'
  },
  commitment: {
    type: String,
    default: '1 Hour'
  },
  experience: {
    type: String,
    default: 'Beginner'
  },
  learningStyle: {
    type: String,
    default: 'Videos'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);