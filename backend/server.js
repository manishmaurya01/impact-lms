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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KciGm1LiEU_PmoZ71sbIRsABSVhelaDxa_AwXU2b6sLA";

// --- MONGOOSE SCHEMAS & DATABASE MODELS ---

// 🚀 REAL USER SCHEMA FOR SESSION PERSISTENCE
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
    topics: [String],
    youtubeSearchQuery: String,
    shortSummary: String,
    visualGuidelines: String, 
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

// --- DATABASE HANDSHAKE WITH ATLAS & LOCAL FALLBACKS ---
const CLOUD_MONGO_URI = "mongodb+srv://mindmasters5167_db_user:r02VzCsxlIcdrSBQ@cluster0.4vnuwks.mongodb.net/lumina_learn_db?retryWrites=true&w=majority";
const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/lumina_learn_db";

const connectDatabase = async () => {
  mongoose.set('bufferCommands', false);
  try {
    console.log('📡 [DB_CONNECT]: Attempting Cloud MongoDB Atlas Cluster link...');
    await mongoose.connect(CLOUD_MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('📡 [DATABASE_CONNECTED]: Successfully connected to MongoDB Cloud Atlas (lumina_learn_db)!');
  } catch (cloudErr) {
    console.warn('⚠️ [CLOUD_FAILED]: Cloud MongoDB Atlas failed. Switching to Local MongoDB...');
    try {
      await mongoose.connect(LOCAL_MONGO_URI, { serverSelectionTimeoutMS: 4000 });
      console.log('📡 [DATABASE_CONNECTED]: Connected to Local MongoDB successfully!');
    } catch (localErr) {
      console.error('❌ [DATABASE_OFFLINE]: Both Cloud and Local MongoDB are offline.');
    }
  }
};
connectDatabase();

// --- GOOGLE GEMINI Rest API CONNECTOR ---
const callGeminiAPI = async (userQuery, systemPrompt, customSchema) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
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
    throw new Error(`Gemini status code error: ${response.status} - ${errText}`);
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

// --- DUMMY DIAGNOSTIC ENDPOINT ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// --- REAL REGISTER USER ROUTE ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists.' });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User compiled successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal signup error.' });
  }
});

// --- REAL LOGIN GATEWAY (SAB USER KE LIYE PROPER FIXED) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Database check for actual registered email profile
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    // Validate Encryption Match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    // Embed real matching specific userId into token session
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: "Student", domain: "Programming" }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error.' });
  }
});

// --- AI COURSE GENERATOR ---
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required.' });

  const systemInstructions = `You are LuminaLearn smart pedagogical system engine. Evaluate the subject matter query. Return a structured dynamic array match payload containing exclusive quiz elements and assignment tracks.`;
  
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
            topics: { type: "array", items: { type: "string" } },
            youtubeSearchQuery: { type: "string" },
            shortSummary: { type: "string" },
            visualGuidelines: { type: "string" },
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
          required: ["moduleId", "moduleName", "objective", "topics", "youtubeSearchQuery", "shortSummary", "visualGuidelines", "quiz", "assignment"]
        }
      }
    },
    required: ["title", "level", "estimatedTime", "contentType", "modules"]
  };

  const userQueryPrompt = `Construct a complete course matrix roadmap on the topic: "${prompt}" suited for depth layer: "${level || 'Beginner'}". Output stringified JSON format structure directly without markdown backticks wrapper strings.`;

  try {
    const rawAiText = await callGeminiAPI(userQueryPrompt, systemInstructions, structuredResponseSchema);
    let jsonFormattedStr = rawAiText.trim();
    if (jsonFormattedStr.startsWith('```')) {
      jsonFormattedStr = jsonFormattedStr.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const compiledCoursePayload = JSON.parse(jsonFormattedStr);

    const persistentCourseNode = new Course({
      userId: activeUserId, // Tied to specific logged-in user
      title: compiledCoursePayload.title,
      level: compiledCoursePayload.level,
      estimatedTime: compiledCoursePayload.estimatedTime,
      contentType: compiledCoursePayload.contentType,
      modules: compiledCoursePayload.modules
    });

    if (mongoose.connection.readyState === 1) {
      await persistentCourseNode.save();
    }

    return res.status(201).json({ success: true, data: persistentCourseNode });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI model pipeline crashed.', details: error.message });
  }
});

// --- GET ALL SAVED COURSES FOR RELEVANT ACTIVE SESSION USER ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    // Strict filter parameter optimization: Only fetch courses mapped to this user's dynamic id
    const courses = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cloud stored registries.' });
  }
});

// --- DELETE OPERATION ---
app.delete('/api/courses/:id', authorizeSessionToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({ success: false, message: 'Database layer is offline.' });
    }
    const result = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!result) return res.status(404).json({ success: false, message: 'Document not found.' });
    res.status(200).json({ success: true, message: 'Roadmap node cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database deletion query crashed.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [SERVER ONLINE]: Serving multi-user safe platform on port: ${PORT}`);
});