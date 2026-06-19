// Windows systems me local networks loopback connection errors bypass karne ke liye DNS override
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// Mongoose Models mapping load karo (Ensure ye models/ directory me same filename se configured hain)
const User = require('./models/User');
const Course = require('./models/Course');
const ScheduledQuiz = require('./models/ScheduledQuiz');
const QuizAttempt = require('./models/QuizAttempt');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/LuminaLearn";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_cognitive_quantum_lms_key_99";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "245919262652-dpo9mg4hn6l2578gdv87ttgf8lfsg2tc.apps.googleusercontent.com";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json()); // Postman body parse karne ke liye crucial parser

// Buffer logic false karo taaki database slow transitions drop timeout issues create na karein
mongoose.set('bufferCommands', false);

// Local ya cloud MongoDB connection initialization (Read-only status monitoring)
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('📡 [DATABASE_CONNECTED]: Connected to database (Read-only mode initialized).'))
  .catch(err => {
    console.warn('⚠️ [DATABASE_OFFLINE]: MongoDB is offline. Running application on in-memory mode seamlessly.');
  });

// --- GOOGLE GEMINI CORE REST CLIENT ---
const callGeminiAPI = async (userQuery, systemPrompt, customSchema) => {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";
  
  // 🚀 FIXED MODEL NAME PATH TO PREVENT 404 ERRORS inside API requests
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const requestPayload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: customSchema
    }
  };

  let retryDelay = 1000; 
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini status query error code: ${response.status} - ${errText}`);
      }
      
      const responseData = await response.json();
      const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        return generatedText;
      }
      throw new Error("Payload text format parsing fails.");
    } catch (err) {
      console.warn(`⚠️ [GEMINI_RETRY]: Connection attempt ${attempt + 1} failed. Re-trying in ${retryDelay}ms... Error: ${err.message}`);
      if (attempt === 4) {
        throw new Error(`Gemini attempts exhausted. Trace: ${err.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 2;
    }
  }
};

// --- AUTH TOKEN SECURITY BARRIER ---
const authorizeSessionToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Authorization token parameter missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Session validation token invalid ya expired hai.' });
    }
    req.user = decodedUser;
    next();
  });
};


// --- SECTION 1: USER ACCOUNT PORTS ---

// 1. REGISTER USER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, role, domain, commitment, experience, learningStyle } = req.body;

    console.log(`👤 [DRY_RUN_REGISTER]: Memory mock compiled for user: ${email} (Bypassed DB Save)`);
    res.status(201).json({ 
      success: true, 
      message: 'Workspace credentials mock initialized successfully.',
      user: { fullName, email, role, domain }
    });

  } catch (error) {
    console.error('❌ [SIGNUP_FAULT]:', error);
    res.status(500).json({ success: false, message: 'Internal signup validator compile crash.' });
  }
});

// 2. STANDARD LOGIN GATEWAY
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;

    const mockUserId = new mongoose.Types.ObjectId();
    const token = jwt.sign(
      { userId: mockUserId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`🔑 [LOGIN_HANDSHAKE]: Issued mock memory token for: ${email}`);
    res.status(200).json({
      success: true,
      token,
      user: { id: mockUserId, fullName: "Manish Maurya", email, role: "Student", domain: "Programming" }
    });

  } catch (error) {
    console.error('❌ [LOGIN_FAULT]:', error);
    res.status(500).json({ success: false, message: 'Authentication runtime error.' });
  }
});

