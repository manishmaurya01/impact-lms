// Windows systems me local networks loopback connection errors bypass karne ke liye DNS override
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";

// --- MONGOOSE SCHEMAS & DATABASE MODELS ---
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

// --- DUAL-STAGE DATABASE HANDSHAKE WITH ATLAS & LOCAL FALLBACKS ---
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
      console.log('💡 [MEMORY_MODE]: Running dynamically in-memory mode seamlessly.');
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

// --- DUMMY DIAGNOSTIC ENDPOINT FOR NETWORK VERIFICATION ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "LuminaLearn backend is alive and accessible!",
    dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// --- REGISTER USER ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email } = req.body;
    res.status(201).json({ 
      success: true, 
      message: 'Workspace credentials node compiled successfully (Dry-Run Mode).',
      user: { fullName, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal signup validator crash.' });
  }
});

// --- LOGIN GATEWAY ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const mockUserId = new mongoose.Types.ObjectId();
    const token = jwt.sign({ userId: mockUserId, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      token,
      user: { id: mockUserId, fullName: "Manish Maurya", email, role: "Student", domain: "Programming" }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error.' });
  }
});

// --- AI COURSE GENERATOR (AUTO SAVE TO DB IF ONLINE) ---
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required.' });

  const systemInstructions = `You are LuminaLearn smart pedagogical system engine. Evaluate the subject matter query. 
  If it is technical (coding/engineering), generate modular tracks accordingly. 
  If it is non-technical (e.g., sports, dance, cooking, fitness), remove code tasks and focus completely on visual guidelines, physical postures, training frameworks, or real-life demonstration mapping.
  You must capture this mapping strategy inside the fields 'contentType' ("Technical" or "Non-Technical") and 'visualGuidelines' (detailing what charts, images, actions or postures to verify). Every single module block must scale dynamically and must contain an exclusive quiz element data bundle and an assignment track.`;
  
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
    console.log(`🤖 [AI_ENGINE]: Parsing course data stream elements structure for user: ${activeUserId}`);
    const rawAiText = await callGeminiAPI(userQueryPrompt, systemInstructions, structuredResponseSchema);
    
    let jsonFormattedStr = rawAiText.trim();
    if (jsonFormattedStr.startsWith('```')) {
      jsonFormattedStr = jsonFormattedStr.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const compiledCoursePayload = JSON.parse(jsonFormattedStr);

    const persistentCourseNode = new Course({
      userId: activeUserId,
      title: compiledCoursePayload.title,
      level: compiledCoursePayload.level,
      estimatedTime: compiledCoursePayload.estimatedTime,
      contentType: compiledCoursePayload.contentType,
      modules: compiledCoursePayload.modules
    });

    if (mongoose.connection.readyState === 1) {
      await persistentCourseNode.save();
      console.log(`💾 [DB_SUCCESS]: Course successfully saved inside active MongoDB collection.`);
    } else {
      console.log(`💡 [MEMORY_MODE]: Database is offline. Outputting generated roadmap directly without save.`);
    }

    return res.status(201).json({ success: true, data: persistentCourseNode });

  } catch (error) {
    console.error('❌ [GENERATION_FAULT]:', error);
    res.status(500).json({ success: false, error: 'AI model pipeline crashed.', details: error.message });
  }
});

// --- GET ALL SAVED COURSES ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const courses = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cloud stored registries.' });
  }
});

// --- DELETE/MANAGE COURSE OPERATION ROUTE ---
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

// Strictly binding on '0.0.0.0' interface so other computers on local network can connect easily
app.listen(PORT, '0.0.0.0', () => {
  console.log("-----------------------------------------------------------------");
  console.log(`🚀 [SERVER ONLINE]: LuminaLearn Backend is fully serving on port: ${PORT}`);
  console.log("-----------------------------------------------------------------");
});