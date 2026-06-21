import React, { useState } from 'react';
import { Play, FileText, Award, CheckCircle, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

export default function MainResourceCanvas({ topicName, activeTab, setActiveTab, videoSearchQuery, materialNotes, quiz, assignment, onComplete }) {
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#02040a', padding: '2rem', overflowY: 'auto', color: '#fff' }}>
      
      {/* Tab Menu Control Matrices */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('video')} style={{ background: activeTab === 'video' ? 'rgba(6,182,212,0.05)' : 'transparent', border: 'none', color: activeTab === 'video' ? '#06b6d4' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          📺 Video Lecture & Study Material
        </button>
        <button onClick={() => setActiveTab('quiz')} style={{ background: activeTab === 'quiz' ? 'rgba(245,158,11,0.05)' : 'transparent', border: 'none', color: activeTab === 'quiz' ? '#f59e0b' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          ⚡ Quiz Evaluation
        </button>
        <button onClick={() => setActiveTab('assignment')} style={{ background: activeTab === 'assignment' ? 'rgba(16,185,129,0.05)' : 'transparent', border: 'none', color: activeTab === 'assignment' ? '#10b981' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          🛠️ Assignment Challenge
        </button>
      </div>

      <div style={{ flex: 1, background: '#070a12', border: '1px solid rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem' }}>
        
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>Active Workspace Core Concept: {topicName}</h2>
            
            {/* Video Player Embedded Canvas */}
            <div style={{ height: '360px', background: '#02040a', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <iframe width="100%" height="100%" src={getEmbedUrl(videoSearchQuery)} title="Video Console" frameBorder="0" allowFullScreen />
            </div>

            {/* 🚀 DEEP ENHANCED DISCOVERY MATERIAL CORE UI LAYOUT */}
            {materialNotes ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                
                {/* Section A: Definition */}
                <div style={{ background: '#02040a', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #06b6d4' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4' }}><BookOpen size={16}/> Concept Definition</h4>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>{materialNotes.definition}</p>
                </div>

                {/* Section B: How it Works */}
                <div style={{ background: '#02040a', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #8b5cf6' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6' }}><Lightbulb size={16}/> How it Works (Internal Logic)</h4>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>{materialNotes.howItWorks}</p>
                </div>

                {/* Section C: Advantages vs Disadvantages */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: '#02040a', padding: '1.25rem', borderRadius: '0.5rem', borderTop: '2px solid #10b981' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>🟢 Main Advantages</h5>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      {materialNotes.advantages?.map((adv, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{adv}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: '#02040a', padding: '1.25rem', borderRadius: '0.5rem', borderTop: '2px solid #ef4444' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#ef4444' }}>🔴 Key Disadvantages</h5>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      {materialNotes.disadvantages?.map((dis, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{dis}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Section D: Code / Functional Application Examples */}
                <div style={{ background: '#010409', border: '1px solid #30363d', padding: '1.25rem', borderRadius: '0.5rem', fontFamily: 'monospace' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#58a6ff' }}>💻 Implementation & Practical Examples:</h5>
                  <pre style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{materialNotes.examples}</pre>
                </div>

              </div>
            ) : (
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>Synthesizing active topic materials parameters stream...</div>
            )}

            <button onClick={onComplete} style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Mark Concept Finished
            </button>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <h3 style={{ color: '#f59e0b', margin: '0 0 1rem 0' }}>⚡ Module Quiz Evaluation: {quiz?.name}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Theme Scope: {quiz?.quizTopic || "General Topic Validation"}</p>
          </div>
        )}

        {activeTab === 'assignment' && (
          <div>
            <h3 style={{ color: '#10b981', margin: '0 0 1rem 0' }}>🛠️ Core Challenge Task: {assignment?.name}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>{assignment?.assignmentObjective}</p>
          </div>
        )}

      </div>
    </div>
  );
}