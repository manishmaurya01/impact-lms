// Local loops ko bypass karne ke liye default loop configuration setting
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { tavily } = require("@tavily/core");
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

// --- TAVILY API CLIENT INITIALIZATION ---
// Apni custom free credits key .env me daal dena ya direct yahan replace kar sakte ho
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "tvly-YOUR_FREE_CREDITS_KEY_HERE";
const tvly = tavily({ apiKey: TAVILY_API_KEY });

// --- MONGOOSE PERSISTENT ROADMAP SCHEMA ---
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

// --- MONGO INSTANCE INITIALIZATION ---
const CLOUD_MONGO_URI = "mongodb+srv://mindmasters5167_db_user:r02VzCsxlIcdrSBQ@cluster0.4vnuwks.mongodb.net/lumina_learn_db?retryWrites=true&w=majority";
const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/lumina_learn_db";

const connectDatabase = async () => {
  mongoose.set('bufferCommands', false);
  try {
    await mongoose.connect(CLOUD_MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('📡 [DATABASE_CONNECTED]: Connected to MongoDB Cloud Atlas successfully!');
  } catch (cloudErr) {
    try {
      await mongoose.connect(LOCAL_MONGO_URI, { serverSelectionTimeoutMS: 4000 });
      console.log('📡 [DATABASE_CONNECTED]: Connected to Local MongoDB successfully!');
    } catch (localErr) {
      console.error('❌ [DATABASE_OFFLINE]: DB Subsystems offline.');
    }
  }
};
connectDatabase();

// --- GOOGLE GEMINI CORE Rest CLIENT ---
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
    throw new Error(`Gemini status query error: ${response.status} - ${errText}`);
  }
  
  const responseData = await response.json();
  return responseData.candidates?.[0]?.content?.parts?.[0]?.text;
};

// --- SECURITY HANDSHAKE MIDDLEWARE ---
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

// --- DIAGNOSTIC HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: "Server is online and working!" });
});

// --- AI ROADMAP SCHEMATIC GENERATOR ---
app.post('/api/courses/generate', authorizeSessionToken, async (req, res) => {
  const { prompt, level } = req.body;
  const activeUserId = req.user.userId;

  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt instruction empty inside payload.' });

  const systemInstructions = `You are LuminaLearn smart pedagogical architecture system. Evaluate the subject matter query and generate dynamic modular modules containing sub-topics as elements inside text arrays fields.`;
  
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
            shortSummary: { type: "string" },
            visualGuidelines: { type: "string" },
            quiz: {
              name: { type: "string" },
              quizTopic: { type: "string" },
              duration: { type: "string" }
            },
            assignment: {
              name: { type: "string" },
              assignmentObjective: { type: "string" },
              complexity: { type: "string" }
            }
          },
          required: ["moduleId", "moduleName", "objective", "topics", "shortSummary", "visualGuidelines", "quiz", "assignment"]
        }
      }
    },
    required: ["title", "level", "estimatedTime", "contentType", "modules"]
  };

  const userQueryPrompt = `Construct a clear structural course layout blueprint matrix for: "${prompt}" suited for layer: "${level || 'Beginner'}". Output stringified JSON format structure directly without markdown formatting backticks strings.`;

  try {
    console.log(`🤖 [AI_INITIALIZER]: Compiling timeline grids for: ${prompt}`);
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
    }

    return res.status(201).json({ success: true, data: persistentCourseNode });

  } catch (error) {
    console.error('❌ [GENERATION_FAULT]:', error.message);
    res.status(500).json({ success: false, error: 'AI blueprint processing engine crashed.' });
  }
});

// --- 🚀 2. NEW LOGIC: TAVILY ENGINE DYNAMIC REFERENCE GATEWAY ROUTE ---
app.post('/api/courses/topics/tavily-search', authorizeSessionToken, async (req, res) => {
  const { topicName, courseTitle } = req.body;

  if (!topicName) {
    return res.status(400).json({ success: false, error: 'Topic execution target name missing.' });
  }

  try {
    console.log(`🔍 [TAVILY_API_CALL]: Querying dynamic index tracking parameters for: ${topicName}`);

    // Exact GFG indexing formulation filtering queries matrices strings
    const tavilyTargetQuery = `${courseTitle || ''} ${topicName} site:geeksforgeeks.org`;
    
    const searchResponse = await tvly.search(tavilyTargetQuery, {
      searchDepth: "basic", 
      maxResults: 3,
      includeAnswers: false
    });

    // Default dynamic text safe fallback if search parameters bounds empty arrays
    let targetedGeeksLink = `https://www.geeksforgeeks.org/search/${encodeURIComponent(topicName)}`;
    
    if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
      const bestMacthedRef = searchResponse.results.find(r => r.url.includes('geeksforgeeks.org'));
      if (bestMacthedRef) {
        targetedGeeksLink = bestMacthedRef.url;
      } else {
        targetedGeeksLink = searchResponse.results[0].url; // General topmost backup web node
      }
    }

    const clearQueryUrlStr = encodeURIComponent(`${courseTitle || ''} ${topicName}`);
    const resourcePackage = {
      geeksForGeeks: targetedGeeksLink,
      youtubeEmbed: `https://www.youtube.com/embed?listType=search&list=${clearQueryUrlStr}`,
      wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${clearQueryUrlStr}`
    };

    return res.status(200).json({ success: true, data: resourcePackage });

  } catch (error) {
    console.error('⚠️ [TAVILY_EXPIRED_FALLBACK]: Free credits loop limit overflow exception:', error.message);
    const clearQueryUrlStr = encodeURIComponent(`${courseTitle || ''} ${topicName}`);
    return res.status(200).json({
      success: true,
      fallbackMode: true,
      data: {
        geeksForGeeks: `https://www.geeksforgeeks.org/search/${clearQueryUrlStr}`,
        youtubeEmbed: `https://www.youtube.com/embed?listType=search&list=${clearQueryUrlStr}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${clearQueryUrlStr}`
      }
    });
  }
});

// --- FETCH HISTORICAL USER RECORDS ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    const records = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// --- DELETE MAP ELEMENT DOCUMENT NODE ---
app.delete('/api/courses/:id', authorizeSessionToken, async (req, res) => {
  try {
    await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({ success: true, message: 'Node cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log("-----------------------------------------------------------------");
  console.log(`🚀 [SERVER ONLINE]: Tavily Integration Layer working on port: ${PORT}`);
  console.log("-----------------------------------------------------------------");
});