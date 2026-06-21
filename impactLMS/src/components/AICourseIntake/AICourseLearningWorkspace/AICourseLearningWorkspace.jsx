import React, { useState, useEffect } from 'react';
import WorkspaceHeader from './modules/WorkspaceHeader';
import ModuleSidebarTree from './modules/ModuleSidebarTree';
import MainResourceCanvas from './modules/MainResourceCanvas';

export default function AICourseLearningWorkspace({ courseData, onBack }) {
  const [activeModuleId, setActiveModuleId] = useState(courseData?.modules[0]?.moduleId || 1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video'); 

  // 🚀 ACTUAL SAVED CORE REPOSITORIES 
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isSyncingMaterial, setIsSyncingMaterial] = useState(false);
  const [completedTracks, setCompletedTracks] = useState({ "mod-1-topic-0": true });

  const modulesArray = courseData?.modules || [];
  const currentModuleIndex = modulesArray.findIndex(m => m.moduleId === activeModuleId);
  const currentModule = modulesArray[currentModuleIndex] || modulesArray[0];
  
  // Array parameters map strings as-is layout format
  const currentTopicName = currentModule?.topics?.[activeTopicIndex] || "No Content Available";

  // 🚀 BACKGROUND SYNC HANDLER: Hits Materials Database Realtime on every click
  const loadTopicMaterialOnDemand = async (modId, topicIdx, specificTopicName) => {
    setIsSyncingMaterial(true);
    setActiveModuleId(modId);
    setActiveTopicIndex(topicIdx);
    
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
        // Hydrate active panel from dynamic material collection model
        setActiveMaterial(json.data);
      }
    } catch (err) {
      console.error("Failed syncing material collection layer:", err);
    } finally {
      setIsSyncingMaterial(false);
    }
  };

  // Init sequence mapping hook
  useEffect(() => {
    loadTopicMaterialOnDemand(activeModuleId, activeTopicIndex, currentModule?.topics?.[0] || "");
  }, []);

  const handleTopicSelection = (modId, topicIdx) => {
    setActiveTab('video');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      <WorkspaceHeader courseTitle={courseData?.title || "AI Workspace"} onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 🚀 THE NATIVE IMMUTABLE MODULES TREE PRESERVED */}
        <ModuleSidebarTree 
          modules={modulesArray} 
          activeModuleId={activeModuleId}
          activeTopicIndex={activeTopicIndex}
          completedTracks={completedTracks}
          onSelectTopic={handleTopicSelection}
        />

        {isSyncingMaterial && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#070a12', border: '1px solid #06b6d4', color: '#06b6d4', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', zIndex: 99 }}>
            ⏳ Compiling topic blueprints: definition, advantages & code instances...
          </div>
        )}

        {/* Distributed dynamic data parameters down straight to Canvas elements rendering */}
        <MainResourceCanvas 
          topicName={currentTopicName}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          videoSearchQuery={activeMaterial?.videoLink || "https://www.youtube.com"}
          materialNotes={activeMaterial} // Passing whole material object containing definition, examples etc.
          quiz={currentModule?.quiz} 
          assignment={currentModule?.assignment} 
          onComplete={markTopicAsCompleted} 
        />
      </div>
    </div>
  );
}