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
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_cognitive_quantum_lms_key_99";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";

// --- MONGOOSE PERSISTENCE SCHEMAS ---
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
      quizId: String,
      name: String,
      timeLimitMins: Number,
      totalQuestions: Number,
      syllabusScope: [String]
    },
    assignment: {
      assignmentId: String,
      name: String,
      objective: String,
      complexity: String
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);

// --- MONGO CONNECTION INITIALIZATION ---
const MONGO_URI = "mongodb+srv://mindmasters5167_db_user:r02VzCsxlIcdrSBQ@cluster0.4vnuwks.mongodb.net/lumina_learn_db?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('📡 [DATABASE_PERSISTED]: Connected to MongoDB Cloud Atlas (lumina_learn_db) successfully.'))
  .catch(err => console.error('❌ [DATA FAULT]: MongoDB link crashed:', err.message));

// --- GOOGLE GEMINI CORE ENGINE Rest CLIENT ---
const callGeminiAPI = async (userQuery, systemPrompt, customSchema) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const requestPayload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json", responseSchema: customSchema }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload)
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini pipeline block status code: ${response.status} - ${errText}`);
  }
  
  const responseData = await response.json();
  return responseData.candidates?.[0]?.content?.parts?.[0]?.text;
};

// --- AUTH PROTECTIVE SUBSYSTEM ---
const authorizeSessionToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Authorization verification parameter missing.' });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ success: false, message: 'Session telemetry handshake validation failure.' });
    req.user = decodedUser;
    next();
  });
};

// --- 1. AI COURSE GENERATION ROUTE (AUTO SAVES TO DB) ---
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: 'Target goal query instruction empty inside req payload.' });

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
                quizId: { type: "string" },
                name: { type: "string" },
                timeLimitMins: { type: "integer" },
                totalQuestions: { type: "integer" },
                syllabusScope: { type: "array", items: { type: "string" } }
              },
              required: ["quizId", "name", "timeLimitMins", "totalQuestions", "syllabusScope"]
            },
            assignment: {
              type: "object",
              properties: {
                assignmentId: { type: "string" },
                name: { type: "string" },
                objective: { type: "string" },
                complexity: { type: "string" }
              },
              required: ["assignmentId", "name", "objective", "complexity"]
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

    await persistentCourseNode.save();
    console.log(`💾 [DB_STRETCH_COMMIT]: Course blueprint locked into cloud architecture indices: ${persistentCourseNode._id}`);

    return res.status(201).json({ success: true, message: 'AI course blueprint committed into collection successfully.', data: persistentCourseNode });

  } catch (error) {
    console.error('❌ [GENERATION_DB_FAULT]:', error);
    res.status(500).json({ success: false, error: 'Database tracking or AI model pipeline crashed.', details: error.message });
  }
});

// --- 2. FETCH ALL HISTORICAL SAVED COURSES ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    console.log(`📡 [FETCH_PIPELINE]: Syncing historical dashboard nodes query for user: ${req.user.userId}`);
    const synchronizedUserHistoryRecords = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: synchronizedUserHistoryRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cloud stored dashboard registries.' });
  }
});

// --- 3. DELETE/MANAGE COURSE OPERATION ROUTE ---
app.delete('/api/courses/:id', authorizeSessionToken, async (req, res) => {
  try {
    const courseTargetId = req.params.id;
    console.log(`🗑️ [DB_MUTATION]: Deleting record parameters tracking index token reference: ${courseTargetId}`);
    
    const operationalResult = await Course.findOneAndDelete({ _id: courseTargetId, userId: req.user.userId });
    if (!operationalResult) {
      return res.status(404).json({ success: false, message: 'Target roadmap document not found or security mapping signature violation.' });
    }
    
    res.status(200).json({ success: true, message: 'Roadmap node memory safely cleared from collection.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database query execution crashed during deletion operation.' });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 [SERVER PERSISTED_CORE ONLINE]: Running safely on node port: ${PORT}`));