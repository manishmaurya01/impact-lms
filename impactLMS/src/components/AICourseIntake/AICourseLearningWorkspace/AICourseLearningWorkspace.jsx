import React, { useState, useEffect } from 'react';
import WorkspaceHeader from './modules/WorkspaceHeader';
import ModuleSidebarTree from './modules/ModuleSidebarTree';
import MainResourceCanvas from './modules/MainResourceCanvas';
import TakeQuizView from '../../quiz/TakeQuizView'; // 🚀 IMPORT THE NEW SYSTEM COMPONENT

export default function AICourseLearningWorkspace({ courseData, onBack }) {
  const [activeModuleId, setActiveModuleId] = useState(courseData?.modules[0]?.moduleId || 1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video'); 

  // 🚀 CORE STATE REPOSITORIES
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isSyncingMaterial, setIsSyncingMaterial] = useState(false);
  const [completedTracks, setCompletedTracks] = useState({ "mod-1-topic-0": true });
  
  // 🚀 ROUTING FLAG FOR EXAMINATION SWITCH
  const [quizModeActive, setQuizModeActive] = useState(false);

  const modulesArray = courseData?.modules || [];
  const currentModuleIndex = modulesArray.findIndex(m => m.moduleId === activeModuleId);
  const currentModule = modulesArray[currentModuleIndex] || modulesArray[0];
  
  const currentTopicName = currentModule?.topics?.[activeTopicIndex] || "No Content Available";

  const loadTopicMaterialOnDemand = async (modId, topicIdx, specificTopicName) => {
    setIsSyncingMaterial(true);
    setActiveModuleId(modId);
    setActiveTopicIndex(topicIdx);
    setActiveMaterial(null); 
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/courses/fetch-material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseData._id,
          moduleId: modId,
          topicName: specificTopicName
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setActiveMaterial(json.data);
      }
    } catch (err) {
      console.error("Failed syncing material collection layer:", err);
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
    setQuizModeActive(false); // Reset window mode when switching topics
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

  // 🚀 CONDITIONAL INTERCEPT ROUTER: Passes ALL critical parameters safely down to terminal view
  if (quizModeActive) {
    return (
      <TakeQuizView 
        quiz={currentModule?.quiz} 
        topicName={currentTopicName}
        courseId={courseData?._id}
        moduleId={activeModuleId}
        onBackToWorkspace={() => setQuizModeActive(false)} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      <WorkspaceHeader courseTitle={courseData?.title || "AI Workspace"} onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        <ModuleSidebarTree 
          modules={modulesArray} 
          activeModuleId={activeModuleId}
          activeTopicIndex={activeTopicIndex}
          completedTracks={completedTracks}
          onSelectTopic={handleTopicSelection}
        />

        {isSyncingMaterial && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 4, 10, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ width: '400px', background: '#070a12', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '2.5rem 2rem', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', textAlign: 'center' }}>
              <div style={{ margin: '0 auto 1.5rem auto', width: '44px', height: '44px', border: '3px solid rgba(6, 182, 212, 0.1)', borderTop: '3px solid #06b6d4', borderRadius: '50%', animation: 'workspaceCoreSpin 0.85s linear infinite' }} />
              <h3 style={{ margin: '0 0 0.6rem 0', color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>Analyzing Topic Matrix</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 2rem 0', lineHeight: '1.4' }}>Gemini Engine is tailoring comprehensive structures, architectural roadmaps, and custom level examples...</p>
              <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', height: '100%', width: '45%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '10px', animation: 'shimmerProgressBar 1.4s infinite ease-in-out' }} />
              </div>
            </div>
            <style>{`
              @keyframes workspaceCoreSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              @keyframes shimmerProgressBar { 0% { left: -50%; } 100% { left: 100%; } }
            `}</style>
          </div>
        )}

        {/* 🚀 CONNECTED CORE BINDINGS SENT TO MAIN CANVAS ELEMENT */}
        <MainResourceCanvas 
          topicName={currentTopicName}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          videoSearchQuery={activeMaterial?.videoLink || "https://www.youtube.com"}
          materialNotes={activeMaterial} 
          quiz={currentModule?.quiz} 
          assignment={currentModule?.assignment} 
          onComplete={markTopicAsCompleted} 
          onLaunchQuiz={() => setQuizModeActive(true)}
          courseId={courseData?._id}
          moduleId={activeModuleId}
        />
      </div>
    </div>
  );
}