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
            return 90; // Hold at 90% securely until backend engine resolves and registers to MongoDB
          }
          return prev + Math.floor(Math.random() * 5) + 3;
        });
      }, 300);
    }
    return () => clearInterval(progressInterval);
  }, [isGenerating]);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorLogs(null);
    setCurrentStageMessage('Connecting to LuminaLearn AI Pipeline...');
    pushLogLine(`[INITIALIZE] Formulating custom prompt requirements for: "${inputPrompt}"`);

    try {
      let activeSessionToken = localStorage.getItem('token'); 
      
      // Auto-Guest Authentication Fallback if session token is missing
      if (!activeSessionToken) {
        pushLogLine("[AUTH] Session token absent. Generating auto-guest credentials background thread...");
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
              pushLogLine("[AUTH] Guest Session authenticated successfully.");
            }
          }
        } catch (authErr) {
          console.error("Auto-guest authentication sequence failed:", authErr);
        }
      }

      // Re-verify authorization parameters
      if (!activeSessionToken) {
        throw new Error("Authorization missing. Please log out and check your account nodes configuration.");
      }

      setCurrentStageMessage('Gemini Architecture rendering course roadmap structure...');
      pushLogLine("[AI_CALL] Transmitting parameters token to backend microservice engine.");

      // CORRECT SYNCHRONIZATION ROUTE: Dispatch request to unified generation endpoint
      const response = await fetch('http://localhost:5000/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeSessionToken}`
        },
        body: JSON.stringify({
          prompt: inputPrompt,
          level: selectedLevel
        })
      });

      const serverPayloadJson = await response.json();

      if (!response.ok || !serverPayloadJson.success) {
        const failureReason = serverPayloadJson.error || serverPayloadJson.message || "Failed to compile roadmap fields.";
        throw new Error(failureReason);
      }

      console.log("[FRONTEND_INTAKE] MongoDB Database commit verified successfully:", serverPayloadJson.data);
      
      // SUCCESS ANIMATION TRANSITION: Jump directly from 90% straight up to 100%
      setGenerationProgress(100);
      setCurrentStageMessage('Syllabus structural nodes mapped. Synchronizing learning states...');
      pushLogLine("[SUCCESS] Course saved and committed to LuminaLearn data blocks.");

      setTimeout(() => {
        setIsGenerating(false);
        if (typeof onGenerationComplete === 'function') {
          onGenerationComplete(serverPayloadJson.data);
        }
      }, 700);

    } catch (err) {
      console.error("[FRONTEND_INTAKE_ERROR]", err);
      setErrorLogs(err.message || "Failed to process pipeline.");
      pushLogLine(`[CRITICAL_FAILURE] Generation aborted: ${err.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="centralized-prompt-matrix-viewport">
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

      <div className="intake-workspace-asymmetric-grid">
        {/* MONITOR LOG PANELS */}
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

        {/* INPUT PROMPT LAYOUT FORM */}
        <form onSubmit={handleSubmit} className="prompt-matrix-form-card">
          {errorLogs && (
            <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
              <strong>Handshake Fault:</strong> {errorLogs}
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

      {/* FOOTER TERMINAL STREAM FEEDS */}
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