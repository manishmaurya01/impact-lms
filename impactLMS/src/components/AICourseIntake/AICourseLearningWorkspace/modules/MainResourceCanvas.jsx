import React from 'react';
import { Video, FileText, Globe, Check, Award, Terminal } from 'lucide-react';

export default function MainResourceCanvas({ activeModuleId, activeTopicIndex, topicName, activeTab, setActiveTab, quiz, assignment, onComplete }) {
  
  // Format target clean query parameter links maps to pass to specific educational portals
  const formattedQuery = encodeURIComponent(topicName);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#02040a', overflowY: 'auto', padding: '2rem' }}>
      <div style={{ maxWidth: '58rem', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* TOP TOPIC TITLE ACTION BANNER HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#06B6D4', fontWeight: 'bold', fontFamily: 'monospace' }}>TARGET CORE CONCEPT CONSOLE</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0' }}>{topicName}</h2>
          </div>
          <button 
            onClick={onComplete}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.2)' }}
          >
            <Check size={14} /> Mark Topic Done
          </button>
        </div>

        {/* 🚀 THREE-PART SUB NAVIGATION TABS HUB */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid #1e293b', padding: '0.35rem', borderRadius: '50px', width: 'fit-content' }}>
          {[
            { id: 'video', label: 'Video Reference', icon: <Video size={13} /> },
            { id: 'material', label: 'Material Notes', icon: <FileText size={13} /> },
            { id: 'web', label: 'Web Documentation References', icon: <Globe size={13} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem',
                border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600,
                background: activeTab === tab.id ? '#1e293b' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 🚀 SUB-TAB WINDOW VIEW DISPATCHERS CONTEXTS */}
        <div style={{ minHeight: '300px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '1rem', padding: '1.5rem' }}>
          
          {/* TAB 1: YOUTUBE EMBED PLAYER MOUNT */}
          {activeTab === 'video' && (
            <div style={{ width: '100%', height: '380px', borderRadius: '0.5rem', overflow: 'hidden', background: '#000' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed?listType=search&list=${formattedQuery}`}
                title="LuminaLearn Stream Console"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* TAB 2: TEXT MATERIAL BASE SYNTAX DESCRIPTIONS */}
          {activeTab === 'material' && (
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Syntax Breakdown & Production Implementation Notes</h4>
              <p>Below is the compiled contextual structural walkthrough regarding <strong>{topicName}</strong>. review structural dependencies architecture loops rules safely:</p>
              <pre style={{ background: '#090d16', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b', color: '#a78bfa', fontSize: '0.8rem', overflowX: 'auto', marginTop: '1rem' }}>
{`// Production Target Sandbox Compilation Frame for:
// ${topicName}

function executeModuleEngineInstance() {
  console.log("[LUMINALEARN_STUDIO] Syncing telemetry pointers execution ok...");
  return true;
}`}
              </pre>
            </div>
          )}

          {/* TAB 3: WEB LINKS PORTALS CHIPS */}
          {activeTab === 'web' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { name: 'MDN Web Docs Portal', domain: 'developer.mozilla.org', color: '#fff' },
                { name: 'GeeksforGeeks Library', domain: 'geeksforgeeks.org', color: '#2f9e44' },
                { name: 'W3Schools Sandboxes', domain: 'w3schools.com', color: '#04aa6d' },
                { name: 'Official Language Specification', domain: 'documentation.org', color: '#06b6d4' }
              ].map((site, idx) => (
                <a
                  key={idx}
                  href={`https://${site.domain}/search?q=${formattedQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '1.25rem', background: '#070a12', border: '1px solid #1e293b', borderRadius: '0.75rem', textDecoration: 'none', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: site.color }}>{site.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#475569' }}>Browse index references &rarr;</span>
                </a>
              ))}
            </div>
          )}

        </div>

        {/* 🔒 BOTTOM FIXED SUB CONSOLE: EVALUATION MODULES AND TASKS MESH */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '2rem' }}>
          
          {/* Realtime Quiz Verification Box */}
          <div style={{ background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.08)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Award size={14} /> AI Context Calibration Test
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>{quiz?.name || "Topic Evaluation MCQ Check"}</h4>
            <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: '0.8rem' }}>Validation Scope: Complete active content reading matrices to answer verification parameters blocks.</p>
            <button onClick={() => alert("Spinning up evaluation instances...")} style={{ background: '#f59e0b', border: 'none', color: '#020617', padding: '0.55rem 1rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Launch Quiz Terminal
            </button>
          </div>

          {/* Code Execution Sandbox Challenge Box */}
          <div style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.08)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Terminal size={14} /> Production Sandbox Challenge
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>{assignment?.name || "System Logic Build Testing"}</h4>
            <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: '0.8rem' }}>Complexity Baseline: Execute real structured logic parameters matching objective schema requirements layers.</p>
            <button onClick={() => alert("Spawning workspace terminals...")} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.55rem 1rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Open Code Workbench
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}