// Add this at the very top of your server.js file to resolve local DNS loops smoothly
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { GoogleGenAI } = require('@google/genai');

// Load configurations fallback mapping from models folder
const User = require('./models/User');
<<<<<<< HEAD
const ScheduledQuiz = require('./models/ScheduledQuiz');
const QuizAttempt = require('./models/QuizAttempt');
const crypto = require('crypto');
=======
const Course = require('./models/Course');
>>>>>>> 55c2d34 (new commit)

const app = express();

// --- GLOBAL CONFIGURATION SETTINGS ---
// Hardcoded token validation pipeline parameters to bypass environment breaks completely
const HARDCODED_GEMINI_KEY = "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";
const JWT_SECRET_KEY = "your_super_secret_session_encryption_key_matrix_99";
const GOOGLE_CLIENT_ID_KEY = "your_google_client_id_here";
const MONGO_URI_FALLBACK = "mongodb://127.0.0.1:27017/LuminaLearn";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID_KEY);

console.log("-----------------------------------------------------------------");
console.log("🔑 [AI_INIT]: Embedding Core Gemini Client with Direct Token Payload Stream.");
console.log("-----------------------------------------------------------------");

// Initialize official GoogleGenAI Client using direct authorization parameters
const ai = new GoogleGenAI({ apiKey: HARDCODED_GEMINI_KEY });

// --- PIPELINE CORE MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// Defensive Configuration to prevent Mongoose from buffering queries indefinitely on connection drops
mongoose.set('bufferCommands', false);

// Telemetry database connectivity setup
mongoose.connect(MONGO_URI_FALLBACK, {
  serverSelectionTimeoutMS: 5000, 
})
  .then(() => console.log('📡 [TELEMETRY]: Connected to MongoDB Cloud Architecture Engine successfully.'))
  .catch(err => {
    console.error('❌ [DATA LAYER FAULT]: MongoDB Connection Error:', err.message);
  });

// --- JWT IDENTITY MATRIX VERIFICATION SUBSYSTEM ---
const authenticateSessionToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Workspace token identity mapping missing.' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token telemetry matrix signature or expired session.' });
    }
    req.user = decodedPayload; 
    next();
  });
};


// --- 1. AUTHENTICATION ROUTING CAPSULES ---

// SIGN UP (REGISTER NODE)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, role, domain, commitment, experience, learningStyle } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Identity Node already active with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    res.status(201).json({ success: true, message: 'Workspace credentials initialized! User Node compiled successfully.' });

  } catch (error) {
    console.error('❌ [COMPILE FAULT]: Registration process crashed:', error);
    res.status(500).json({ success: false, message: 'Symmetric internal system compile error during registration.' });
  }
});

// SIGN IN (LOGIN NODE)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database layer is offline. Telemetry synchronization failed.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email address or unauthorized credentials setup.' });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please click the Google button to access.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email address or unauthorized credentials setup.' });
    }

    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, domain: user.domain }
    });

  } catch (error) {
    console.error('❌ [AUTH CORRUPTION]: Login process crashed:', error);
    res.status(500).json({ success: false, message: 'Symmetric internal system compile error during login.' });
  }
});

// SECURE GOOGLE OAUTH HANDSHAKE HANDLER
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Google identification token missing.' });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database layer is offline. Telemetry synchronization failed.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID_KEY
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({ fullName: name, email: email, googleId: googleId, role: 'Student', domain: 'Programming' });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionToken,
      isNewUser,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, domain: user.domain }
    });

  } catch (error) {
    console.error('❌ [CRYPTO CRASH]: Google Auth Handshake Error:', error);
    res.status(401).json({ success: false, message: 'Cryptographic signature validation failed or unauthorized entity.' });
  }
});


// --- 2. DYNAMIC AI ROADMAPS CONTROL SUITE ROLES ---

/**
 * Route: POST /api/courses/generate
 * Description: Streams responseSchema directly via embedded API key, and saves course inside DB.
 */
app.post('/api/courses/generate', authenticateSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: "Missing parameter instructions inside request body." });

  const strategicPromptSystemDesign = `
    Create a personalized 4-day learning roadmap for: "${prompt}" matching level: "${level || 'Beginner'}".
    Structure a strict day-wise chronological matrix mapping exactly 4 days.
    Return ONLY a single valid JSON object following the schema format. Do not include markdown codeblocks or triple backticks.
  `;

  try {
    console.log(`[AI_ENGINE] Initializing generation query chain for user node: ${activeUserId}...`);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: strategicPromptSystemDesign,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            level: { type: 'STRING' },
            modules: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  dayId: { type: 'INTEGER' },
                  title: { type: 'STRING' },
                  status: { type: 'STRING' },
                  duration: { type: 'STRING' },
                  objective: { type: 'STRING' },
                  topics: { type: 'ARRAY', items: { type: 'STRING' } },
                  schedules: {
                    type: 'OBJECT',
                    properties: {
                      quiz: {
                        type: 'OBJECT',
                        properties: { name: { type: 'STRING' }, quizTopic: { type: 'STRING' }, duration: { type: 'STRING' } },
                        required: ['name', 'quizTopic', 'duration']
                      },
                      assignment: {
                        type: 'OBJECT',
                        properties: { name: { type: 'STRING' }, assignmentObjective: { type: 'STRING' }, complexity: { type: 'STRING' } },
                        required: ['name', 'assignmentObjective', 'complexity']
                      }
                    },
                    required: ['quiz', 'assignment']
                  }
                },
                required: ['dayId', 'title', 'status', 'duration', 'objective', 'topics', 'schedules']
              }
            }
          },
          required: ['title', 'level', 'modules']
        }
      }
    });

    console.log("[AI_ENGINE_RAW_TEXT_STREAM]: Data packages successfully fetched.");

    let jsonRawString = response.text.trim();
    if (jsonRawString.startsWith('```')) {
      jsonRawString = jsonRawString.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const compiledResponseData = JSON.parse(jsonRawString);
    
    // Links course document dynamically to current logged-in user id
    const dynamicCourseDocument = new Course({
      userId: activeUserId,
      title: compiledResponseData.title,
      level: compiledResponseData.level,
      modules: compiledResponseData.modules
    });

    await dynamicCourseDocument.save();
    console.log(`[DB_SUCCESS] Dynamic roadmap successfully committed to MongoDB.`);
    
    return res.status(201).json({ success: true, data: dynamicCourseDocument });

  } catch (error) {
    console.error("❌ [AI_GENERATION_FAULT] Detailed Error Matrix Stack:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal generation pipeline fault failed to compile roadmap.", 
      details: error.message 
    });
  }
});

<<<<<<< HEAD
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
=======
/**
 * Route: GET /api/courses
 * Description: Fetches logs from MongoDB generated only by the active user.
 */
app.get('/api/courses', authenticateSessionToken, async (req, res) => {
  try {
    console.log(`[DB_FETCH] Pulling course histories mapping for active user session token: ${req.user.userId}`);
    const userSpecificCourseHistory = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: userSpecificCourseHistory });
  } catch (error) {
    console.error("❌ [DB_FETCH_FAULT] Failed to retrieve records:", error.message);
    res.status(500).json({ success: false, message: "Failed to map historical compiled roadmap logs indices from server." });
  }
});

>>>>>>> 55c2d34 (new commit)
