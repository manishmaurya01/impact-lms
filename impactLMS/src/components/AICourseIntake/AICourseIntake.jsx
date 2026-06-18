import React, { useState, useEffect } from 'react';
import { compileNeuralLearningPath } from '../.././components/services/geminiService';
import './AICourseIntake.css';

function AICourseIntake({ onGenerationComplete }) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);
  
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStageMessage, setCurrentStageMessage] = useState('System Idle');
  const [systemLogs, setSystemLogs] = useState([
    "LOG_STAMP: [OK] Neural Cluster handshakes resolved successfully.",
    "GEMINI_CORE: Ready to stream level-based multi-domain arrays."
  ]);

  const pushLogLine = (message) => {
    setSystemLogs((prev) => [...prev, `LOG_STAMP: ${message}`]);
  };

  useEffect(() => {
    let progressInterval;
    if (isGenerating) {
      console.log("[INTAKE_COMPONENT] Initializing simulated progress feedback timers...");
      setGenerationProgress(0);
      progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 92) {
            clearInterval(progressInterval);
            return 92;
          }
          const nextVal = prev + Math.floor(Math.random() * 8) + 3;
          return nextVal > 92 ? 92 : nextVal;
        });
      }, 200);
    }
    return () => clearInterval(progressInterval);
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[INTAKE_COMPONENT] Form submitted by user.");
    console.log(`[INTAKE_COMPONENT] Capturing inputs -> Prompt: "${inputPrompt}" | Level: "${selectedLevel}"`);

    if (!inputPrompt.trim() || isGenerating) {
      console.warn("[INTAKE_COMPONENT] Request blocked. Input text fields are empty or generation loop is already compiling.");
      return;
    }

    setIsGenerating(true);
    setErrorLogs(null);
    setCurrentStageMessage('Compiling Prompt tokens... Routing queries handshake...');
    pushLogLine(`[INITIALIZE] Triggering compilation pipeline workflow.`);

    try {
      console.log("[INTAKE_COMPONENT] Dispaching control thread execution to geminiService...");
      const resultData = await compileNeuralLearningPath(inputPrompt, selectedLevel);
      
      console.log("[INTAKE_COMPONENT] Data returned successfully from service model module.");
      console.log("[INTAKE_COMPONENT] Checking content validation rules:", resultData);

      setGenerationProgress(100);
      setCurrentStageMessage('Path tree build complete. Executing callbacks triggers...');
      pushLogLine("[SUCCESS] ResponseSchema mapping verified.");

      // Check if the callback function exists before execution hook
      if (typeof onGenerationComplete === 'function') {
        console.log("[INTAKE_COMPONENT] Firing 'onGenerationComplete' layout callback to parent...");
        onGenerationComplete(resultData);
      } else {
        console.error("[INTAKE_COMPONENT] [CRITICAL] 'onGenerationComplete' prop is not a valid callback function!");
      }

    } catch (err) {
      console.error("[INTAKE_COMPONENT] Catch block caught error exception:", err);
      setErrorLogs(err.message || " Handshake connection failed.");
      pushLogLine(`[CRITICAL_FAILURE] Execution aborted: ${err.message}`);
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
        
        {/* SIDE CONSOLE COMPILER MODULE */}
        <div className="central-workspace-card telemetry-monitoring-sidebar-card">
          <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Core Monitor</h3>
          <div className="telemetry-stat-mini-mesh-stack">
            <div className="telemetry-stat-row">
              <span className="lbl-stat">Engine:</span>
              <span className="val-stat">{isGenerating ? 'PROCESSING' : 'READY'}</span>
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

        {/* INPUT LAYOUT AREA */}
        <form onSubmit={handleSubmit} className="prompt-matrix-form-card">
          {errorLogs && (
            <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
              <strong>Error Trace:</strong> {errorLogs}
            </div>
          )}

          <div className="form-input-wrapper-node">
            <label className="input-field-terminal-label">Input Core Request Instructions</label>
            <div className="input-textarea-glow-container">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Example: Complete roadmap for Angular..."
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
              {isGenerating ? `Compiling [${generationProgress}%]` : 'Generate Path Architecture'}
            </button>
          </div>
        </form>
      </div>

      {/* SYSTEM PIPELINE STREAM TERMINAL */}
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