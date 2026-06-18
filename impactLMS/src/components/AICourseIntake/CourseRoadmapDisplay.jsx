import React, { useState } from 'react';
import './CourseRoadmapDisplay.css';

function CourseRoadmapDisplay({ courseData }) {
  const [activeDay, setActiveDay] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState('curriculum');

  if (!courseData || !courseData.modules || courseData.modules.length === 0) return null;

  // Track the actual dynamic nodes array parsed from Gemini
  const activeDayNode = courseData.modules.find(d => d.dayId === activeDay) || courseData.modules[0];

  return (
    <div className="roadmap-architecture-twin-layout">
      
      {/* LEFT PANEL: 4-Days Navigation Blueprints Selector */}
      <div className="central-workspace-card roadmap-sequence-timeline-panel">
        <div className="workspace-card-top-header-row">
          <div className="card-heading-titles">
            <span className="roadmap-mini-badge-node">Chronological Path Blueprints</span>
            <h2 className="roadmap-main-dynamic-title">{courseData.title}</h2>
          </div>
        </div>

        <div className="roadmap-modules-vertical-stack">
          {courseData.modules.map((dayNode) => {
            const isSelected = activeDay === dayNode.dayId;
            const isLocked = dayNode.status === 'locked';
            return (
              <div
                key={dayNode.dayId}
                onClick={() => {
                  setActiveDay(dayNode.dayId);
                  setActiveSubTab('curriculum');
                }}
                className={`roadmap-module-interactive-card ${isSelected ? 'is-active-node' : ''} ${isLocked ? 'node-is-restricted' : ''}`}
              >
                <div className="roadmap-module-card-meta-row">
                  <span className="roadmap-stage-index-tag">{dayNode.duration || `DAY 0${dayNode.dayId}`}</span>
                  <span className="roadmap-status-dot-indicator">
                    <i className={`fa-solid ${!isLocked ? 'fa-lock-open text-cyan' : 'fa-lock data-lock-color'}`}></i>
                  </span>
                </div>
                <h4 style={{ opacity: isLocked ? 0.4 : 1 }}>{dayNode.title}</h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Focused Information Matrix Console */}
      <div className="roadmap-content-streaming-panel">
        
        {/* UPPER SUMMARY TARGET GLASS OVERLAY */}
        <div className="central-workspace-card roadmap-details-overview-glass-card">
          <div className="overview-context-header">
            <div className="heading-with-icon-row">
              <i className={`fa-solid ${activeDayNode.status === 'unlocked' ? 'fa-compass text-cyan' : 'fa-ban text-muted'}`}></i>
              <h3>Day Node Objective Scope</h3>
            </div>
            <span className="overview-timeline-badge-node" style={{ color: activeDayNode.status === 'unlocked' ? '#06B6D4' : '#64748b' }}>
              {activeDayNode.status === 'unlocked' ? 'ACCESS_GRANTED' : 'MATRIX_RESTRICTED'}
            </span>
          </div>
          <p className="overview-curriculum-description" style={{ opacity: activeDayNode.status === 'locked' ? 0.3 : 1 }}>
            {activeDayNode.status === 'unlocked' ? activeDayNode.objective : 'De-compilation vector restricted. Complete previous stage checkpoints and clear core assessment matrices to unlock detailed computational architecture.'}
          </p>
        </div>

        {/* MODULAR SEGMENTED NAVIGATION STRIP */}
        <div className="matrix-segmented-tab-strip">
          {[
            { id: 'curriculum', label: 'Curriculum & Notes', icon: 'fa-folder-tree' },
            { id: 'assignments', label: 'Practical Tasks', icon: 'fa-code-fork' },
            { id: 'quizzes', label: 'AI Assessments', icon: 'fa-circle-question' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`segmented-tab-item ${activeSubTab === tab.id ? 'is-active' : ''}`}
            >
              <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* DATA CONTAINER BLOCK */}
        <div className="tab-telemetry-content-stage" style={{ opacity: activeDayNode.status === 'locked' ? 0.25 : 1, pointerEvents: activeDayNode.status === 'locked' ? 'none' : 'auto' }}>
          
          {/* SUB-VIEW 1: CHROMATIC TIMELINE */}
          {activeSubTab === 'curriculum' && (
            <div className="central-workspace-card sub-panel-data-card">
              <div className="panel-inner-heading">
                <h4>Day-Wise Structured Learning Sequence</h4>
                <p>AI generated chronological breakdown with semantic code notes.</p>
              </div>

              <div className="milestone-lessons-timeline-mesh">
                {activeDayNode.topics?.map((topicName, idx) => (
                  <div key={idx} className="timeline-lesson-interactive-row-node">
                    <div className="timeline-left-indicator-anchor">
                      <span className="timeline-bullet-pulsing-node"></span>
                      <div className="timeline-vertical-connector-line"></div>
                    </div>
                    <div className="timeline-lesson-meta-data-block">
                      <span className="lesson-day-index-indicator">TOPIC MODULE 0{idx + 1}</span>
                      <h4>{topicName}</h4>
                      <p className="lesson-extended-notes">Includes verified concept architecture, syntax mapping models, and core documentation metrics generated on-the-fly by the LLM core model compiler.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: ASSIGNMENT MATRIX */}
          {activeSubTab === 'assignments' && activeDayNode.schedules?.assignment && (
            <div className="central-workspace-card sub-panel-data-card assignment-border-accent">
              <div className="verification-card-header-alignment">
                <div className="verification-icon-box-node assignment-style-box"><i className="fa-solid fa-terminal"></i></div>
                <div className="verification-title-meta-node">
                  <span className="verification-mini-label">Core Engineering Assignment</span>
                  <h3 className="data-highlight-title">{activeDayNode.schedules.assignment.name}</h3>
                </div>
              </div>

              <div className="extended-data-matrix-box">
                <div className="matrix-data-row">
                  <span className="data-row-label">Submission Schedule:</span>
                  <span className="data-row-value text-cyan">Triggered on {activeDayNode.duration || `Day 0${activeDay}`}</span>
                </div>
                <div className="matrix-data-row">
                  <span className="data-row-label">Evaluation Engine:</span>
                  <span className="data-row-value">Automated Linting & Test Case Assertions</span>
                </div>
              </div>

              <div className="assignment-instructions-callout">
                <h5>AI Assignment Metadata Saved:</h5>
                <p className="font-mono text-xs text-[#06B6D4] bg-[#020617] p-3 rounded-lg border border-[#1e293b] mb-4">
                  {activeDayNode.schedules.assignment.assignmentObjective}
                </p>
                <h5>Execution Guidelines:</h5>
                <p>Fork the compiled baseline template repo from your dashboard node. Implement strict logical isolation workflows, eliminate asynchronous blocking anomalies, and ensure clean structural documentation checks pass perfectly before final telemetry submission.</p>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: ASSESSMENT BLOCKS */}
          {activeSubTab === 'quizzes' && activeDayNode.schedules?.quiz && (
            <div className="central-workspace-card sub-panel-data-card quiz-border-accent">
              <div className="verification-card-header-alignment">
                <div className="verification-icon-box-node quiz-style-box"><i className="fa-solid fa-brain"></i></div>
                <div className="verification-title-meta-node">
                  <span className="verification-mini-label">AI Diagnostic Examination</span>
                  <h3 className="data-highlight-title">{activeDayNode.schedules.quiz.name}</h3>
                </div>
              </div>

              <div className="extended-data-matrix-box">
                <div className="matrix-data-row">
                  <span className="data-row-label">Deployment Timeline:</span>
                  <span className="data-row-value text-cyan">Locks automatically at end of {activeDayNode.duration || `Day 0${activeDay}`}</span>
                </div>
                <div className="matrix-data-row">
                  <span className="data-row-label">Question Generation Topic Meta:</span>
                  <span className="data-row-value text-purple font-mono">{activeDayNode.schedules.quiz.quizTopic}</span>
                </div>
                <div className="matrix-data-row">
                  <span className="data-row-label">Question Topology:</span>
                  <span className="data-row-value">Adaptive Multiple Choice (MCQ) & Logical Syntax Debugging</span>
                </div>
              </div>

              <div className="quiz-readiness-indicator-banner">
                <i className="fa-solid fa-shield-halved text-cyan"></i>
                <span>Adaptive configuration parameters stored. Questions will generate dynamically using 'quizTopic' key metadata tracking once the user clicks "Start Exam Module".</span>
              </div>
            </div>
          )}

        </div>

        {/* CRYPTOGRAPHIC BLOCKED WARNING BOX ON LOCKED NODES */}
        {activeDayNode.status === 'locked' && (
          <div className="central-workspace-card" style={{ border: '1px dashed rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.01)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <i className="fa-solid fa-shield-halved" style={{ color: '#ef4444', fontSize: '20px' }}></i>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>Pipeline Decryption Locked</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Please execute current un-resolved checkpoints inside Day 1 matrix blocks before triggering subsequent day threads.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CourseRoadmapDisplay;