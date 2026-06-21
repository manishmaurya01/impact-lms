// Windows systems me local networks loopback connection errors bypass karne ke liye DNS override
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- CROSS-ORIGIN RESOURCE SHARING (CORS) SETTINGS ---
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_cognitive_quantum_lms_key_99";

// 🚀 DUAL API KEYS GATEWAY INTEGRATION
const GEMINI_PRIMARY_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KciGm1LiEU_PmoZ71sbIRsABSVhelaDxa_AwXU2b6sLA";
const GEMINI_SECONDARY_KEY = process.env.GEMINI_SECONDARY_KEY || "AQ.Ab8RN6KciGm1LiEU_PmoZ71sbIRsABSVhelaDxa_AwXU2b6sLA";

// --- MONGOOSE SCHEMAS & DATABASE MODELS ---

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const CourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  level: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  contentType: { type: String, default: "Technical" }, 
  modules: [{
    moduleId: Number,
    moduleName: String,
    objective: String,
    shortSummary: String,
    visualGuidelines: String,
    youtubeSearchQuery: String,
    topics: [String], 
    quiz: {
      name: String,
      quizTopic: String,
      duration: String
    },
    assignment: {
      name: String,
      assignmentObjective: String,
      complexity: String
    }
  }],
  createdAt: { type: Date, default: Date.now }
});
const Course = mongoose.model('Course', CourseSchema);

const MaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: Number, required: true },
  topicName: { type: String, required: true },
  htmlContent: { type: String, required: true }, 
  videoLink: { type: String, default: "https://www.youtube.com" },
  createdAt: { type: Date, default: Date.now }
});
const Material = mongoose.model('Material', MaterialSchema);

// 🚀 NEW SYSTEM COLLECTIONS FOR SECURE STUDIO QUIZ INFRASTRUCTURE
const QuizDataSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: Number, required: true },
  topicName: { type: String, required: true },
  quizName: { type: String, required: true },
  questions: [{
    id: { type: Number, required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});
const QuizData = mongoose.model('QuizData', QuizDataSchema);

const QuizResultsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizDataId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizData', required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  scorePercentage: { type: Number, required: true },
  userSelections: { type: Map, of: Number }, // Logs option selected by user for telemetry checks
  evaluatedAt: { type: Date, default: Date.now }
});
const QuizResults = mongoose.model('QuizResults', QuizResultsSchema);


// --- CLOUD ATLAS STORAGE LINK HANDSHAKE ---
const CLOUD_MONGO_URI = "mongodb+srv://mindmasters5167_db_user:r02VzCsxlIcdrSBQ@cluster0.4vnuwks.mongodb.net/lumina_learn_db?retryWrites=true&w=majority";

mongoose.connect(CLOUD_MONGO_URI)
  .then(() => console.log('📡 [DATABASE_CONNECTED]: Successfully mapped to MongoDB Cloud Atlas (lumina_learn_db)!'))
  .catch(err => console.error('❌ [DATABASE_OFFLINE]: Cloud handshake pipeline crashed:', err));


