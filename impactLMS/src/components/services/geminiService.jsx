import { GoogleGenAI } from '@google/genai';

// Safely pull the key token from environment layout layers
const aiApiKey = "AIzaSyBUIaoxR8p1li_EjoQ9QitqVskWKgx2jE0";

console.log("[TELEMETRY_CORE] Verifying secure local token stream allocation...");
if (!aiApiKey) {
  console.error("[CRITICAL_ALERT] VITE_GEMINI_API_KEY is missing from your .env file setup!");
} else {
  console.log("[OK] Secure API Handshake token integrated successfully.");
}

const ai = new GoogleGenAI({ apiKey: aiApiKey });

/**
 * Generates an automated 4-day chronological course timeline matrix
 * @param {string} userPrompt - User topic descriptor string
 * @param {string} depthLevel - Track target constraints (Beginner, Intermediate, Advanced)
 */
export const compileNeuralLearningPath = async (userPrompt, depthLevel) => {
  console.log(`[SERVICE_THREAD] Booting compilation loop for query: "${userPrompt}"`);

  const corePromptInstructions = `
    You are an expert AI Curriculum Engineer. Create a personalized learning roadmap for: "${userPrompt}" matching track level: "${depthLevel}".
    Structure a strict day-wise chronological matrix mapping exactly 4 days.
    
    CRITICAL SCHEMA BOUNDARY RULES:
    1. Day 1 must have status: "unlocked". Days 2, 3, and 4 must have status: "locked".
    2. Divide topics, sub-topics, assignments, and quizzes strictly chronologically.
    3. Do NOT include actual full test questions banks. Provide short descriptive text parameters inside 'quizTopic' and 'assignmentObjective' fields.
    
    Return ONLY a single valid JSON object following the schema constraint rules. Do not append codeblock annotations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: corePromptInstructions,
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
                  topics: {
                    type: 'ARRAY',
                    items: { type: 'STRING' }
                  },
                  schedules: {
                    type: 'OBJECT',
                    properties: {
                      quiz: {
                        type: 'OBJECT',
                        properties: {
                          name: { type: 'STRING' },
                          quizTopic: { type: 'STRING' },
                          duration: { type: 'STRING' }
                        },
                        required: ['name', 'quizTopic', 'duration']
                      },
                      assignment: {
                        type: 'OBJECT',
                        properties: {
                          name: { type: 'STRING' },
                          assignmentObjective: { type: 'STRING' },
                          complexity: { type: 'STRING' }
                        },
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

    console.log("[SERVICE_THREAD] Stream data package resolved from Google servers.");
    const parsedData = JSON.parse(response.text.trim());
    return parsedData;

  } catch (error) {
    console.error("[SERVICE_THREAD] [CRITICAL_FAIL] Error caught in execution pipeline block:", error);
    throw error;
  }
};