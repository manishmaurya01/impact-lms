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

// Local ya cloud MongoDB connection initialization
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('📡 [DATABASE_CONNECTED]: Local MongoDB database se link successfully connect ho chuka hai.'))
  .catch(err => {
    console.error('❌ [DATABASE_OFFLINE]: MongoDB link fails. Ensure Mongo service background me active hai.');
    console.error(`⚠️ [DIAGNOSTIC]: ${err.message}`);
  });

// --- GOOGLE GEMINI CORE REST CLIENT ---
// Standard lowercase schema implementation to prevent 400 Bad Request error
const callGeminiAPI = async (userQuery, systemPrompt, customSchema) => {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";
  // Crucial: Use strictly "gemini-2.5-flash-preview-09-2025" to prevent 404 model errors inside sandbox environments
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
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
      // Exponential backoff
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

    const matchedIdentity = await User.findOne({ email });
    if (matchedIdentity) {
      return res.status(400).json({ success: false, message: 'Is email par pehle se user account exist karta hai.' });
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
    console.log(`👤 [REGISTERED]: New profile node compiled for: ${email}`);
    res.status(201).json({ success: true, message: 'Workspace account node generated!' });

  } catch (error) {
    console.error('❌ [SIGNUP_FAULT]:', error);
    res.status(500).json({ success: false, message: 'Internal signup validator compile crash.' });
  }
});

// 2. STANDARD LOGIN GATEWAY
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database process connection is currently offline.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Credentials check failed. Email ya password matched nahi hai.' });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({ success: false, message: 'Ye account Google Auth use karta hai. Google SSO button se check karein.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Credentials check failed. Email ya password matched nahi hai.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, domain: user.domain }
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
      console.log(`📡 [SSO_ACTIVE]: Successfully registered Google SSO profile node: ${email}`);
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const sessionWebToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: sessionWebToken,
      isNewUser,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, domain: user.domain }
    });

  } catch (error) {
    console.error('❌ [SSO_CRYPTO_ERROR]: Verify token parameters invalid:', error);
    res.status(401).json({ success: false, message: 'SSO dynamic signatures verification failed.' });
  }
});


// --- SECTION 2: AI COURSE SYLLABUS OPERATIONS ---

// 1. GENERATE PERSONALIZED SYLLABUS & COMMIT TO MONGO
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUser = req.user.userId;

  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Goal prompt parameters empty inside requests body.' });
  }

  const systemInstructions = "You are the advanced pedagogical engine of LuminaLearn Studio. Always respond strictly inside structured JSON parameters matching the target JSON blueprint.";
  
  // Enforcing strict lowercase Open API types schema (Crucial for preventing 400 Bad Requests)
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
    Do not use any markdown formatting or code blocks. Output only a clean, stringified JSON object following this exact structure:
    {
      "title": "String",
      "level": "String",
      "modules": [
        {
          "dayId": 1,
          "title": "String Day Topic",
          "status": "Not Started",
          "duration": "2 Hours",
          "objective": "Detailed Day Learning Goal",
          "topics": ["Topic A", "Topic B"],
          "curatedSearchQuery": "YouTube Search Term String",
          "shortNotes": "AI Generated Revision Notes text block",
          "schedules": {
            "quiz": { "name": "Topic Quiz", "quizTopic": "Quiz Topic", "duration": "10 min" },
            "assignment": { "name": "Topic Assignment", "assignmentObjective": "Goal", "complexity": "Medium" }
          }
        }
      ]
    }
  `;

  try {
    console.log(`🤖 [AI_COMPILER]: Running Gemini API content pipeline for: ${prompt}`);
    const rawAiText = await callGeminiAPI(userQueryPrompt, systemInstructions, structuredResponseSchema);
    
    let jsonFormattedStr = rawAiText.trim();
    if (jsonFormattedStr.startsWith('```')) {
      jsonFormattedStr = jsonFormattedStr.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const coursePayloadParsed = JSON.parse(jsonFormattedStr);

    const committedCourse = new Course({
      userId: activeUser,
      title: coursePayloadParsed.title,
      level: coursePayloadParsed.level,
      modules: coursePayloadParsed.modules
    });

    await committedCourse.save();
    console.log(`💾 [MONGO_STRETCH]: Dynamic course tree saved! Record ID: ${committedCourse._id}`);

    // Auto schedule Day 1 Assessment details
    const randomHexId = crypto.randomBytes(4).toString('hex');
    const dayOneTopicsList = coursePayloadParsed.modules[0]?.topics || [prompt];

    const quizScheduleRecord = new ScheduledQuiz({
      quizId: randomHexId,
      userId: activeUser,
      title: `${coursePayloadParsed.title} Day 1 Assessment`,
      description: `Evaluation track to verify fundamentals regarding ${coursePayloadParsed.title}.`,
      syllabusTopics: dayOneTopicsList,
      difficulty: level || 'Beginner',
      totalQuestions: 5,
      timeLimit: 10
    });
    
    await quizScheduleRecord.save();
    console.log(`🎯 [QUIZ_SCHEDULED]: Automated evaluation setup with Id: ${randomHexId}`);

    // Return using the simple 'data' key for direct frontend consumption
    return res.status(201).json({
      success: true,
      message: 'AI Course roadmap generated and successfully saved.',
      data: committedCourse,
      scheduledQuizId: randomHexId
    });

  } catch (error) {
    console.error('❌ [AI_GENERATION_FAILED]: Detailed exception stack:', error);
    res.status(500).json({ success: false, error: 'Database pipeline or AI compiler exception occurred.', details: error.message });
  }
});

