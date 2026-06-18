import React, { useState } from 'react';
import './Dashboard.css';
import AICourseIntake from '../AICourseIntake/AICourseIntake';
import CourseRoadmapDisplay from '../AICourseIntake/CourseRoadmapDisplay';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusMode, setFocusMode] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [innerTrackView, setInnerTrackView] = useState('portfolio'); 

  // Core callback triggered when Gemini API completely resolves
  const handleGenerationComplete = (generatedData) => {
    console.log("[DASHBOARD_PARENT] Gemini payload intercepted successfully:", generatedData);
    setCourseData(generatedData);
    setInnerTrackView('roadmap-active'); // Direct transition to day-wise workspace grid
    setActiveTab('courses'); // Viewport jump to courses tab
  };

  const handleResetCourseViewport = () => {
    console.log("[DASHBOARD_PARENT] Resetting portfolio telemetry logs.");
    setCourseData(null);
    setInnerTrackView('portfolio');
    setActiveTab('dashboard');
  };

  // Static Dashboard Metrics Arrays
  const [metrics] = useState([
    { id: 'total_courses', title: 'Total Created Courses', value: '24', icon: 'fa-graduation-cap' },
    { id: 'learning_velocity', title: 'Weekly Learning Velocity', value: '87.6', icon: 'fa-bolt' },
    { id: 'memory_retention', title: 'Memory Retention', value: '72%', icon: 'fa-brain' }
  ]);

  const [pipelines] = useState([
    { id: 1, name: 'Data Structures & Algorithms', track: 'Advanced Track', progress: 78 },
    { id: 2, name: 'Machine Learning Fundamentals', track: 'Core Track', progress: 62 }
  ]);

  // Mock array for history portfolio logs
  const [pastCourses] = useState([
    { id: 101, title: 'Advanced Angular Engine & State Hydration', level: 'Advanced Track', stamp: '04/12/2026', status: 'Completed' },
    { id: 102, title: 'Python Pipeline Orchestration for Data Streams', level: 'Intermediate Track', stamp: '22/03/2026', status: 'Terminated' },
    { id: 103, title: 'Asynchronous JavaScript Runtime & V8 Engine Compilation', level: 'Advanced Track', stamp: '10/01/2026', status: 'Completed' }
  ]);

  return (
    <div className={`lms-premium-viewport ${focusMode ? 'focus-mode-active' : ''}`}>
      
      {/* --- SIDEBAR PANEL SYSTEM --- */}
      <aside className="lms-sidebar-container">
        <div className="sidebar-brand-block" onClick={handleResetCourseViewport} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-spark">
            <i className="fa-solid fa-star-of-life"></i>
          </div>
          <div className="brand-title-text">
            <h2>LuminaLearn</h2>
            <span>Studio</span>
          </div>
        </div>

        <div className="sidebar-action-container">
          <button className="sidebar-generate-course-btn" onClick={() => { console.log("[SIDEBAR] Launching Generator view."); setActiveTab('ai-generate'); }}>
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Generate Course</span>
          </button>
        </div>

        <nav className="sidebar-navigation-mesh">
          <button className={`nav-link-item ${activeTab === 'dashboard' ? 'is-active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <i className="fa-solid fa-house"></i> Dashboard
          </button>
          <button className={`nav-link-item ${activeTab === 'courses' ? 'is-active' : ''}`} onClick={() => { console.log("[SIDEBAR] Loading Portfolio views."); setActiveTab('courses'); setInnerTrackView('portfolio'); }}>
            <i className="fa-solid fa-book"></i> Courses & History
          </button>
          <button className={`nav-link-item ${activeTab === 'quizzes' ? 'is-active' : ''}`} onClick={() => setActiveTab('quizzes')}>
            <i className="fa-solid fa-circle-question"></i> Quizzes
          </button>
          <button className={`nav-link-item ${activeTab === 'assignments' ? 'is-active' : ''}`} onClick={() => setActiveTab('assignments')}>
            <i className="fa-solid fa-id-card-clip"></i> Assignments
          </button>
        </nav>

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
        
        <header className="workspace-terminal-header">
          <div className="header-headline-title-block">
            <h1>
              {activeTab === 'dashboard' && 'Workspace Terminal'}
              {activeTab === 'ai-generate' && 'AI Core Generation Engine'}
              {activeTab === 'courses' && 'Course Hub Portfolio'}
            </h1>
            <p>AI-Powered. Personalized. Limitless Learning.</p>
          </div>
          
          <div className="header-controls-cluster">
            <button onClick={() => setActiveTab('ai-generate')} className="header-launch-engine-btn">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Launch AI Engine
            </button>
            <div className="cluster-status-pill-badge">
              <span className="pulse-dot-green"></span> Cluster Node: <span className="txt-online">Online</span>
            </div>
          </div>
        </header>

        {/* --- LAYER 1: BASE METRIC DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-layout-wrapper">
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="central-twin-blocks-grid">
              <section className="central-workspace-card active-pipelines-console">
                <div className="workspace-card-top-header-row">
                  <div className="card-heading-titles"><div className="heading-with-icon-row"><h3>Active Pipelines</h3></div></div>
                </div>
                <div className="pipelines-list-scroll-mesh">
                  {pipelines.map((p) => (
                    <div key={p.id} className="pipeline-interactive-row" style={{ padding: '14px', background: 'rgba(7,11,23,0.4)', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <h4>{p.name}</h4>
                      <span className="text-cyan">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* --- LAYER 2: MOUNTED DYNAMIC GENERATION WORKSPACE PANEL --- */}
        {activeTab === 'ai-generate' && (
          <div className="flex w-full justify-center">
            {/* FIXED CALL: Render original component containing the Gemini engine call hooks */}
            <AICourseIntake onGenerationComplete={handleGenerationComplete} />
          </div>
        )}

        {/* --- LAYER 3: COURSE REPOS & DAY-WISE TIMELINE WORKSPACE --- */}
        {activeTab === 'courses' && (
          <div className="roadmap-wrapper-viewport animate-fadeIn">
            
            {/* VIEW A: HISTORY LOGGER LIST PORTFOLIO */}
            {innerTrackView === 'portfolio' && (
              <div className="portfolio-track-scaffolding-mesh" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Active Course Selector Banner */}
                <div className="central-workspace-card active-track-overview-card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div className="heading-with-icon-row">
                      <i className="fa-solid fa-circle-nodes text-cyan"></i>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Active Engine Focus Node Track</h3>
                    </div>
                    <span className="roadmap-duration-pill-badge" style={{ color: '#06B6D4' }}>Operational</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <h2 style={{ fontSize: '22px', margin: '0 0 6px 0', color: '#ffffff', fontWeight: '700' }}>
                        {courseData ? courseData.title : 'Data Structures & Algorithms Advanced Blueprint'}
                      </h2>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>AI Neural Engine Core Workspace Active Stack</p>
                    </div>
                    <button 
                      className="prompt-matrix-submit-btn" 
                      style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #06B6D4 0%, #0284c7 100%)', color: '#020617', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => { console.log("[PORTFOLIO] Launching day timeline workspace view."); setInnerTrackView('roadmap-active'); }}
                    >
                      <i className="fa-solid fa-play" style={{ marginRight: '8px' }}></i> Resume Track
                    </button>
                  </div>
                </div>

                {/* History Lists Table Console */}
                <div className="central-workspace-card past-history-table-console">
                  <div className="workspace-card-top-header-row" style={{ marginBottom: '20px' }}>
                    <div className="heading-with-icon-row">
                      <i className="fa-solid fa-clock-rotate-left text-purple"></i>
                      <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Past Generated Course Repositories</h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pastCourses.map((history) => (
                      <div key={history.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 100px', padding: '16px 20px', backgroundColor: 'rgba(7,11,23,0.5)', border: '1px solid #0f172a', borderRadius: '12px', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>{history.title}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{history.level}</div>
                        <div style={{ color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>{history.stamp}</div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '50px', backgroundColor: 'rgba(16,185,129,0.05)', color: '#10B981', border: '1px solid rgba(16,185,129,0.1)' }}>
                            {history.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: DAY-WISE DETAILED VIEWPORT PANE */}
            {innerTrackView === 'roadmap-active' && (
              <div className="roadmap-viewport-container">
                <button onClick={() => setInnerTrackView('portfolio')} className="roadmap-reset-terminal-pipeline-btn">
                  &larr; Back to Portfolio Repositories
                </button>
                <CourseRoadmapDisplay courseData={courseData || { title: 'Data Structures & Algorithms Advanced Blueprint' }} />
              </div>
            )}

          </div>
        )}

        {/* FOOTER CODES */}
        <footer className="bottom-telemetry-double-strip-row" style={{ marginTop: 'auto' }}>
          <div className="bottom-horizontal-strip-card">
            <span style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>[CLUSTER_STATUS: SYSTEM_INTEGRATION_SYNC_COMPLETE]</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;