// --- UNIVERSAL GEMINI Rest API COUPLER ---
const callGeminiAPI = async (apiKey, userQuery, systemPrompt, customSchema) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const requestPayload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: customSchema
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload)
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini gateway failed code: ${response.status} - ${errText}`);
  }
  
  const responseData = await response.json();
  return responseData.candidates?.[0]?.content?.parts?.[0]?.text;
};


// --- SESSION SECURITY LAYER MIDDLEWARE ---
const authorizeSessionToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Authorization parameter missing.' });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ success: false, message: 'Session telemetry expired.' });
    req.user = decodedUser;
    next();
  });
};


// --- SECURITY ACCOUNT MANAGER ROUTERS ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ success: false, message: 'All inputs required.' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User profile already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Account node deployed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal signup validator crash.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error gateway fault.' });
  }
});


// --- 🚀 METHOD 1: COMPILES THE HIGH-LEVEL SYLLABUS LAYOUT IMMUTABLE ---
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required.' });

  const systemInstructions = `You are LuminaLearn smart pedagogical system engine. Evaluate the subject matter query. Return a structured layout containing plain string array of topics, an exclusive quiz element metadata, and assignment tracks bounds rules.`;
  
  const structuredResponseSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      level: { type: "string" },
      estimatedTime: { type: "string" },
      contentType: { type: "string" },
      modules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            moduleId: { type: "integer" },
            moduleName: { type: "string" },
            objective: { type: "string" },
            shortSummary: { type: "string" },
            youtubeSearchQuery: { type: "string" },
            visualGuidelines: { type: "string" },
            topics: { type: "array", items: { type: "string" } },
            quiz: { type: "object", properties: { name: { type: "string" }, quizTopic: { type: "string" }, duration: { type: "string" } }, required: ["name", "quizTopic", "duration"] },
            assignment: { type: "object", properties: { name: { type: "string" }, assignmentObjective: { type: "string" }, complexity: { type: "string" } }, required: ["name", "assignmentObjective", "complexity"] }
          },
          required: ["moduleId", "moduleName", "objective", "shortSummary", "youtubeSearchQuery", "visualGuidelines", "topics", "quiz", "assignment"]
        }
      }
    },
    required: ["title", "level", "estimatedTime", "contentType", "modules"]
  };

  const userQueryPrompt = `Construct a complete course matrix roadmap on the topic: "${prompt}" suited for depth layer: "${level || 'Beginner'}". Output stringified JSON format structure directly without markdown backticks wrapper strings.`;

  try {
    const rawAiText = await callGeminiAPI(GEMINI_PRIMARY_KEY, userQueryPrompt, systemInstructions, structuredResponseSchema);
    let jsonFormattedStr = rawAiText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const compiledCoursePayload = JSON.parse(jsonFormattedStr);

    const persistentCourseNode = new Course({ userId: activeUserId, ...compiledCoursePayload });
    await persistentCourseNode.save();
    return res.status(201).json({ success: true, data: persistentCourseNode });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI model pipeline crashed.' });
  }
});


// --- 🚀 METHOD 2: FLEXIBLE MULTI-THEME LAYER THE OPEN FIELD TEXT MATRIX ---
app.post('/api/courses/fetch-material', authorizeSessionToken, async (req, res) => {
  const { courseId, moduleId, topicName } = req.body;
  if (!courseId || !moduleId || !topicName) return res.status(400).json({ success: false, message: "Missing required identification metadata strings." });

  try {
    const targetCourse = await Course.findById(courseId);
    const currentLevel = targetCourse ? targetCourse.level : "Beginner"; 

    let existingMaterial = await Material.findOne({ courseId, moduleId, topicName });
    if (existingMaterial) return res.status(200).json({ success: true, data: existingMaterial });

    const materialSchema = {
      type: "object",
      properties: { htmlContent: { type: "string" }, videoLink: { type: "string" } },
      required: ["htmlContent", "videoLink"]
    };

    const systemPrompt = `You are LuminaLearn's elite senior software architect and master technical educator. Explain the given topic deeply, extensively, and completely without any rigid parameter or section boundaries. 
    Write exactly like standard unconstrained responses, using beautiful custom inline-styled HTML wrappers. Adopt perfectly to the skill level: [${currentLevel}].
    Use clean design block palettes: terminal panels with color rules #e6edf3 for codes, dark slate alerts, and sharp accent neon cards for analogies. Avoid markdown wraps.`;

    const corePrompt = `Generate an unconstrained, deeply rich educational master lecture for the technical topic: "${topicName}". Student Target Experience Skillset: "${currentLevel}". Attach a high-relevance educational YouTube watch URL link for "videoLink".`;

    const rawAiText = await callGeminiAPI(GEMINI_SECONDARY_KEY, corePrompt, systemPrompt, materialSchema);
    const parsedData = JSON.parse(rawAiText);

    const newMaterialRecord = new Material({ courseId, moduleId, topicName, ...parsedData });
    await newMaterialRecord.save();
    res.status(200).json({ success: true, data: newMaterialRecord });
  } catch (err) {
    res.status(500).json({ success: false, message: "Real-time content pipeline fault." });
  }
});