// 2. GET ROADMAP HISTORY RECORDS FOR COMPILING PROFILE
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    const coursesHistory = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coursesHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Course records logs indexing crashed.' });
  }
});


// --- SECTION 3: DYNAMIC AI ASSESSMENT ENGINES ---

// 1. START THE ASSESSMENT MODULE & GENERATE ACTIVE QUESTIONS VIA GEMINI
app.post('/api/quizzes/:quizId/start', async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quizMeta = await ScheduledQuiz.findOne({ quizId });
    if (!quizMeta) {
      return res.status(404).json({ success: false, message: 'No scheduled assessments matching this ID found.' });
    }

    const topicsStringArray = quizMeta.syllabusTopics && quizMeta.syllabusTopics.length > 0 ? quizMeta.syllabusTopics.join(', ') : 'core domain concepts';
    const systemPromptInstructions = "You are a professional educational assessor. Generate unique questions in structured JSON configuration format. Do not use markdown backticks.";
    
    // Corrected to standard lowercase OpenAPI types
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
      Create exactly ${quizMeta.totalQuestions} different MCQ questions for:
      - Assessment Domain: "${quizMeta.title}"
      - Detailed syllabus requirements: "${topicsStringArray}"
      - Difficulty parameter index: "${quizMeta.difficulty}"
    `;

    console.log(`🎲 [QUIZ_API_CALL]: Deploying model gemini-2.5-flash-preview-09-2025 to parse questions...`);
    const resultRawText = await callGeminiAPI(userQuizRequest, systemPromptInstructions, structuredQuizSchema);

    const jsonMatch = resultRawText.match(/\{[\s\S]*\}/);
    const parsedQuestionPayload = JSON.parse(jsonMatch ? jsonMatch[0] : resultRawText);

    res.status(200).json({
      success: true,
      quizId,
      title: quizMeta.title,
      description: quizMeta.description,
      totalQuestions: quizMeta.totalQuestions,
      timeLimit: quizMeta.timeLimit,
      status: quizMeta.status,
      generatedQuestions: parsedQuestionPayload.questions
    });

  } catch (error) {
    console.error('❌ [QUIZ_START_EXCEPTIONS]:', error);
    res.status(500).json({ success: false, message: 'AI Engine failed to formulate question sets.' });
  }
});

// 2. SUBMIT USER QUIZ SCORE & EXPLAIN EVALUATION
app.post('/api/quizzes/submit', async (req, res) => {
  try {
    const { quizId, userId, generatedQuestions, userAnswers } = req.body;

    if (!quizId || !userId || !Array.isArray(generatedQuestions) || typeof userAnswers !== 'object') {
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

    const testAttemptDoc = new QuizAttempt({
      attemptId: uniqueAttemptUUID,
      quizId,
      userId,
      generatedQuestions,
      userAnswers,
      score: calculatedScore,
      percentage: completionPercentage
    });

    await testAttemptDoc.save();

    await ScheduledQuiz.findOneAndUpdate(
      { quizId },
      { status: 'Completed' },
      { new: true }
    );

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


// Express server listener configuration
app.listen(PORT, () => {
  console.log("-----------------------------------------------------------------");
  console.log(`🚀 [SERVER ONLINE]: LuminaLearn Backend is actively serving on: http://localhost:${PORT}`);
  console.log("-----------------------------------------------------------------");
});
