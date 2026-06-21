import React from 'react';
import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react';

export default function WorkspaceHeader({ courseTitle, currentDay, totalDays, onBack }) {
  const progressPercent = Math.round((currentDay / totalDays) * 100);

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', background: '#090d16', borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} className="pill-selector-item" style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', background: 'transparent', border: '1px solid #1e293b', borderRadius: '0.5rem', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>{courseTitle}</h1>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Learning Matrix</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Overall Progress</div>
          <div style={{ width: '150px', height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', transition: 'width 0.4s ease' }}></div>
          </div>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 'bold', background: 'rgba(6,182,212,0.05)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(6,182,212,0.1)' }}>
          Day {currentDay}/{totalDays}
        </span>
      </div>
    </header>
  );
}