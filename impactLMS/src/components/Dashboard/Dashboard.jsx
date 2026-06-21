import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Loader2, History, Play } from 'lucide-react';
import './Dashboard.css';

// Importing your Sidebar and child component clusters
import DashboardSidebar from './modules/DashboardSidebar';
import AICourseIntake from '../AICourseIntake/AICourseIntake';
import AIAssignmentEngine from '../Asignment/AIAssignmentEngine';
import NotesPage from '../Notes/NotesPage';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 🚀 GLOBAL WORKSPACE VIEW CONTROLLER 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mongoSavedHistory, setMongoSavedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistoricalCoursesFromDB();
  }, []);

  const fetchHistoricalCoursesFromDB = async () => {
    setIsLoading(true);
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      const resultJson = await response.json();
      if (resultJson.success && resultJson.data) {
        setMongoSavedHistory(resultJson.data);
      }
    } catch (error) {
      console.error("[DASHBOARD_DB_FETCH_ERROR] Core pipeline syncing failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="lms-premium-viewport" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#020617' }}>
      
      {/* 🔒 SIDEBAR PERMANENTLY LOCKED HERE (Never unmounts or breaks) */}
      <DashboardSidebar 
        onLogout={handleLogout} 
        currentActiveTab={activeTab}
        onTabChange={(tabName) => setActiveTab(tabName)} 
      />

      {/* 🚀 DYNAMIC CONTENT WINDOW (Only this section switches views) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <main className="lms-workspace-stage" style={{ flex: 1, overflowY: 'auto', padding: activeTab === 'dashboard' ? '2.5rem 3rem' : '0' }}>
          
          {/* === TABS DISPATCHER RENDER RULES === */}
          
          {activeTab === 'dashboard' && (
            <div className="dashboard-layout-wrapper animate-fadeIn" style={{ maxWidth: '64rem', margin: '0 auto' }}>
              <div className="welcome-hero-card" style={{ marginBottom: '2rem' }}>
                <div className="ambient-glow-sphere"></div>
                <h2>Welcome to LuminaLearn Matrix</h2>
                <p>Your streamlined micro-architecture console. Side navbar options dynamically expand study tracks data repositories.</p>
              </div>

              <div className="portfolio-stack-layout" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="target-node-hero-card">
                  <div className="hero-status-row">
                    <h3><Database size={16} /> Latest Operational Target Node</h3>
                    <span className="status-pill">Database Linked</span>
                  </div>
                  <div className="hero-action-row">
                    <h2>{mongoSavedHistory.length > 0 ? mongoSavedHistory[0].title : 'No active pathways tracking currently.'}</h2>
                    <button className="btn-resume-track" disabled={mongoSavedHistory.length === 0} onClick={() => setActiveTab('courses')}>
                      Open Course Hub &rarr;
                    </button>
                  </div>
                </div>

                <div className="history-registry-container">
                  <h3 className="registry-title"><History size={16} /> Recent Cluster Sync Registries</h3>
                  {isLoading ? (
                    <div className="loading-state-panel">
                      <Loader2 className="spinner-icon" style={{ animation: 'spin 1s linear infinite', color: '#06B6D4' }} size={32} />
                      <p>Syncing Clusters...</p>
                    </div>
                  ) : mongoSavedHistory.length === 0 ? (
                    <div className="empty-state-panel"><p>No active roadmaps found inside account indices.</p></div>
                  ) : (
                    <div className="course-history-grid">
                      {mongoSavedHistory.slice(0, 3).map((courseRow) => (
                        <div key={courseRow._id} className="history-course-row-card" onClick={() => setActiveTab('courses')}>
                          <div className="row-meta-info">
                            <h4>{courseRow.title}</h4>
                            <span>Tier: {courseRow.level} | Format: {courseRow.contentType}</span>
                          </div>
                          <span className="load-matrix-txt">[LOAD_DATA]</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === INTERACTIVE INTAKE PATH AND REPOSITORY MOUNT === */}
          {activeTab === 'generate' && <AICourseIntake />}
          {activeTab === 'courses' && <AICourseIntake />}

          {/* === INDEPENDENT ENGINE AND TERMINALS MOUNT === */}
          {activeTab === 'assignments' && <AIAssignmentEngine />}
          {activeTab === 'notes' && <NotesPage />}

          {/* === TEMPORARY PLACEHOLDER FOR QUIZZES TAB === */}
          {activeTab === 'quizzes' && (
            <div style={{ padding: '3rem', color: '#fff' }}>
              <h2>AI Adaptive Quizzes Terminal</h2>
              <p style={{ color: '#64748b' }}>Adaptive evaluation matrices are parsing telemetry signals...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}