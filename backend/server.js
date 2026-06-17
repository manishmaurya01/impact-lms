const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // FIXED: Loaded Google OAuth Engine
require('dotenv').config();

const User = require('./models/User');
const ScheduledQuiz = require('./models/ScheduledQuiz');
const QuizAttempt = require('./models/QuizAttempt');
const crypto = require('crypto');

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- MIDDLAWARES ---
app.use(cors()); // Blocks Cross-Origin errors between React (port 3000) and Server (port 5000)
app.use(express.json()); // Parses incoming JSON request bodies

// --- DATABASE HANDSHAKE ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('📡 Connected to MongoDB Atlas Cloud Database successfully.'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- API AUTHENTICATION ENDPOINTS ---

// 1. SIGN UP (REGISTER NODE)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      role, 
      domain, 
      commitment, 
      experience, 
      learningStyle 
    } = req.body;

    // Check if email already exists in system database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identity Node already active with this email address.' 
      });
    }

    // Secure Password Hashing (Blowfish Cryptography)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save and register User metadata profile to MongoDB cluster
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Student',
      domain: domain || 'Programming',
      commitment: commitment || '1 Hour',
      experience: experience || 'Beginner',
      learningStyle: learningStyle || 'Videos'
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: 'Workspace credentials initialized! User Node compiled successfully.' 
    });

  } catch (error) {
    console.error('Registration process crashed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Symmetric internal system compile error during registration.' 
    });
  }
});

// 2. SIGN IN (LOGIN NODE)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user matching verified email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Protection for Google-Only registered profiles attempting standard login without password
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please click the Google button to access.'
      });
    }

    // Decrypt and compare target input password with MongoDB hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Sign Secure JWT Authentication Token (Valid for 24 hours session)
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        domain: user.domain
      }
    });

  } catch (error) {
    console.error('Login process crashed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Symmetric internal system compile error during login.' 
    });
  }
});

// 3. SECURE GOOGLE OAUTH HANDSHAKE HANDLER
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google identification token missing.' });
    }

    // Verify token identity payload integrity signatures directly with Google cryptographic servers
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Find if user cluster map already exists via email or googleId
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Naya profile compile karein (Bachi hui UI details form preferences se aayengi)
      user = new User({
        fullName: name,
        email: email,
        googleId: googleId,
        // Default placeholders jab tak step 2 & 3 complete na ho frontend pe
        role: 'Student',
        domain: 'Programming'
      });
      await user.save();
    } else if (!user.googleId) {
      // Agar email system mein local entry se tha, toh google ID link kardo telemetry ke liye
      user.googleId = googleId;
      await user.save();
    }

    // Sign Application Cluster Web Token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      isNewUser,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        domain: user.domain
      }
    });

  } catch (error) {
    console.error('Google Auth Handshake Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Cryptographic signature validation failed or unauthorized entity.' 
    });
  }
});

// 4. QUIZ MODULE ENDPOINTS
const callGeminiForQuestions = async ({ title, syllabusTopics, difficulty, totalQuestions, quizType }) => {
  const topicsList = syllabusTopics && syllabusTopics.length > 0 ? syllabusTopics.join(', ') : 'general programming topics';
  const systemPrompt = `You are an expert quiz generator. Generate exactly ${totalQuestions} ${quizType} questions for a learner. Return only valid JSON in the format { "questions": [ ... ] } with no extra text.`;
  const userPrompt = `Create ${totalQuestions} ${quizType} questions for the following quiz configuration:\n- Title: ${title}\n- Topics: ${topicsList}\n- Difficulty: ${difficulty}\n- Output format: JSON with properties question, options, correctAnswer, explanation. Each option should be unique. Use concise, clear phrasing.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const jsonMatch = content.match(/\{[\s\S]*\}$/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

    if (!parsed || !Array.isArray(parsed.questions)) {
      throw new Error('Gemini returned invalid question JSON structure.');
    }

    parsed.questions.forEach((question, index) => {
      if (!question.question || !Array.isArray(question.options) || question.options.length < 2 || !question.correctAnswer || !question.explanation) {
        throw new Error(`Gemini question ${index + 1} is missing required fields.`);
      }
    });

    return parsed.questions;
  } catch (error) {
    console.error('Gemini request failed:', error);
    throw error;
  }
};

app.post('/api/quizzes/:quizId/start', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.body.userId || null;

    const scheduledQuiz = await ScheduledQuiz.findOne({ quizId });
    if (!scheduledQuiz) {
      return res.status(404).json({ success: false, message: 'Scheduled quiz not found.' });
    }

    const questions = await callGeminiForQuestions({
      title: scheduledQuiz.title,
      syllabusTopics: scheduledQuiz.syllabusTopics,
      difficulty: scheduledQuiz.difficulty,
      totalQuestions: scheduledQuiz.totalQuestions,
      quizType: scheduledQuiz.quizType
    });

    res.status(200).json({
      success: true,
      quizId,
      title: scheduledQuiz.title,
      description: scheduledQuiz.description,
      totalQuestions: scheduledQuiz.totalQuestions,
      timeLimit: scheduledQuiz.timeLimit,
      status: scheduledQuiz.status,
      generatedQuestions: questions
    });
  } catch (error) {
    console.error('/api/quizzes/:quizId/start error:', error);
    res.status(500).json({ success: false, message: 'Unable to start quiz at this time.' });
  }
});

app.post('/api/quizzes/submit', async (req, res) => {
  try {
    const { quizId, userId, generatedQuestions, userAnswers } = req.body;

    if (!quizId || !userId || !Array.isArray(generatedQuestions) || typeof userAnswers !== 'object') {
      return res.status(400).json({ success: false, message: 'Required submission data missing or malformed.' });
    }

    let score = 0;
    const breakdown = generatedQuestions.map((question, index) => {
      const selected = userAnswers[index] || null;
      const isCorrect = selected === question.correctAnswer;
      if (isCorrect) score += 1;
      return {
        index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: selected,
        isCorrect,
        explanation: question.explanation
      };
    });

    const percentage = Math.round((score / generatedQuestions.length) * 100);
    const attemptId = crypto.randomUUID();

    const quizAttempt = new QuizAttempt({
      attemptId,
      quizId,
      userId,
      generatedQuestions,
      userAnswers,
      score,
      percentage,
      completedAt: new Date()
    });

    await quizAttempt.save();

    const quizUpdate = await ScheduledQuiz.findOneAndUpdate(
      { quizId, userId },
      { status: 'Completed' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      attemptId,
      score,
      percentage,
      correctCount: score,
      wrongCount: generatedQuestions.length - score,
      breakdown
    });
  } catch (error) {
    console.error('/api/quizzes/submit error:', error);
    res.status(500).json({ success: false, message: 'Submission failed. Please try again.' });
  }
});

// Port Handshake Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server online on port ${PORT}`));