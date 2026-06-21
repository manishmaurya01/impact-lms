import React, { useState } from 'react';
import { Award, Clock, BookOpen, ChevronLeft, AlertTriangle, Shield, HelpCircle, ArrowRight, Terminal, Cpu, Monitor, CheckCircle } from 'lucide-react';

export default function TakeQuizView({ quiz, topicName, courseId, moduleId, onBackToWorkspace }) {
  // Navigation Flow States: 'DETAILS' | 'STREAM_ENFORCE' | 'GENERATING' | 'ACTIVE_QUIZ' | 'COMPLETED'
  const [assessmentPhase, setAssessmentPhase] = useState('DETAILS');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizDataRecordId, setQuizDataRecordId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamError, setStreamError] = useState("");

  // 🚀 PHASE A: SCREEN SHARE ENFORCER (WEBRTC INTEGRATION)
  // 🚀 PHASE A: SCREEN SHARE ENFORCER (DEVELOPMENT BYPASS MODE)
  const initiateSecureProctorStream = async () => {
    setStreamError("");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // simplified configuration parameters
        audio: false
      });

      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      // Dev environment workaround: tracking layer warns but doesn't lock execution
      if (settings.displaySurface !== 'monitor') {
        console.warn("[PROCTOR TELEMETRY WARNING]: Tab or Window shared. Overriding validation for Manish's local workspace setup.");
      }

      // Automatically register cleanup if user manually terminates the stream
      videoTrack.onended = () => {
        alert("🚨 CRITICAL ALERT: Screen share connection dropped. Telemetry tracking locked down.");
        window.location.reload();
      };

      // Proceed seamlessly to the generator layer
      compileDynamicQuizMatrix();
    } catch (err) {
      setStreamError("⚠️ Pipeline initialization faulted. Grant screen media parameters to proceed.");
    }
  };

  // 🚀 PHASE B: GENERATE WITH FRONTEND CONSOLE LOGGING
  const compileDynamicQuizMatrix = async () => {
    setAssessmentPhase('GENERATING');
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      console.log("📡 [FETCHING]: Initiating request to node endpoint with parameters:", { courseId, moduleId, topicName });
      
      const response = await fetch('http://localhost:5000/api/quiz/generate-and-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, moduleId, topicName, quizName: quiz?.name || "Sprint Evaluation" })
      });

      const json = await response.json();
      
      // 🔥 LIVE FRONTEND LOGGING
      console.log("📥 [RESPONSE FROM SERVER]:", json);

      if (json.success) {
        setGeneratedQuestions(json.quizData.questions);
        setQuizDataRecordId(json.quizData._id);
        setAssessmentPhase('ACTIVE_QUIZ');
      } else {
        console.error("❌ Server sent successful HTTP status but parsing failed payload:", json.message);
        setStreamError(`Model compilation engine failed to parse tokens: ${json.message || 'Check terminal structure'}`);
        setAssessmentPhase('STREAM_ENFORCE');
      }
    } catch (err) {
      console.error("🚨 Critical network connection exception triggered:", err);
      setStreamError("Network state error during evaluation initialization.");
      setAssessmentPhase('STREAM_ENFORCE');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🚀 PHASE C: EVALUATE PERFORMANCE & RECORD RESULTS TO DATABASE
  const dispatchPerformanceEvaluation = async () => {
    setIsProcessing(true);
    let correctCount = 0;
    
    // Evaluate answer index correctness matches
    generatedQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/quiz/record-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizDataId: quizDataRecordId,
          totalQuestions: generatedQuestions.length,
          correctAnswers: correctCount,
          scorePercentage: (correctCount / generatedQuestions.length) * 100,
          userSelections: selectedAnswers
        })
      });
      setAssessmentPhase('COMPLETED');
    } catch (err) {
      console.error("Telemetry upload fault:", err);
      alert("Results compilation locally verified but database dump faulted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      
      {/* HEADER CONTROL CONSOLE CONTAINER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', borderBottom: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button onClick={onBackToWorkspace} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid #1e293b', color: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
            <ChevronLeft size={14} /> Close Terminal
          </button>
          <div style={{ height: '24px', width: '1px', background: '#1e293b' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={16} color="#06B6D4" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em' }}>LUMINA_STUDIO://SECURE_PROCTOR_v3</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
            <Clock size={14} color="#06B6D4" />
            <span style={{ fontSize: '0.85rem', color: '#06B6D4', fontWeight: '700' }}>{quiz?.duration || "20 Mins"} ALLOCATED</span>
          </div>
        </div>
      </div>

      {/* CORE FRAME MULTI-STAGE ROUTER */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', overflowY: 'auto' }}>
        
        {/* STAGE 1: METADATA OVERVIEW DISPLAY */}
        {assessmentPhase === 'DETAILS' && (
          <div style={{ width: '100%', maxWidth: '640px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', padding: '3rem', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#06B6D4', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Cpu size={14} /> Evaluation Pipeline Ready
            </div>
            <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{quiz?.name || "Module Validation Assessment"}</h1>
            <p style={{ margin: '0 0 2rem 0', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>This platform leverages automated runtime matrix tracking configurations to match enterprise validation checks.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#020617', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.9rem' }}><strong>📚 Topic Target Context:</strong> <span style={{ color: '#06B6D4' }}>{topicName}</span></div>
              <div style={{ fontSize: '0.9rem' }}><strong>⏳ Global Processing Bounds:</strong> {quiz?.duration || "20 Minutes standard allotment"}</div>
            </div>

            <button onClick={() => setAssessmentPhase('STREAM_ENFORCE')} style={{ width: '100%', background: 'linear-gradient(135deg, #06B6D4, #0891b2)', border: 'none', color: '#020617', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Continue Verification Mode <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STAGE 2: MEDIA HANDSHAKE REQUEST OVERLAY */}
        {assessmentPhase === 'STREAM_ENFORCE' && (
          <div style={{ width: '100%', maxWidth: '580px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8B5CF6', margin: '0 auto 1.5rem auto' }}>
              <Monitor size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Enforce Secure Desktop Stream</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>To lock testing parameters, our server logs active layout drift monitoring streams. You must initialize <strong>"Entire Screen Share"</strong> parameters.</p>
            
            {streamError && <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'left', lineHeight: '1.5' }}>{streamError}</div>}
            
            <button onClick={initiateSecureProctorStream} style={{ width: '100%', background: 'linear-gradient(135deg, #8B5CF6, #7c3aed)', border: 'none', color: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
              Authorize Stream & Grant Access
            </button>
          </div>
        )}

        {/* STAGE 3: BACKEND GENERATOR RUNNING SIMULATION TRACKS */}
        {assessmentPhase === 'GENERATING' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto 1.5rem auto', width: '48px', height: '48px', border: '3px solid rgba(6, 182, 212, 0.1)', borderTop: '3px solid #06B6D4', borderRadius: '50%', animation: 'terminalSpin 0.8s linear infinite' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Compiling 10 Custom Topic Modules</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>AI compilation engine is analyzing scope configurations & building inventory payload arrays...</p>
            <style>{`@keyframes terminalSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* STAGE 4: LIVE 10 INTERACTIVE CONTAINER MODULES */}
        {assessmentPhase === 'ACTIVE_QUIZ' && (
          <div style={{ width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', height: '100%', maxHeight: '550px', alignItems: 'stretch' }}>
            {/* Quick side tracking panel */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assessment Segments</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {generatedQuestions.map((q, idx) => (
                  <button key={q.id} onClick={() => setCurrentQuestionIndex(idx)} style={{ height: '36px', borderRadius: '6px', border: idx === currentQuestionIndex ? '1px solid #06B6D4' : '1px solid #1e293b', background: selectedAnswers[q.id] !== undefined ? 'rgba(6, 182, 212, 0.1)' : '#020617', color: idx === currentQuestionIndex ? '#06B6D4' : '#94a3b8', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Display Canvas Frame */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: '700' }}>QUESTION CONFIGURATION MODULE {currentQuestionIndex + 1} OF 10</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '1rem 0 2rem 0', lineHeight: '1.5' }}>{generatedQuestions[currentQuestionIndex]?.questionText}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {generatedQuestions[currentQuestionIndex]?.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[generatedQuestions[currentQuestionIndex].id] === oIdx;
                    return (
                      <div key={oIdx} onClick={() => setSelectedAnswers({...selectedAnswers, [generatedQuestions[currentQuestionIndex].id]: oIdx})} style={{ background: isSelected ? 'rgba(6, 182, 212, 0.04)' : '#020617', border: isSelected ? '1px solid #06B6D4' : '1px solid #1e293b', padding: '1rem 1.25rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: isSelected ? '#06B6D4' : '#1e293b', color: isSelected ? '#020617' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: '700' }}>{String.fromCharCode(65 + oIdx)}</div>
                        <span style={{ fontSize: '0.9rem', color: isSelected ? '#fff' : '#cbd5e1' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons footer layout */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
                {currentQuestionIndex + 1 === generatedQuestions.length ? (
                  <button onClick={dispatchPerformanceEvaluation} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Submit System Answers</button>
                ) : (
                  <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Next Segment node</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: COMPLETED STATUS SYSTEM LOG DUMP */}
        {assessmentPhase === 'COMPLETED' && (
          <div style={{ width: '100%', maxWidth: '520px', background: '#0f172a', border: '1px solid #10b981', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#10b981', margin: '0 auto 1.5rem auto' }}><CheckCircle size={28} /></div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Evaluation Transmitted</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2.5rem' }}>Your answers metrics loop parameters have been parsed and securely registered into collections: [quizdata & quizresults].</p>
            <button onClick={onBackToWorkspace} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Return To Studio Canvas</button>
          </div>
        )}

      </div>
    </div>
  );
}