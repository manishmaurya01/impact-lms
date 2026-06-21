import React, { useState } from 'react';
import WorkspaceHeader from './modules/WorkspaceHeader';
import ModuleSidebarTree from './modules/ModuleSidebarTree';
import MainResourceCanvas from './modules/MainResourceCanvas';

export default function AICourseLearningWorkspace({ courseData, onBack }) {
  // 🚀 Mapped to native data fields
  const [activeModuleId, setActiveModuleId] = useState(courseData?.modules[0]?.moduleId || 1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video'); 

  const [completedTracks, setCompletedTracks] = useState({
    "mod-1-topic-0": true, 
  });

  const modulesArray = courseData?.modules || [];
  const currentModuleIndex = modulesArray.findIndex(m => m.moduleId === activeModuleId);
  const currentModule = modulesArray[currentModuleIndex] || modulesArray[0];
  const currentTopic = currentModule?.topics?.[activeTopicIndex] || currentModule?.topics?.[0] || "No Content Available";

  const handleTopicSelection = (modId, topicIdx) => {
    setActiveModuleId(modId);
    setActiveTopicIndex(topicIdx);
    setActiveTab('video'); 
  };

  const markTopicAsCompleted = () => {
    const currentKey = `mod-${activeModuleId}-topic-${activeTopicIndex}`;
    const updatedTracks = { ...completedTracks, [currentKey]: true };
    setCompletedTracks(updatedTracks);

    if (activeTopicIndex + 1 < (currentModule?.topics?.length || 0)) {
      setActiveTopicIndex(prev => prev + 1);
    } else if (currentModuleIndex + 1 < modulesArray.length) {
      const nextModuleObj = modulesArray[currentModuleIndex + 1];
      setActiveModuleId(nextModuleObj.moduleId);
      setActiveTopicIndex(0);
    } else {
      alert("🎉 Congratulations Manish! You have completed all core paths within this matrix bundle!");
    }
    setActiveTab('video');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      <WorkspaceHeader 
        courseTitle={courseData?.title || "AI Workspace"} 
        onBack={onBack} 
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ModuleSidebarTree 
          modules={modulesArray}
          activeModuleId={activeModuleId}
          activeTopicIndex={activeTopicIndex}
          completedTracks={completedTracks}
          onSelectTopic={handleTopicSelection}
        />

        <MainResourceCanvas 
          topicName={currentTopic}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          quiz={currentModule?.quiz} // Direct access fixed
          assignment={currentModule?.assignment} // Direct access fixed
          onComplete={markTopicAsCompleted} 
        />
      </div>
    </div>
  );
}