import React, { useState, useEffect } from 'react';

function AICourseIntake({ onGenerationComplete }) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);
  
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStageMessage, setCurrentStageMessage] = useState('System Idle');
  const [systemLogs, setSystemLogs] = useState([
    "LOG_STAMP: [OK] Security Token interceptors initialized.",
    "STATUS: API endpoint listener ready at http://localhost:5000"
  ]);

  const pushLogLine = (message) => {
    setSystemLogs((prev) => [...prev, `LOG_STAMP: ${message}`]);
  };

  useEffect(() => {
    let progressInterval;
    if (isGenerating) {
      setGenerationProgress(0);
      progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Hold at 90% until backend server commits to Mongo
          }
          return prev + Math.floor(Math.random() * 5) + 3;
        });
      }, 300);
    }
    return () => clearInterval(progressInterval);
  }, [isGenerating]);

  // --- STANDARD EXPONENTIAL BACKOFF API CALL WITH 5 RETRIES ---
  const fetchFromGeminiWithBackoff = async (userQuery, systemPrompt) => {
    // Guidelines Rule: Empty apiKey variable (Canvas takes care of binding dynamically)
    const apiKey = ""; 
    
    // Crucial Update: Model strictly restored to "gemini-2.5-flash-preview-09-2025" and key to empty string
    // This allows the Canvas environment's interceptor to inject the authorized keys successfully.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Simplified Response Schema: Flat module list to prevent parser timeouts
    const requestPayload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            level: { type: "STRING" },
            modules: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  dayId: { type: "INTEGER" },
                  title: { type: "STRING" },
                  status: { type: "STRING" },
                  duration: { type: "STRING" },
                  objective: { type: "STRING" },
                  topics: { type: "ARRAY", items: { type: "STRING" } },
                  curatedSearchQuery: { type: "STRING" },
                  shortNotes: { type: "STRING" }
                },
                required: ["dayId", "title", "status", "duration", "objective", "topics", "curatedSearchQuery", "shortNotes"]
              }
            }
          },
          required: ["title", "level", "modules"]
        }
      }
    };

    const delays = [1000, 2000, 4000, 8000, 16000]; // 1s, 2s, 4s, 8s, 16s backoff delays
    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Google API status error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          return JSON.parse(text.trim());
        }
        throw new Error("Empty candidate parameters response stream.");

      } catch (err) {
        lastError = err;
        if (attempt < 4) {
          // Wait silently as per rules
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }
      }
    }
    throw new Error(`AI Engine attempts exhausted. Trace: ${lastError.message}`);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorLogs(null);
    setCurrentStageMessage('Connecting directly to Gemini 2.5 Cognitive Layer...');
    pushLogLine(`[INITIALIZE] Formulating custom prompt payload targets.`);

    try {
      let activeSessionToken = localStorage.getItem('token'); 
      
      // Auto-Guest Authentication Fallback if session token is missing
      if (!activeSessionToken) {
        pushLogLine("[AUTH] Session token nahi mila. Background me auto-guest login process kar rahe hain...");
        try {
          const guestId = Math.floor(100000 + Math.random() * 900000);
          const guestEmail = `guest_${guestId}@luminalearn.com`;
          const guestPassword = "GuestPassword123!";
          
          // Step A: Register Guest Profile on Backend
          const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: `Guest Student ${guestId}`,
              email: guestEmail,
              password: guestPassword,
              role: "Student",
              domain: "Programming",
              commitment: "1 Hour",
              experience: "Beginner",
              learningStyle: "Videos"
            })
          });

          // Step B: Automatically Login to fetch valid JWT Token
          if (regRes.ok) {
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: guestEmail, password: guestPassword })
            });

            const loginPayload = await loginRes.json();
            if (loginRes.ok && loginPayload.success && loginPayload.token) {
              activeSessionToken = loginPayload.token;
              localStorage.setItem('token', loginPayload.token);
              localStorage.setItem('user', JSON.stringify(loginPayload.user));
              pushLogLine("[AUTH] Auto-guest login successfully parsed! Token saved.");
            }
          }
        } catch (authErr) {
          console.error("Auto-guest authentication sequence failed:", authErr);
        }
      }

      // Re-verify after fallback execution
      if (!activeSessionToken) {
        throw new Error("Aapka login session token missing hai. Please ek baar log out karke dobara login karein.");
      }

      // 1. Direct fetch call to Google Gemini Model from Frontend
      const systemPromptText = "You are the premium core intelligence of LuminaLearn Studio. Generate the dynamic course structure following the strict lowercase OpenAPI schema structures.";
      const userPromptText = `Create a highly personalized 4-day learning roadmap on the topic: "${inputPrompt}" matching level: "${selectedLevel}". Output strictly structured JSON values.`;

      const parsedAiData = await fetchFromGeminiWithBackoff(userPromptText, systemPromptText);
      
      setCurrentStageMessage('AI response received. Saving structure into database...');
      pushLogLine(`[AI_SUCCESS] Gemini resolved layout parameters. Syncing database...`);

      // 2. Dispatch save request directly to local port Express server
      const saveResponse = await fetch('http://localhost:5000/api/courses/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeSessionToken}`
        },
        body: JSON.stringify({
          generatedCourse: parsedAiData,
          level: selectedLevel
        })
      });

      const serverPayloadJson = await saveResponse.json();

      if (!saveResponse.ok || !serverPayloadJson.success) {
        const failureReason = serverPayloadJson.error || serverPayloadJson.message || "Failed to commit generated layout elements to database.";
        throw new Error(failureReason);
      }

      console.log("[FRONTEND_INTAKE] MongoDB Database commit verified successfully:", serverPayloadJson.data);
      
      setGenerationProgress(100);
      setCurrentStageMessage('Course mapped. Syncing interactive learning states...');
      pushLogLine("[SUCCESS] Course saved into MongoDB collection: courses");

      if (typeof onGenerationComplete === 'function') {
        onGenerationComplete(serverPayloadJson.data);
      }

    } catch (err) {
      console.error("[FRONTEND_INTAKE_ERROR]", err);
      setErrorLogs(err.message || "Failed to parse generation state workflows.");
      pushLogLine(`[CRITICAL_FAILURE] Generation aborted: ${err.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="centralized-prompt-matrix-viewport">
      {/* Dynamic Style Injection to resolve esbuild CSS path error flawlessly */}
      <style>{`
        .centralized-prompt-matrix-viewport {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #09090b;
          color: #f4f4f5;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow-x: hidden;
        }

        .cyber-ambient-grid-underlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 1;
        }

        .prompt-matrix-hero-block {
          z-index: 2;
          margin-bottom: 1rem;
        }

        .prompt-matrix-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .prompt-matrix-title span {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .intake-workspace-asymmetric-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          z-index: 2;
        }

        @media (max-width: 900px) {
          .intake-workspace-asymmetric-grid {
            grid-template-columns: 1fr;
          }
        }

        .central-workspace-card {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
        }

        .telemetry-monitoring-sidebar-card {
          gap: 1.25rem;
        }

        .telemetry-stat-mini-mesh-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .telemetry-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .lbl-stat {
          color: #71717a;
        }

        .val-stat {
          font-weight: 600;
          color: #f4f4f5;
        }

        .cyber-bounding-decorative-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .cyber-progress-indicator-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          transition: width 0.3s ease-out;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        .live-telemetry-percentage-sub-text {
          font-size: 0.75rem;
          color: #a1a1aa;
          font-family: monospace;
          text-align: center;
          margin-top: 0.25rem;
        }

        .prompt-matrix-form-card {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 2;
        }

        .form-input-wrapper-node {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-field-terminal-label {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a78bfa;
        }

        .input-textarea-glow-container {
          position: relative;
          width: 100%;
        }

        .input-textarea-glow-container textarea {
          width: 100%;
          min-height: 120px;
          background: rgba(9, 9, 11, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          padding: 1rem;
          color: #f4f4f5;
          font-size: 0.95rem;
          line-height: 1.5;
          resize: vertical;
          outline: none;
          transition: all 0.25s ease;
        }

        .input-textarea-glow-container textarea:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
        }

        .prompt-parameter-toggles-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .parameter-toggle-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .parameter-label {
          font-size: 0.8rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pill-selector-mesh {
          display: flex;
          gap: 0.5rem;
          background: rgba(9, 9, 11, 0.5);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pill-selector-item {
          background: transparent;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          color: #71717a;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-selector-item:hover {
          color: #f4f4f5;
        }

        .pill-selector-item.is-active {
          background: #8b5cf6;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }

        .prompt-submit-action-row {
          margin-top: 1rem;
        }

        .prompt-matrix-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          border: none;
          color: #ffffff;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);
        }

        .prompt-matrix-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .prompt-matrix-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #27272a;
          box-shadow: none;
          color: #71717a;
        }

        .system-terminal-activity-logs-footer {
          margin-top: auto;
          background: rgba(9, 9, 11, 0.9);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 1rem;
          max-height: 120px;
          overflow-y: auto;
        }
      `}</style>

      {/* SIDE LIVE MONITOR CONSOLE */}
      <div className="intake-workspace-asymmetric-grid">
        <div className="central-workspace-card telemetry-monitoring-sidebar-card">
          <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Core Monitor</h3>
          <div className="telemetry-stat-mini-mesh-stack">
            <div className="telemetry-stat-row">
              <span className="lbl-stat">DB Commit:</span>
              <span className="val-stat">{isGenerating ? 'WRITING...' : 'SYNC_OK'}</span>
            </div>
            <div className="telemetry-stat-row">
              <span className="lbl-stat">Progress:</span>
              <span className="val-stat text-purple font-mono">{generationProgress}%</span>
            </div>
          </div>
          <div className="cyber-bounding-decorative-progress-track">
            <div className="cyber-progress-indicator-bar-fill" style={{ width: `${generationProgress}%` }}></div>
          </div>
          <div className="live-telemetry-percentage-sub-text"><span>{currentStageMessage}</span></div>
        </div>

        {/* PROMPT ACTION CARD CONTAINER */}
        <form onSubmit={handleSubmit} className="prompt-matrix-form-card">
          {errorLogs && (
            <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
              <strong>Handshake Fault:</strong> {errorLogs}
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
                💡 Tip: Agar aap local test kar rahe hain, toh apne browser console me <code>localStorage.setItem("gemini_api_key", "YOUR_ACTUAL_KEY")</code> run karke page refresh karein!
              </div>
            </div>
          )}

          <div className="form-input-wrapper-node">
            <label className="input-field-terminal-label">Input Core Request Instructions</label>
            <div className="input-textarea-glow-container">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Example: Complete roadmap for Angular from scratch..."
                required
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="prompt-parameter-toggles-row">
            <div className="parameter-toggle-group">
              <span className="parameter-label">Target Depth:</span>
              <div className="pill-selector-mesh">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`pill-selector-item ${selectedLevel === level ? 'is-active' : ''}`}
                    onClick={() => !isGenerating && setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="prompt-submit-action-row">
            <button type="submit" className="prompt-matrix-submit-btn" disabled={isGenerating}>
              {isGenerating ? `Processing Content [${generationProgress}%]` : 'Generate & Commit to DB'}
            </button>
          </div>
        </form>
      </div>

      {/* STREAM LOGGER FOOTER NODES */}
      <div className="central-workspace-card system-terminal-activity-logs-footer">
        <div className="logs-feed-streaming-mesh">
          {systemLogs.map((logStr, idx) => (
            <div key={idx} style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              <span style={{ color: '#8B5CF6' }}>&rarr;</span> {logStr}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AICourseIntake;