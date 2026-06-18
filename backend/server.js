// Add this at the very top of your server.js file
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const User = require('./models/User');
const ScheduledQuiz = require('./models/ScheduledQuiz');
const QuizAttempt = require('./models/QuizAttempt');
const crypto = require('crypto');

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- PIPELINE MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- TELEMETRY DATA LAYER CONNECTIVITY ---
const mongoURI = "mongodb://127.0.0.1:27017/LuminaLearn";

// Defensive Configuration to prevent Mongoose from buffering queries indefinitely on connection drops
mongoose.set('bufferCommands', false);

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000, // Terminate connection attempt after 5s if network is blocked
})
  .then(() => console.log('📡 [TELEMETRY]: Connected to MongoDB Atlas Cloud Database successfully.'))
  .catch(err => {
    console.error('❌ [DATA LAYER FAULT]: MongoDB Connection Error:', err.message);
    console.error('⚠️ [DIAGNOSTIC]: Verify your local network DNS, or ensure your public IP is whitelisted in Atlas Network Access.');
  });


// --- AUTHENTICATION ROUTING CAPSULES ---

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

    // Check if identity mapping already exists
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

    // Commit new user profile to database cluster
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
    console.error('❌ [COMPILE FAULT]: Registration process crashed:', error);
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

    // Ensure database connection is up before evaluating
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database layer is offline. Telemetry synchronization failed.'
      });
    }

    // Query active node credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Protection for Google-Only registered profiles
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please click the Google button to access.'
      });
    }

    // Decrypt and compare input hashes
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address or unauthorized credentials setup.' 
      });
    }

    // Sign Secure JWT Authentication Token (24-hour workspace session)
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
    console.error('❌ [AUTH CORRUPTION]: Login process crashed:', error);
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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database layer is offline. Telemetry synchronization failed.'
      });
    }

    // Verify token payload integrity with Google cryptographic servers
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        fullName: name,
        email: email,
        googleId: googleId,
        role: 'Student',
        domain: 'Programming'
      });
      await user.save();
    } else if (!user.googleId) {
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
    console.error('❌ [CRYPTO CRASH]: Google Auth Handshake Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Cryptographic signature validation failed or unauthorized entity.' 
    });
  }
});

<<<<<<< HEAD
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
=======
// --- ENGINE INITIALIZATION ---
>>>>>>> b1d2629 (adding gemini ai into the project, manish module)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 LuminaLearn Engine Online on telemetry port: ${PORT}`));