// 3. SECURE GOOGLE SSO HANDSHAKE
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Google identity validation payload missing.' });

    const verificationTicket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = verificationTicket.getPayload();
    const { email, name, sub: googleId } = payload;

    const mockUserId = new mongoose.Types.ObjectId();
    const sessionWebToken = jwt.sign(
      { userId: mockUserId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`📡 [SSO_ACTIVE]: Successfully bypassed DB writes and generated session node for SSO payload: ${email}`);

    res.status(200).json({
      success: true,
      token: sessionWebToken,
      isNewUser: true,
      user: { id: mockUserId, fullName: name, email, role: 'Student', domain: 'Programming' }
    });

  } catch (error) {
    console.error('❌ [SSO_CRYPTO_ERROR]: Verify token parameters invalid:', error);
    res.status(401).json({ success: false, message: 'SSO dynamic signatures verification failed.' });
  }
});


// --- SECTION 2: AI COURSE SYLLABUS OPERATIONS ---

// GENERATE PERSONALIZED SYLLABUS & COMMIT (DB WRITE BYPASSED)
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUser = req.user.userId;

  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Goal prompt parameters empty inside requests body.' });
  }

  const systemInstructions = "You are the advanced pedagogical engine of LuminaLearn Studio. Always respond strictly inside structured JSON parameters matching the target JSON blueprint.";
  
  const structuredResponseSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      level: { type: "string" },
      modules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            dayId: { type: "integer" },
            title: { type: "string" },
            status: { type: "string" },
            duration: { type: "string" },
            objective: { type: "string" },
            topics: { type: "array", items: { type: "string" } },
            curatedSearchQuery: { type: "string" },
            shortNotes: { type: "string" },
            schedules: {
              type: "object",
              properties: {
                quiz: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    quizTopic: { type: "string" },
                    duration: { type: "string" }
                  },
                  required: ["name", "quizTopic", "duration"]
                },
                assignment: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    assignmentObjective: { type: "string" },
                    complexity: { type: "string" }
                  },
                  required: ["name", "assignmentObjective", "complexity"]
                }
              },
              required: ["quiz", "assignment"]
            }
          },
          required: ["dayId", "title", "status", "duration", "objective", "topics", "curatedSearchQuery", "shortNotes", "schedules"]
        }
      }
    },
    required: ["title", "level", "modules"]
  };

  const userQueryPrompt = `
    Create a highly personalized 4-day learning roadmap on the topic: "${prompt}" matching level: "${level || 'Beginner'}".
    For each of the 4 days, generate detailed subtopics, specific high-quality Youtube search queries to find tutorials, short notes (1-2 sentences), and a scheduled quiz/assignment name.
    Do not use any markdown formatting or code blocks. Output only a clean, stringified JSON object matching the requested schema.
  `;

  try {
    console.log(`🤖 [AI_COMPILER]: Running Gemini API content pipeline for: ${prompt} (In-Memory Stream Active)`);
    const rawAiText = await callGeminiAPI(userQueryPrompt, systemInstructions, structuredResponseSchema);
    
    let jsonFormattedStr = rawAiText.trim();
    if (jsonFormattedStr.startsWith('```')) {
      jsonFormattedStr = jsonFormattedStr.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const coursePayloadParsed = JSON.parse(jsonFormattedStr);

    console.log(`💡 [BYPASS_DB_SAVE]: Course generated but skip save triggers executing cleanly.`);

    const randomHexId = crypto.randomBytes(4).toString('hex');

    return res.status(201).json({
      success: true,
      message: 'AI Course roadmap generated and fetched successfully (Bypassed DB Write).',
      data: {
        _id: new mongoose.Types.ObjectId(),
        userId: activeUser,
        title: coursePayloadParsed.title,
        level: coursePayloadParsed.level,
        modules: coursePayloadParsed.modules,
        createdAt: new Date()
      },
      scheduledQuizId: randomHexId
    });

  } catch (error) {
    console.error('❌ [AI_GENERATION_FAILED]: Detailed exception stack:', error);
    res.status(500).json({ success: false, error: 'Database pipeline or AI compiler exception occurred.', details: error.message });
  }
});

// GET ROADMAP HISTORY RECORDS FOR COMPILING PROFILE
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    console.log(`📡 [MOCK_HISTORY]: Returning empty mock course arrays to prevent blocking errors.`);
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Course records logs indexing crashed.' });
  }
});


