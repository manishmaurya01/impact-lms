import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Wand2, BookOpen, LogOut, 
  Play, History, Database, ArrowLeft, Loader2, Sparkles,
  Code, LayoutGrid, CheckCircle2, Unlock, Lock
} from 'lucide-react';
import './Dashboard.css';
import AICourseIntake from '../AICourseIntake/AICourseIntake';
import SecureTerminalWorkspace from './SecureTerminalWorkspace'; // Ensure this is in the same folder

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courseData, setCourseData] = useState(null);
  const [innerTrackView, setInnerTrackView] = useState('portfolio'); 
  const [mongoSavedHistory, setMongoSavedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null); // Added for Terminal

  // 🚀 LOGOUT HANDSHAKE HANDLER
  const handleLogout = () => {
    console.log("[AUTH_SESSION] Terminating workspace session tokens...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 📥 FETCH HISTORICAL COURSES FROM MONGODB
  const fetchHistoricalCoursesFromDB = async () => {
    setIsLoading(true);
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

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
      console.error("[DASHBOARD_DB_FETCH_ERROR] Failed to query historical repository:", error);
    } finally {
      setIsLoading(false);
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

  // Logics for unlocking sequential modules
  const getProgressTimelineModules = (activeCourse) => {
    if (!activeCourse || !activeCourse.modules) return [];
    const savedProgress = JSON.parse(localStorage.getItem(`progress_${activeCourse._id}`)) || [];
    
    return activeCourse.modules.map((mod, index) => {
      const isCompleted = savedProgress.includes(mod.moduleId || index);
      const isUnlocked = index === 0 || savedProgress.includes(activeCourse.modules[index - 1].moduleId || index - 1);
      
      return {
        id: mod.moduleId || index,
        courseId: activeCourse._id,
        title: mod.moduleName || `Evaluation Module 0${index + 1}`,
        type: activeCourse.contentType === "Non-Technical" ? 'Theory' : 'Coding',
        status: isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked',
        desc: mod.shortSummary || mod.objective || 'Complete this execution block to proceed.',
        codingQuestion: mod.assignment?.assignmentObjective || "Detailed execution trace required.",
        starterCode: "// LuminaLearn Active Terminal\nfunction executeTask() {\n  return true;\n}",
        theoryQuestion: mod.visualGuidelines || "Provide deep theoretical structure."
      };
    });
  };

  // If a challenge is clicked, render the full-screen terminal workspace
  if (activeChallenge) {
    return (
      <SecureTerminalWorkspace 
        targetParams={activeChallenge} 
        onReturn={() => {
          setActiveChallenge(null);
          // Force refresh to update the lock/unlock states visually
          setCourseData({...courseData}); 
        }} 
      />
    );
  }

  return (
    <div className="lms-premium-viewport">
      
      {/* --- SIDEBAR MATRIX --- */}
      <aside className="lms-sidebar-container">
        <div className="sidebar-brand-block" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-logo-spark"><Sparkles size={24} /></div>
          <div className="brand-title-text">
            <h2>LuminaLearn</h2>
            <span>Studio</span>
          </div>
        </div>

        <div className="sidebar-action-container">
          <button className="sidebar-generate-btn" onClick={() => setActiveTab('ai-generate')}>
            <Wand2 size={16} /> <span>Generate Course</span>
          </button>
        </div>

        <nav className="sidebar-navigation-mesh">
          <button 
            className={`nav-link-item ${activeTab === 'dashboard' ? 'is-active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            className={`nav-link-item ${activeTab === 'courses' ? 'is-active' : ''}`} 
            onClick={() => { setActiveTab('courses'); setInnerTrackView('portfolio'); }}
          >
            <BookOpen size={18} /> Courses & History
            {mongoSavedHistory.length > 0 && <span className="nav-count-badge">{mongoSavedHistory.length}</span>}
          </button>
        </nav>

        {/* --- PROFILE & LOGOUT SECTION --- */}
        <div className="sidebar-footer-profile-node">
          <div className="profile-info-row">
            <div className="user-avatar-glow-wrapper">
              <div className="user-avatar-initials">MM</div>
            </div>
            <div className="user-meta-credentials">
              <h4>Manish Maurya</h4>
              <span className="user-role">Verified Student</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="btn-logout-sidebar">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE STAGE --- */}
      <main className="lms-workspace-stage">
        <header className="workspace-terminal-header animate-slideDown">
          <div className="header-headline-title-block">
            <h1>
              {activeTab === 'courses' ? 'Course Hub Portfolio' : 
               activeTab === 'dashboard' ? 'Workspace Terminal' : 
               'AI Core Generation Engine'}
            </h1>
          </div>
        </header>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-layout-wrapper animate-fadeIn">
            <div className="welcome-hero-card">
              <div className="ambient-glow-sphere"></div>
              <h2>Welcome to LuminaLearn Matrix</h2>
              <p>Your central cognitive hub. Select <strong>'Generate Course'</strong> from the sidebar to dynamically compile a new syllabus using Atlas nodes.</p>
            </div>
          </div>
        )}

        {/* TAB: AI GENERATOR */}
        {activeTab === 'ai-generate' && (
          <div className="generator-wrapper animate-fadeIn">
            <AICourseIntake onGenerationComplete={handleGenerationComplete} />
          </div>
        )}

        {/* TAB: COURSES & HISTORY */}
        {activeTab === 'courses' && (
          <div className="roadmap-wrapper-viewport animate-fadeIn">
            
            {/* VIEW: PORTFOLIO LIST */}
            {innerTrackView === 'portfolio' && (
              <div className="portfolio-stack-layout">
                
                {/* Active Target Hero Card */}
                <div className="target-node-hero-card">
                  <div className="hero-status-row">
                    <h3><Database size={16} /> Current Operational Target Node</h3>
                    <span className="status-pill">Database Connected</span>
                  </div>
                  
                  <div className="hero-action-row">
                    <h2>
                      {courseData ? courseData.title : (mongoSavedHistory[0]?.title || 'No active tracking pathways found.')}
                    </h2>
                    <button 
                      className="btn-resume-track"
                      disabled={mongoSavedHistory.length === 0}
                      onClick={() => {
                        if (!courseData && mongoSavedHistory.length > 0) setCourseData(mongoSavedHistory[0]);
                        setInnerTrackView('roadmap-active');
                      }}
                    >
                      <Play size={16} /> Resume Operational Track
                    </button>
                  </div>
                </div>

                {/* MongoDB History Registry */}
                <div className="history-registry-container">
                  <h3 className="registry-title"><History size={16} /> Real-time Repository Sync Logs</h3>
                  
                  {isLoading ? (
                    <div className="loading-state-panel">
                      <Loader2 className="spinner-icon" size={32} />
                      <p>Querying Atlas Clusters...</p>
                    </div>
                  ) : mongoSavedHistory.length === 0 ? (
                    <div className="empty-state-panel">
                      <p>No persistent structures recorded inside your cloud workspace. Generate a path first!</p>
                    </div>
                  ) : (
                    <div className="course-history-grid">
                      {mongoSavedHistory.map((courseRow) => (
                        <div 
                          key={courseRow._id} 
                          className="history-course-row-card"
                          onClick={() => {
                            setCourseData(courseRow);
                            setInnerTrackView('roadmap-active');
                          }}
                        >
                          <div className="row-meta-info">
                            <h4>{courseRow.title}</h4>
                            <span>Depth Tier: {courseRow.level} | Format: {courseRow.contentType}</span>
                          </div>
                          <div className="row-action-info">
                            <span className="load-matrix-txt">[CLICK_TO_LOAD]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW: ACTIVE ROADMAP TIMELINE */}
            {innerTrackView === 'roadmap-active' && courseData && (
              <div className="roadmap-active-container animate-slideUp">
                <button onClick={() => setInnerTrackView('portfolio')} className="btn-return-portfolio">
                  <ArrowLeft size={16} /> Return to Repositories
                </button>
                
                <div className="timeline-header-card">
                  <span className="timeline-pre-lbl">Active Execution Pipeline</span>
                  <h2 className="timeline-main-title">{courseData.title}</h2>
                  <span className="timeline-sub-metrics">Class: {courseData.contentType || 'Technical'} Track | Depth: {courseData.level}</span>
                </div>

                <div className="module-grid">
                  {getProgressTimelineModules(courseData).map((assignment) => {
                    const isLocked = assignment.status === 'locked';
                    const isCompleted = assignment.status === 'completed';
                    const isUnlocked = assignment.status === 'unlocked';

                    return (
                      <div 
                        key={assignment.id} 
                        className={`glass-card assignment-card ${assignment.status}`}
                        onClick={() => {
                          if (isLocked) {
                            alert("🔒 SECURITY MATRIX: This module is locked. Complete the previous assignments first.");
                          } else if (!isCompleted) {
                            setActiveChallenge(assignment);
                          }
                        }}
                      >
                        {isUnlocked && <div className="card-hover-line line-cyan"></div>}
                        
                        <div className="card-header">
                          <div className={`icon-box ${isUnlocked ? 'box-cyan' : isCompleted ? 'box-emerald' : 'box-slate'}`}>
                            {assignment.type === 'Coding' ? <Code size={20}/> : <LayoutGrid size={20}/>}
                          </div>
                          <span className={`badge ${isUnlocked ? 'badge-cyan' : isCompleted ? 'badge-emerald' : 'badge-slate'}`}>
                            {isCompleted ? <CheckCircle2 size={10} /> : isUnlocked ? <Unlock size={10} /> : <Lock size={10} />}
                            {isCompleted ? 'COMPLETED' : isUnlocked ? 'ACTIVE' : 'LOCKED'}
                          </span>
                        </div>

                        <h3 className="card-title">{assignment.title}</h3>
                        <p className="card-desc">{assignment.desc}</p>

                        <div className="card-footer">
                          <span className="task-type">TYPE: {assignment.type}</span>
                          {isUnlocked && <button className="btn-initialize btn-cyan">Enter Terminal Workspace &rarr;</button>}
                          {isLocked && <button className="btn-locked" disabled>Requires Previous Node</button>}
                          {isCompleted && <button className="btn-completed" disabled>Session Archived</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;