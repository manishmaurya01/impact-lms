import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  // Navigation State Layout mapping according to the sidebar
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusMode, setFocusMode] = useState(false);

  // Core Metric Cards State Arrays (Top Section)
  const [metrics, setMetrics] = useState([
    {
      id: 'total_courses',
      title: 'Total Created Courses',
      value: '24',
      delta: '12% vs last 7 days',
      trend: 'up',
      icon: 'fa-graduation-cap'
    },
    {
      id: 'learning_velocity',
      title: 'Weekly Learning Velocity',
      value: '87.6',
      unit: 'pts',
      delta: '18% vs last 7 days',
      trend: 'up',
      icon: 'fa-bolt'
    },
    {
      id: 'memory_retention',
      title: 'Memory Retention',
      value: '72%',
      delta: '8% vs last 7 days',
      trend: 'up',
      icon: 'fa-brain',
      percentage: 72
    }
  ]);

  // Active Project Pipelines State Array
  const [pipelines, setPipelines] = useState([
    { id: 1, name: 'Data Structures & Algorithms', track: 'Advanced Track', progress: 78, status: 'Compiling', icon: 'fa-code' },
    { id: 2, name: 'Machine Learning Fundamentals', track: 'Core Track', progress: 62, status: 'Training', icon: 'fa-diagram-project' },
    { id: 3, name: 'Database Management Systems', track: 'Intermediate Track', progress: 45, status: 'Indexing', icon: 'fa-database' },
    { id: 4, name: 'Web Development Bootcamp', track: 'Beginner Track', progress: 33, status: 'Processing', icon: 'fa-globe' },
    { id: 5, name: 'Cybersecurity Essentials', track: 'Specialization Track', progress: 90, status: 'Verifying', icon: 'fa-shield-halved' }
  ]);

  // Quick Deploy Action Cards State Array (Exactly 6 Cards)
  const [deployActions, setDeployActions] = useState([
    { id: 'new_syllabus', title: 'New Syllabus', desc: 'Create a new course syllabus with AI', icon: 'fa-file-invoice' },
    { id: 'module_builder', title: 'Module Builder', desc: 'Design and structure course modules', icon: 'fa-book-open' },
    { id: 'ai_content', title: 'AI Content Generator', desc: 'Generate lessons, notes and explanations', icon: 'fa-wand-magic-sparkles' },
    { id: 'question_generator', title: 'Question Generator', desc: 'Create quizzes and assessments', icon: 'fa-circle-question' },
    { id: 'resource_uploader', title: 'Resource Uploader', desc: 'Upload and manage learning resources', icon: 'fa-cloud-arrow-up' },
    { id: 'analytics_studio', title: 'Analytics Studio', desc: 'Deep insights and learning analytics', icon: 'fa-chart-line' }
  ]);

  return (
    <div className="lms-premium-viewport">
      
      {/* --- SIDEBAR PANEL SYSTEM --- */}
      <aside className="lms-sidebar-container">
        <div className="sidebar-brand-block">
          <div className="brand-logo-spark">
            <i className="fa-solid fa-star-of-life"></i>
          </div>
          <div className="brand-title-text">
            <h2>LuminaLearn</h2>
            <span>Studio</span>
          </div>
        </div>

        <nav className="sidebar-navigation-mesh">
          <button className={`nav-link-item ${activeTab === 'dashboard' ? 'is-active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <i className="fa-solid fa-house"></i> Dashboard
          </button>
          <button className={`nav-link-item ${activeTab === 'courses' ? 'is-active' : ''}`} onClick={() => setActiveTab('courses')}>
            <i className="fa-solid fa-book"></i> Courses
          </button>
          <button className={`nav-link-item ${activeTab === 'quizzes' ? 'is-active' : ''}`} onClick={() => setActiveTab('quizzes')}>
            <i className="fa-solid fa-circle-question"></i> Quizzes
          </button>
          <button className={`nav-link-item ${activeTab === 'assignments' ? 'is-active' : ''}`} onClick={() => setActiveTab('assignments')}>
            <i className="fa-solid fa-id-card-clip"></i> Assignments
          </button>
          <button className={`nav-link-item ${activeTab === 'notes' ? 'is-active' : ''}`} onClick={() => setActiveTab('notes')}>
            <i className="fa-solid fa-brain"></i> AI Notes
          </button>
        </nav>

        {/* Manish Profile Area at Bottom Left */}
        <div className="sidebar-footer-profile-node">
          <div className="user-avatar-glow-wrapper">
            <div className="user-avatar-initials">MM</div>
          </div>
          <div className="user-meta-credentials">
            <h4>Manish Maurya</h4>
          </div>
          <i className="fa-solid fa-chevron-down profile-arrow-icon"></i>
        </div>
      </aside>

      {/* --- MAIN CORE STAGE VIEWPORT --- */}
      <main className="lms-workspace-stage">
        
        {/* Terminal Header Row Area */}
        <header className="workspace-terminal-header">
          <div className="header-headline-title-block">
            <h1>Workspace Terminal</h1>
            <p>AI-Powered. Personalized. Limitless Learning.</p>
          </div>
          <div className="cluster-status-pill-badge">
            <span className="pulse-dot-green"></span> Cluster Node: <span className="txt-online">Online</span>
          </div>
        </header>

        {/* 1. TOP METRIC MATRIX ROW GRID */}
        <section className="metrics-telemetry-grid-row">
          {metrics.map((metric) => (
            <div key={metric.id} className="telemetry-glass-card">
              <div className="metric-card-inner-alignment">
                <div className={`metric-avatar-icon-box ${metric.id}-style`}>
                  <i className={`fa-solid ${metric.icon}`}></i>
                </div>
                <div className="metric-numbers-text-block">
                  <span className="metric-title-label">{metric.title}</span>
                  <div className="metric-value-row">
                    <h3>{metric.value}</h3>
                    {metric.unit && <span className="metric-unit-text">{metric.unit}</span>}
                  </div>
                  <div className="metric-delta-percentage-row">
                    <span className="arrow-up-icon">↗</span>
                    <span className="bold-delta">{metric.delta.split(' ')[0]}</span>
                    <span className="muted-delta">{metric.delta.substring(metric.delta.indexOf(' '))}</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Radial Render Block inside Metrics Cards */}
              {metric.id === 'total_courses' && (
                <div className="sparkline-vector-mock text-cyan-glow">
                  <svg viewBox="0 0 100 30" className="sparkline-svg">
                    <path d="M0,25 Q15,18 30,22 T60,10 T90,5 T100,2" fill="none" stroke="#06B6D4" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {metric.id === 'learning_velocity' && (
                <div className="sparkline-vector-mock text-purple-glow">
                  <svg viewBox="0 0 100 30" className="sparkline-svg">
                    <path d="M0,22 Q20,25 40,15 T70,12 T95,4 T100,0" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {metric.id === 'memory_retention' && (
                <div className="radial-progress-ring-mock">
                  <svg viewBox="0 0 36 36" className="circular-chart-svg">
                    <path className="circle-bg-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle-fill-path" strokeDasharray="72, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="radial-percentage-inner-txt">72%</div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* CENTRAL TWIN CONSOLE LAYOUT FRAME */}
        <div className="central-twin-blocks-grid">
          
          {/* 2. LEFT SIDE PANEL: ACTIVE PROJECT PIPELINES */}
          <section className="central-workspace-card active-pipelines-console">
            <div className="workspace-card-top-header-row">
              <div className="card-heading-titles">
                <div className="heading-with-icon-row">
                  <i className="fa-solid fa-network-wired text-cyan"></i>
                  <h3>Active Project Pipelines</h3>
                </div>
              </div>
              <button className="view-all-redirect-btn">
                View All <span className="arrow-right-icon">→</span>
              </button>
            </div>

            <div className="pipelines-list-scroll-mesh">
              {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="pipeline-interactive-row">
                  <div className="pipeline-leading-icon-text-block">
                    <div className="pipeline-avatar-icon-node">
                      <i className={`fa-solid ${pipeline.icon}`}></i>
                    </div>
                    <div className="pipeline-meta-info-block">
                      <h4>{pipeline.name}</h4>
                      <span>{pipeline.track}</span>
                    </div>
                  </div>

                  <div className="pipeline-progress-slider-bar-track">
                    <div className="progress-bar-background-line">
                      <div className="progress-bar-accent-fill-line" style={{ width: `${pipeline.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="pipeline-status-badge-telemetry">
                    <span className="pipeline-percentage-metric-value">{pipeline.progress}%</span>
                    <div className="status-label-indicator-alignment-row">
                      <span className={`status-node-dot status-${pipeline.status.toLowerCase()}`}></span>
                      <span className="status-string-text">{pipeline.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. RIGHT SIDE PANEL: QUICK DEPLOY ACTIONS (6 Matrix Layout) */}
          <section className="central-workspace-card quick-actions-console">
            <div className="workspace-card-top-header-row">
              <div className="card-heading-titles">
                <div className="heading-with-icon-row">
                  <i className="fa-solid fa-rocket text-purple"></i>
                  <h3>Quick Deploy Actions</h3>
                </div>
                <p className="card-subtitle-desc-text">Compile and deploy new learning experiences</p>
              </div>
            </div>

            <div className="quick-actions-six-grid-mesh">
              {deployActions.map((action) => (
                <div key={action.id} className="action-grid-card-pill-item">
                  <div className="action-card-top-icon-row">
                    <i className={`fa-solid ${action.icon}`}></i>
                  </div>
                  <h4>{action.title}</h4>
                  <p>{action.desc}</p>
                  <div className="action-card-hover-arrow-indicator">
                    <span className="arrow-right-action-trigger">→</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* BOTTOM DOUBLE STRIP CONTROL PANELS */}
        <footer className="bottom-telemetry-double-strip-row">
          <div className="bottom-horizontal-strip-card alignment-recommendation">
            <div className="left-icon-title-strip-alignment">
              <div className="strip-glowing-icon-circle purple-glow">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="strip-meta-text-block">
                <h5>AI Recommendation Engine</h5>
                <p>Analyzing your learning patterns to personalize upcoming content.</p>
              </div>
            </div>
            <div className="strip-status-pill-badge-active">
              <span className="small-active-dot-indicator"></span> Active
            </div>
          </div>

          <div className="bottom-horizontal-strip-card alignment-focus-mode">
            <div className="left-icon-title-strip-alignment">
              <div className="strip-glowing-icon-circle cyan-glow">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <div className="strip-meta-text-block">
                <h5>Focus Mode</h5>
                <p>Minimize distractions. Maximize your learning.</p>
              </div>
            </div>
            <div className="strip-toggle-switch-action-node">
              <label className="ui-toggle-switch-slider-label">
                <input type="checkbox" checked={focusMode} onChange={() => setFocusMode(!focusMode)} />
                <span className="toggle-switch-slider-round-bar"></span>
              </label>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;