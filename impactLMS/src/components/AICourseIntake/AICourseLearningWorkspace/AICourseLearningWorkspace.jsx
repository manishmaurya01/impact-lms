import React, { useState, useEffect } from 'react';
import WorkspaceHeader from './modules/WorkspaceHeader';
import ModuleSidebarTree from './modules/ModuleSidebarTree';
import MainResourceCanvas from './modules/MainResourceCanvas';
import TakeQuizView from '../../quiz/TakeQuizView'; 

export default function AICourseLearningWorkspace({ courseData, onBack }) {
  const [activeModuleId, setActiveModuleId] = useState(courseData?.modules[0]?.moduleId || 1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video'); 

  // CORE STATE REPOSITORIES
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isSyncingMaterial, setIsSyncingMaterial] = useState(false);
  const [completedTracks, setCompletedTracks] = useState({ "mod-1-topic-0": true });
  
  // 🚀 DYNAMIC INLINE DATA CARRIERS
  const [quizResultsCache, setQuizResultsCache] = useState({});
  const [quizModeActive, setQuizModeActive] = useState(false);

  const modulesArray = courseData?.modules || [];
  const currentModuleIndex = modulesArray.findIndex(m => m.moduleId === activeModuleId);
  const currentModule = modulesArray[currentModuleIndex] || modulesArray[0];
  
  const currentTopicName = currentModule?.topics?.[activeTopicIndex] || "No Content Available";

  // 🚀 HIGH-FIDELITY CONTEXT AUTO-FETCHER SYSTEM (HITS DB DIRECTLY FOR MATERIAL + LOCKS)
  const loadTopicMaterialOnDemand = async (modId, topicIdx, specificTopicName) => {
    setIsSyncingMaterial(true);
    setActiveModuleId(modId);
    setActiveTopicIndex(topicIdx);
    setActiveMaterial(null); 
    
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Concept Materials Framework
      const materialRes = await fetch('http://localhost:5000/api/courses/fetch-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ courseId: courseData._id, moduleId: modId, topicName: specificTopicName })
      });
      const matJson = await materialRes.json();
      if (matJson.success && matJson.data) setActiveMaterial(matJson.data);

      // 2. 🚀 LIVE DATABASE SECURE STATUS LOCK CHECK SYNC
      const lockRes = await fetch('http://localhost:5000/api/quiz/check-lock-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ courseId: courseData._id, moduleId: modId, topicName: specificTopicName })
      });
      const lockJson = await lockRes.json();
      
      const trackKey = `mod-${modId}-topic-${topicIdx}`;
      if (lockJson.success && lockJson.isLocked) {
        setQuizResultsCache(prev => ({ ...prev, [trackKey]: lockJson.resultData }));
      }

    } catch (err) {
      console.error("Failed syncing material telemetry:", err);
    } finally {
      setIsSyncingMaterial(false);
    }
  };

  useEffect(() => {
    if (modulesArray.length > 0) {
      loadTopicMaterialOnDemand(activeModuleId, activeTopicIndex, currentModule?.topics?.[0] || "");
    }
  }, []);

  const handleTopicSelection = (modId, topicIdx) => {
    setActiveTab('video');
    setQuizModeActive(false); 
    const targetModule = modulesArray.find(m => m.moduleId === modId);
    const targetTopicName = targetModule?.topics?.[topicIdx] || "";
    loadTopicMaterialOnDemand(modId, topicIdx, targetTopicName);
  };

  const markTopicAsCompleted = () => {
    const currentKey = `mod-${activeModuleId}-topic-${activeTopicIndex}`;
    setCompletedTracks(prev => ({ ...prev, [currentKey]: true }));

    if (activeTopicIndex + 1 < (currentModule?.topics?.length || 0)) {
      handleTopicSelection(activeModuleId, activeTopicIndex + 1);
    } else if (currentModuleIndex + 1 < modulesArray.length) {
      const nextModuleObj = modulesArray[currentModuleIndex + 1];
      handleTopicSelection(nextModuleObj.moduleId, 0);
    } else {
      alert("🎉 Congratulations Manish! Dynamic curriculum paths completely verified!");
    }
  };

  const handleQuizSubmissionSuccess = (scorePayload) => {
    const activeTrackKey = `mod-${activeModuleId}-topic-${activeTopicIndex}`;
    setQuizResultsCache(prev => ({ ...prev, [activeTrackKey]: scorePayload }));
    setActiveTab('quiz'); 
    setQuizModeActive(false); 
  };

  if (quizModeActive) {
    return (
      <TakeQuizView 
        quiz={currentModule?.quiz} 
        topicName={currentTopicName}
        courseId={courseData?._id}
        moduleId={activeModuleId}
        onBackToWorkspace={() => setQuizModeActive(false)} 
        onQuizSubmitFinished={handleQuizSubmissionSuccess} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
     {/* 🚀 UPGRADED REALTIME SECURE WORKSPACE HEADER IN AICourseLearningWorkspace.jsx */}
<WorkspaceHeader 
  courseTitle={courseData?.title} 
  modules={modulesArray}                  // 🔥 Passing structural array for count calculations
  completedTracks={completedTracks}        // 🔥 Passing local track indexes for dynamic verification
  onBack={onBack} 
/>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <ModuleSidebarTree modules={modulesArray} activeModuleId={activeModuleId} activeTopicIndex={activeTopicIndex} completedTracks={completedTracks} onSelectTopic={handleTopicSelection} />
        
        {isSyncingMaterial && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 4, 10, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ width: '400px', background: '#070a12', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '2.5rem 2rem', borderRadius: '1rem', textAlgin: 'center', textAlign: 'center' }}>
              <div style={{ margin: '0 auto 1.5rem auto', width: '44px', height: '44px', border: '3px solid rgba(6, 182, 212, 0.1)', borderTop: '3px solid #06b6d4', borderRadius: '50%', animation: 'workspaceCoreSpin 0.85s linear infinite' }} />
              <h3 style={{ margin: '0 0 0.6rem 0', color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>Syncing Secure Telemetry Matrix</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Loading dynamic learning paths and system verification logs...</p>
            </div>
            <style>{`@keyframes workspaceCoreSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <MainResourceCanvas 
          topicName={currentTopicName} activeTab={activeTab} setActiveTab={setActiveTab} videoSearchQuery={activeMaterial?.videoLink || "https://www.youtube.com"} materialNotes={activeMaterial} quiz={currentModule?.quiz} assignment={currentModule?.assignment} onComplete={markTopicAsCompleted} onLaunchQuiz={() => setQuizModeActive(true)} courseId={courseData?._id} moduleId={activeModuleId}
          activeQuizResult={quizResultsCache[`mod-${activeModuleId}-topic-${activeTopicIndex}`]} 
        />
      </div>
    </div>
  );
}