import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for redirection after logout
import './Dashboard.css';
import AICourseIntake from '../AICourseIntake/AICourseIntake';
import CourseRoadmapDisplay from '../AICourseIntake/CourseRoadmapDisplay';

function Dashboard() {
  const navigate = useNavigate(); // Initialized for routing control
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courseData, setCourseData] = useState(null);
  const [innerTrackView, setInnerTrackView] = useState('portfolio'); 
  const [mongoSavedHistory, setMongoSavedHistory] = useState([]); 

  // 🚀 CRITICAL NEW FEATURE: LOGOUT HANDSHAKE HANDLER
  const handleLogout = () => {
    console.log("[AUTH_SESSION] Terminating workspace session tokens...");
    
    // 1. Clear all authentication variables from browser storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log("[AUTH_SESSION] Storage wiped. Redirecting to login terminal.");
    
    // 2. Bounce user back to login page instantly
    navigate('/login');
  };

  // Fetch user-specific courses timeline logs directly from MongoDB
  const fetchHistoricalCoursesFromDB = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      console.log("[DASHBOARD] Fetching verified operational courses logs from MongoDB...");
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const resultJson = await response.json();
      if (resultJson.success && resultJson.data) {
        setMongoSavedHistory(resultJson.data);
      }
    } catch (error) {
      console.error("[DASHBOARD_DB_FETCH_ERROR] Failed to query historical repository indices:", error);
    }
  };

  useEffect(() => {
    fetchHistoricalCoursesFromDB();
  }, [activeTab]);

  const handleGenerationComplete = (newSavedCourseDocument) => {
    setCourseData(newSavedCourseDocument);
    setInnerTrackView('roadmap-active'); 
    setActiveTab('courses'); 
  };

  return (
    <div className="lms-premium-viewport">
      
      {/* --- SIDEBAR SUBSYSTEM MATRIX --- */}
      <aside className="lms-sidebar-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="sidebar-brand-block" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-spark"><i className="fa-solid fa-star-of-life"></i></div>
          <div className="brand-title-text"><h2>LuminaLearn</h2><span>Studio</span></div>
        </div>

        <div className="sidebar-action-container">
          <button className="sidebar-generate-course-btn" onClick={() => setActiveTab('ai-generate')}>
            <i className="fa-solid fa-wand-magic-sparkles"></i><span>Generate Course</span>
          </button>
        </div>

        <nav className="sidebar-navigation-mesh" style={{ flexGrow: 1 }}>
          <button className={`nav-link-item ${activeTab === 'dashboard' ? 'is-active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <i className="fa-solid fa-house"></i> Dashboard
          </button>
          <button className={`nav-link-item ${activeTab === 'courses' ? 'is-active' : ''}`} onClick={() => setActiveTab('courses')}>
            <i className="fa-solid fa-book"></i> Courses & History ({mongoSavedHistory.length})
          </button>
        </nav>

        {/* --- PROFILE PROFILE SECTION WITH INTEGRATED LOGOUT --- */}
        <div className="sidebar-footer-profile-node" style={{ borderTop: '1px solid #1e293b', paddingTop: '15px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div className="user-avatar-glow-wrapper">
              <div className="user-avatar-initials">MM</div>
            </div>
            <div className="user-meta-credentials" style={{ flexGrow: 1, marginLeft: '10px' }}>
              <h4 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>Manish Maurya</h4>
            </div>
          </div>
          
          {/* 🔓 DYNAMIC ACTION LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Terminate Session (Logout)</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN MAIN FRAME HUB STAGE --- */}
      <main className="lms-workspace-stage">
        <header className="workspace-terminal-header">
          <div className="header-headline-title-block">
            <h1>{activeTab === 'courses' ? 'Course Hub Portfolio' : activeTab === 'dashboard' ? 'Workspace Terminal' : 'AI Core Generation Engine'}</h1>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-layout-wrapper">
            <h2 style={{ color: '#fff', fontSize: '18px' }}>Welcome to LuminaLearn Dashboard Node</h2>
            <p style={{ color: '#64748b' }}>Select 'Generate Course' from sidebar to begin tracking skills dynamically.</p>
          </div>
        )}

        {activeTab === 'ai-generate' && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <AICourseIntake onGenerationComplete={handleGenerationComplete} />
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="roadmap-wrapper-viewport animate-fadeIn">
            {innerTrackView === 'portfolio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '15px' }}><i className="fa-solid fa-circle-nodes text-cyan mr-2"></i> Current Operational Target Node</h3>
                    <span className="roadmap-duration-pill-badge" style={{ color: '#06B6D4' }}>Database Connected</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <h2 style={{ color: '#ffffff', fontSize: '22px', margin: '0', fontWeight: '700' }}>
                      {courseData ? courseData.title : (mongoSavedHistory[0]?.title || 'No active tracking pathways found in MongoDB.')}
                    </h2>
                    <button 
                      className="prompt-matrix-submit-btn"
                      style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #06B6D4 0%, #0284c7 100%)', border: 'none', borderRadius: '8px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => {
                        if (!courseData && mongoSavedHistory.length > 0) setCourseData(mongoSavedHistory[0]);
                        setInnerTrackView('roadmap-active');
                      }}
                    >
                      <i className="fa-solid fa-play mr-2"></i> Resume Operational Track
                    </button>
                  </div>
                </div>

                <div className="central-workspace-card past-history-table-console">
                  <h3 style={{ color: '#fff', fontSize: '15px', marginBottom: '16px' }}><i className="fa-solid fa-clock-rotate-left text-purple mr-2"></i> Real-time Repository Sync Logs from MongoDB</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mongoSavedHistory.map((courseRow) => (
                      <div 
                        key={courseRow._id} 
                        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', padding: '16px 20px', backgroundColor: 'rgba(7,11,23,0.5)', border: '1px solid #1e293b', borderRadius: '12px', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => {
                          setCourseData(courseRow);
                          setInnerTrackView('roadmap-active');
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>{courseRow.title}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{courseRow.level}</div>
                        <div style={{ textAlign: 'right', color: '#06B6D4', fontSize: '12px', fontFamily: 'monospace' }}>[CLICK_TO_LOAD]</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {innerTrackView === 'roadmap-active' && (
              <div className="roadmap-viewport-container">
                <button onClick={() => setInnerTrackView('portfolio')} className="roadmap-reset-terminal-pipeline-btn">
                  &larr; Return to Courses Index Repositories
                </button>
                <CourseRoadmapDisplay courseData={courseData} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;