// --- SECTION 3: DYNAMIC AI ASSESSMENT ENGINES ---

// START THE ASSESSMENT MODULE & GENERATE ACTIVE QUESTIONS VIA GEMINI (NO DB READS)
app.post('/api/quizzes/:quizId/start', authorizeSessionToken, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const systemPromptInstructions = "You are a professional educational assessor. Generate unique questions in structured JSON configuration format.";
    
    const structuredQuizSchema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctAnswer: { type: "string" },
              explanation: { type: "string" }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      },
      required: ["questions"]
    };

    const userQuizRequest = `
      Create exactly 5 different challenging MCQ questions for:
      - Assessment Domain: "LuminaLearn General Assessment Verification Block"
      - Detailed syllabus requirements: "Advanced concepts, optimizations, and structural parameters"
      - Difficulty parameter index: "Medium"
    `;

    console.log(`🎲 [QUIZ_API_CALL]: Deploying model gemini-2.5-flash to formulate questions directly...`);
    const resultRawText = await callGeminiAPI(userQuizRequest, systemPromptInstructions, structuredQuizSchema);

    let cleanJson = resultRawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }
    const parsedQuestionPayload = JSON.parse(cleanJson);

    res.status(200).json({
      success: true,
      quizId,
      title: "Quick Dynamic Assessment",
      description: "Evaluation metrics synthesized dynamically in-memory without accessing Mongo documents.",
      totalQuestions: 5,
      timeLimit: 10,
      status: "Active",
      generatedQuestions: parsedQuestionPayload.questions
    });

  } catch (error) {
    console.error('❌ [QUIZ_START_EXCEPTIONS]:', error);
    res.status(500).json({ success: false, message: 'AI Engine failed to formulate question sets.' });
  }
});

// SUBMIT USER QUIZ SCORE & EXPLAIN EVALUATION (NO DB WRITES)
app.post('/api/quizzes/submit', authorizeSessionToken, async (req, res) => {
  try {
    const { quizId, generatedQuestions, userAnswers } = req.body;

    if (!Array.isArray(generatedQuestions) || typeof userAnswers !== 'object') {
      return res.status(400).json({ success: false, message: 'Symmetric validation attributes missing.' });
    }

    let calculatedScore = 0;
    const testBreakdown = generatedQuestions.map((question, index) => {
      const selectedOption = userAnswers[index] || null;
      const isCorrect = selectedOption === question.correctAnswer;
      if (isCorrect) calculatedScore += 1;

      return {
        index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: selectedOption,
        isCorrect,
        explanation: question.explanation
      };
    });

    const completionPercentage = Math.round((calculatedScore / generatedQuestions.length) * 100);
    const uniqueAttemptUUID = crypto.randomBytes(6).toString('hex');

    console.log(`💡 [BYPASS_WRITE]: Quiz submission evaluated purely in-memory. Skip writing Attempt Document.`);

    res.status(200).json({
      success: true,
      attemptId: uniqueAttemptUUID,
      score: calculatedScore,
      percentage: completionPercentage,
      correctCount: calculatedScore,
      wrongCount: generatedQuestions.length - calculatedScore,
      breakdown: testBreakdown
    });

  } catch (error) {
    console.error('❌ [QUIZ_EVALUATION_FAULT]:', error);
    res.status(500).json({ success: false, message: 'Server failed to process quiz assessment grading.' });
  }
});

// Express server listener configuration (strictly binding on 0.0.0.0 to prevent network errors)
app.listen(PORT, '0.0.0.0', () => {
  console.log("-----------------------------------------------------------------");
  console.log(`🚀 [SERVER ONLINE]: LuminaLearn Backend is serving on: http://127.0.0.1:${PORT} (In-Memory Processing Node)`);
  console.log("-----------------------------------------------------------------");
});