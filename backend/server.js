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

// 🚀 ORIGINAL HIGH-LEVEL SKELETON SCHEMA (Preserves absolute layout integrity)
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
    topics: [String], // Plain string arrays matching your exact old document layout
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

// 🚀 ULTRA-DYNAMIC MATERIALS SCHEMA (No Fixed Parameter Constraints)
const MaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: Number, required: true },
  topicName: { type: String, required: true },
  htmlContent: { type: String, required: true }, // Gemini will write pure visual layouts here
  videoLink: { type: String, default: "https://www.youtube.com" },
  createdAt: { type: Date, default: Date.now }
});
const Material = mongoose.model('Material', MaterialSchema);

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

// --- 🚀 METHOD 1 (OLD CORES SAFE): COMPILES THE HIGH-LEVEL SYLLABUS LAYOUT IMMUTABLE ---
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
            topics: { type: "array", items: { type: "string" } }, // Plain strings loop format preserved
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
          required: ["moduleId", "moduleName", "objective", "shortSummary", "youtubeSearchQuery", "visualGuidelines", "topics", "quiz", "assignment"]
        }
      }
    },
    required: ["title", "level", "estimatedTime", "contentType", "modules"]
  };

  const userQueryPrompt = `Construct a complete course matrix roadmap on the topic: "${prompt}" suited for depth layer: "${level || 'Beginner'}". Output stringified JSON format structure directly without markdown backticks wrapper strings.`;

  try {
    console.log(`🤖 [AI_ENGINE]: Parsing course data stream elements via Primary Key for user: ${activeUserId}`);
    const rawAiText = await callGeminiAPI(GEMINI_PRIMARY_KEY, userQueryPrompt, systemInstructions, structuredResponseSchema);
    
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
    return res.status(201).json({ success: true, data: persistentCourseNode });

  } catch (error) {
    console.error('❌ [GENERATION_FAULT]:', error);
    res.status(500).json({ success: false, error: 'AI model pipeline crashed.', details: error.message });
  }
});

// --- 🚀 METHOD 2 (FLEXIBLE MULTI-THEME LAYER): THE OPEN FIELD TEXT MATRIX ---
app.post('/api/courses/fetch-material', authorizeSessionToken, async (req, res) => {
  const { courseId, moduleId, topicName } = req.body;
  if (!courseId || !moduleId || !topicName) {
    return res.status(400).json({ success: false, message: "Missing required identification metadata strings." });
  }

  try {
    // Course details find karke dynamic complexity track level extract karein (Beginner / Intermediate / Advanced)
    const targetCourse = await Course.findById(courseId);
    const currentLevel = targetCourse ? targetCourse.level : "Beginner"; 

    // Check if deep topic text data exists inside Materials Collection
    let existingMaterial = await Material.findOne({ courseId, moduleId, topicName });
    
    if (existingMaterial) {
      console.log(`💡 [MATERIAL_CACHE_HIT]: Serving adapted dynamic data node from collection.`);
      return res.status(200).json({ success: true, data: existingMaterial });
    }

    console.log(`🤖 [ADAPTIVE_COMPILER]: Running Dynamic Unconstrained Sequence for: "${topicName}" | Level: [${currentLevel}]`);

    const materialSchema = {
      type: "object",
      properties: {
        htmlContent: { type: "string" },
        videoLink: { type: "string" }
      },
      required: ["htmlContent", "videoLink"]
    };

    const systemPrompt = `You are LuminaLearn's elite senior software architect and master technical educator.
    Explain the given topic deeply, extensively, and completely without any rigid parameter or section boundaries.
    Write naturally like standard unconstrained Gemini or ChatGPT responses, breaking it down into what is TRULY critical for this specific concept (e.g., historical contexts, deep operational deep-dives, architectural maps, real-world case scenarios, optimizations, or tradeoffs).

    STRICT DIFFICULTY ARCHITECTURAL RULES FOR 'htmlContent':
    1. Output raw semantic inline-styled HTML wrapper strings. Do NOT wrap inside markdown block characters (\`\`\`).
    2. Adapt perfectly to the Student Track Level: [${currentLevel}].
       - Beginner: Focus on high-level mental models, interactive clear human analogies, visual breakdown steps, and readable basic starter code blocks with descriptive comments.
       - Intermediate: Focus on real-world implementation structures, clean code guidelines, and common software integration edge bugs.
       - Advanced/Expert: Focus on deep system design blueprints, performance metrics simulations using custom grid columns, memory footprints, concurrency thread pools, race conditions, optimization rules, and industrial production-grade implementation modules with complete error bounds.
    3. Use gorgeous custom CSS block modules matching our dark slick ecosystem:
       - Code snippets MUST be wrapped inside: '<pre style="background:#010409; padding:1.25rem; border:1px solid #30363d; border-radius:0.5rem; color:#e6edf3; overflow-x:auto; font-family:monospace; line-height:1.5; margin:1rem 0;"><code>...</code></pre>'
       - Highlight cards/alerts: '<div style="background:#0c111d; border:1px solid #1f2d4d; border-radius:0.75rem; padding:1.5rem; margin-bottom:1.5rem; border-left:4px solid #06b6d4;">...</div>'
       - Subheaders: '<h3 style="color:#06b6d4; font-size:1.3rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">...</h3>'
    4. Make the content extremely comprehensive, detailed, and wide-ranging (provide multiple informative contextual layers).`;

    const corePrompt = `Generate an unconstrained, deeply rich educational master lecture for the technical topic: "${topicName}". Student Target Experience Skillset: "${currentLevel}". Attach a high-relevance educational YouTube watch URL link for "videoLink".`;

    const rawAiText = await callGeminiAPI(GEMINI_SECONDARY_KEY, corePrompt, systemPrompt, materialSchema);
    const parsedData = JSON.parse(rawAiText);

    // Save dynamically into Materials Inventory Collection
    const newMaterialRecord = new Material({
      courseId,
      moduleId,
      topicName,
      ...parsedData
    });

    await newMaterialRecord.save();
    console.log(`💾 [DB_MATERIAL_DYNAMIC_SUCCESS]: Tailored unconstrained material committed under inventory.`);
    
    res.status(200).json({ success: true, data: newMaterialRecord });

  } catch (err) {
    console.error('❌ [MATERIAL_FAULT]:', err);
    res.status(500).json({ success: false, message: "Real-time dynamic content assembler pipeline failed.", details: err.message });
  }
});

// --- GET ALL SAVED COURSES ---
app.get('/api/courses', authorizeSessionToken, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cloud stored registries.' });
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
  console.log(`🚀 [SERVER ONLINE]: Serving Open Content Matrices on Port: ${PORT}`);
  console.log("-----------------------------------------------------------------");
});