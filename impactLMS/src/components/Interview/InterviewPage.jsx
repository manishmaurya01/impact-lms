import React, { useState } from 'react';
import { 
  MessageSquareCode, Sparkles, Video, Mic, 
  ArrowRight, ShieldCheck, HelpCircle, History 
} from 'lucide-react';

export default function InterviewPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const topics = [
    { id: 'frontend', name: 'Frontend Engineering', desc: 'React, JS, CSS Architecture, Webpack', icon: '⚛️' },
    { id: 'backend', name: 'Backend & System Design', desc: 'Node.js, Databases, Scaling, APIs', icon: '⚙️' },
    { id: 'dsa', name: 'Data Structures & Algos', desc: 'Arrays, Trees, Graphs, Optimization', icon: '🧠' },
    { id: 'behavioral', name: 'Behavioral & HR Round', desc: 'STAR Methodology, Leadership, Culture', icon: '🤝' },
  ];

  const handleStartInterview = () => {
    if (!selectedTopic) return;
    setIsStarting(true);
    // यहाँ आप इंटरव्यू रूम या API कॉल पर रीडायरेक्ट कर सकते हैं
    setTimeout(() => {
      alert(`Starting your AI Interview for: ${selectedTopic.toUpperCase()}!`);
      setIsStarting(false);
    }, 1500);
  };

  return (
    <div style={{
      backgroundColor: '#020617',
      minHeight: '100vh',
      color: '#f8fafc',
      padding: '2.5rem',
      fontFamily: 'system-ui, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 🌟 HEADER SECTION */}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(30, 41, 59, 0.5)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ color: '#06B6D4', display: 'flex', alignItems: 'center' }}>
            <MessageSquareCode size={28} />
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            AI Adaptive Interviewer
          </h1>
        </div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '1rem' }}>
          Real-time, intelligent simulation tailored to your tech stack. Get instant feedback and behavioral matrix reports.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* 🚀 LEFT: TOPIC SELECTION */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: '#8B5CF6' }} /> Select Your Domain
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    background: isSelected ? 'rgba(6, 182, 212, 0.08)' : '#0f172a',
                    border: isSelected ? '2px solid #06B6D4' : '1px solid rgba(30, 41, 59, 0.8)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{topic.icon}</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600, color: isSelected ? '#06B6D4' : '#fff' }}>
                    {topic.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {topic.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ▶️ ACTION BUTTON */}
          <button
            onClick={handleStartInterview}
            disabled={!selectedTopic || isStarting}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: selectedTopic ? 'linear-gradient(135deg, #06B6D4, #8B5CF6)' : 'rgba(30, 41, 59, 0.5)',
              color: selectedTopic ? '#fff' : '#64748b',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: selectedTopic ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s',
            }}
          >
            {isStarting ? 'Configuring AI Environment...' : 'Initialize Interview Session'}
            {!isStarting && <ArrowRight size={18} />}
          </button>
        </section>

        {/* 📋 RIGHT: SYSTEM CHECKS & HISTORY */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* System Readiness */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#10B981' }} /> Pre-flight Diagnostics
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={14} style={{ color: '#10B981' }} /> Camera Stream: Ready</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mic size={14} style={{ color: '#10B981' }} /> Audio Input / Mic: Connected</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle size={14} style={{ color: '#06B6D4' }} /> AI Core Model: Online (V4)</li>
            </ul>
          </div>

          {/* Quick Stats/History */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} style={{ color: '#F59E0B' }} /> Past Performance
            </h3>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06B6D4' }}>84%</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Average Match Score</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(30, 41, 59, 0.5)', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'between' }}>
              <span>Last Session: Frontend</span>
              <span style={{ color: '#10B981', marginLeft: 'auto' }}>Passed</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}