// --- 🚀 BACKEND CONTROLLER: WITH INTENSE TERMINAL LOGGING ---
app.post('/api/quiz/generate-and-save', authorizeSessionToken, async (req, res) => {
  const { courseId, moduleId, topicName, quizName } = req.body;
  
  if(!courseId || !moduleId || !topicName) {
    return res.status(400).json({ success: false, message: "Missing metadata tags." });
  }

  try {
    const customSchema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              questionText: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctOptionIndex: { type: "integer" }
            },
            required: ["id", "questionText", "options", "correctOptionIndex"]
          }
        }
      },
      required: ["questions"]
    };

    const prompt = `Generate exactly 10 technical multiple-choice questions for the advanced software concept: "${topicName}". 
    Each question must contain a unique incrementing id (1 to 10), clear questionText, an options choice list array of exactly 4 choices, and the specific correctOptionIndex (valid bounds integer 0-3).`;

    console.log(`🤖 [QUIZ_COMPILER]: Triggering Gemini matrix stream for topic: ${topicName}`);
    const rawText = await callGeminiAPI(GEMINI_SECONDARY_KEY, prompt, "You are LuminaLearn's automated strict academic test writer model.", customSchema);
    
    // 🔥 LIVE BACKEND LOGGING CHECKPOINT
    console.log("==================== 🔥 RAW GEMINI OUTPUT START ====================");
    console.log(rawText);
    console.log("==================== 🔥 RAW GEMINI OUTPUT END ======================");

    let cleanJsonStr = rawText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    let parsedQuestions;

    try {
      parsedQuestions = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      console.error("🚨 JSON parse failed locally. Attempting fallback repair...");
      
      // Force appending brackets if token payload got sliced in between
      if (!cleanJsonStr.endsWith('}')) {
        cleanJsonStr += ']}';
      }
      
      console.log("🛠️ [REPAIRED STRING ATTEMPT]:", cleanJsonStr);
      parsedQuestions = JSON.parse(cleanJsonStr);
    }

    const newQuizRecord = new QuizData({
      courseId,
      moduleId,
      topicName,
      quizName: quizName || "Sprint Evaluation Track",
      questions: parsedQuestions.questions
    });

    await newQuizRecord.save();
    res.status(200).json({ success: true, quizData: newQuizRecord });
  } catch (error) {
    console.error("❌ Quiz generation pipeline crashed. Final Error State:", error.message);
    res.status(500).json({ success: false, message: "Internal token compilation engine fault.", details: error.message });
  }
});

// --- 🚀 METHOD 4: RECORDS INDIVIDUAL PERFORMANCE EVALUATION (QUIZRESULTS) ---
app.post('/api/quiz/record-results', authorizeSessionToken, async (req, res) => {
  const { quizDataId, totalQuestions, correctAnswers, scorePercentage, userSelections } = req.body;
  
  if(!quizDataId || totalQuestions === undefined || correctAnswers === undefined) {
    return res.status(400).json({ success: false, message: "Missing evaluation execution metrics parameters." });
  }

  try {
    const finalResultNode = new QuizResults({
      userId: req.user.userId,
      quizDataId,
      totalQuestions,
      correctAnswers,
      scorePercentage,
      userSelections
    });

    await finalResultNode.save();
    console.log(`💾 [DB_QUIZ_RESULTS_SUCCESS]: Analytics logs securely committed under quizresults warehouse node.`);
    res.status(201).json({ success: true, message: "Performance metrics telemetry locked down successfully." });
  } catch (error) {
    console.error("❌ Results database tracking failure:", error);
    res.status(500).json({ success: false, message: "Database transaction telemetry recording fault." });
  }
});


// --- GET ALL SAVED COURSES ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cloud registries.' });
  }
});

// --- DELETE OPERATION ---
app.delete('/api/courses/:id', authorizeSessionToken, async (req, res) => {
  try {
    await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({ success: true, message: 'Roadmap node cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database deletion query crashed.' });
  }
});

// Start Serving Pipeline Engine
app.listen(PORT, '0.0.0.0', () => {
  console.log("-----------------------------------------------------------------");
  console.log(`🚀 [SERVER ONLINE]: Serving Open Content & Quiz Matrix on Port: ${PORT}`);
  console.log("-----------------------------------------------------------------");
});