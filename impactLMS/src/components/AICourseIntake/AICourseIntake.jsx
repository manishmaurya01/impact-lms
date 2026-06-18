import React, { useState, useEffect } from 'react';
import './AICourseIntake.css';

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
          return prev + Math.floor(Math.random() * 8) + 4;
        });
      }, 200);
    }
    return () => clearInterval(progressInterval);
  }, [isGenerating]);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorLogs(null);
    setCurrentStageMessage('Routing parameters payload to Node.js backend cluster...');
    pushLogLine(`[INITIALIZE] Compiling neural prompt request tracks.`);

    try {
      // 1. Fetch user authorization token stored during login node
      const activeSessionToken = localStorage.getItem('token'); 
      if (!activeSessionToken) {
        throw new Error("Aapka login session token missing hai. Please ek baar log out karke dobara login karein.");
      }

      // 2. Trigger Express Pipeline Server Node directly
      console.log("[FRONTEND_INTAKE] Dispaching request to Express server...");
      const response = await fetch('http://localhost:5000/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeSessionToken}` // Validates secure JWT encapsulation
        },
        body: JSON.stringify({
          prompt: inputPrompt,
          level: selectedLevel
        })
      });

      const serverPayloadJson = await response.json();

      if (!response.ok || !serverPayloadJson.success) {
        // AI check error ya session authorization messages ko seamlessly extract karo
        const failureReason = serverPayloadJson.error || serverPayloadJson.message || "Backend pipeline returned an operational error exception.";
        throw new Error(failureReason);
      }

      console.log("[FRONTEND_INTAKE] MongoDB Database commit verified successfully:", serverPayloadJson.data);
      
      setGenerationProgress(100);
      setCurrentStageMessage('Handshake resolved. Syncing dynamic portfolio states...');
      pushLogLine("[SUCCESS] Course saved into MongoDB collection: courses");

      // 3. Emit saved model payload directly to parent viewport handler
      if (typeof onGenerationComplete === 'function') {
        onGenerationComplete(serverPayloadJson.data);
      }

    } catch (err) {
      console.error("[FRONTEND_INTAKE_ERROR]", err);
      setErrorLogs(err.message || "Failed to bridge communication with local port server.");
      pushLogLine(`[CRITICAL_FAILURE] Transaction aborted: ${err.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="centralized-prompt-matrix-viewport">
      <div className="cyber-ambient-grid-underlay"></div>
      
      <div className="prompt-matrix-hero-block">
        <h2 className="prompt-matrix-title">Generating Learning paths <br /><span>using AI.</span></h2>
      </div>

      <div className="intake-workspace-asymmetric-grid">
        
        {/* SIDE LIVE MONITOR CONSOLE */}
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
                💡 Tip: Agar token error hai, toh ek baar application se log out karke login karein!
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
              {isGenerating ? `Saving to Database [${generationProgress}%]` : 'Generate & Commit to DB'}
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