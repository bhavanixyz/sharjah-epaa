import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Maximize2, Minimize2, Copy, RefreshCw, Trash2, Sparkles, 
  Check, ArrowRight, BarChart3, AlertTriangle, Cpu, Wrench, Shield 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Marhaba! I am your **Sharjah EPAA Intelligence Assistant**. I can help you analyze telemetry streams, SLA compliance, equipment drift, work orders, and network health across Sharjah Emirates.',
      type: 'text'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const { setActiveTab } = useApp();

  const predefinedPrompts = [
    "Show all environmental networks currently experiencing issues.",
    "Which sites have the highest number of open work orders?",
    "Show overdue maintenance activities.",
    "Show equipment requiring calibration.",
    "Which environmental network has the lowest operational health?",
    "Show work orders that exceeded SLA.",
    "Show equipment with upcoming maintenance within 30 days.",
    "Show sites with degraded equipment.",
    "Compare work order performance for the last 6 months.",
    "Show spare parts currently below minimum stock level."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = generateResponse(query);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 900);
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('networks') || q.includes('lowest operational health') || q.includes('experiencing issues')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Here is the network health breakdown for Sharjah environmental domains:',
        type: 'card_table',
        data: [
          { network: 'Marine Water Quality Network', status: 'Degraded (84% Health)', issue: 'Sensor Drift on Buoy-02', module: 'Live Site Management' },
          { network: 'Air Quality Ambient Network', status: 'Optimal (98.4% Health)', issue: 'No Active Failure', module: 'Site Management' },
          { network: 'Groundwater Hydrology Stream', status: 'Maintenance (91% Health)', issue: 'Well Pressure Calibration', module: 'Drift & Gas Calibration' }
        ]
      };
    }

    if (q.includes('work orders') || q.includes('sla') || q.includes('highest number')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Summary of active Work Orders and SLA Velocity across EPA sites:',
        type: 'kpi_summary',
        kpis: [
          { title: 'CRITICAL OPEN WOs', val: '3 Tickets', color: '#DC2626' },
          { title: 'SLA COMPLIANCE', val: '96.2%', color: '#00A878' },
          { title: 'MEAN TIME TO REPAIR', val: '2.8 Hours', color: '#0891B2' }
        ],
        textDetails: 'Sites with highest open tickets: **Sharjah Industrial Area 3** (2 tickets) and **Khorfakkan Harbor** (1 ticket).'
      };
    }

    if (q.includes('calibration') || q.includes('overdue maintenance')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Found 2 sensors requiring immediate calibration & drift verification:',
        type: 'list_items',
        items: [
          { title: 'Teledyne T100 SO2 Analyzer (Khorfakkan)', detail: 'Overdue by 4 days • Zero drift exceeded +2.1%', tab: 'Drift & Gas Calibration' },
          { title: 'Horiba APNA-370 NOx Analyzer (Wasit)', detail: 'Due in 2 days • Span gas verification required', tab: 'Drift & Gas Calibration' }
        ]
      };
    }

    if (q.includes('spare parts') || q.includes('stock')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Spare parts currently below safety reorder threshold:',
        type: 'card_table',
        data: [
          { network: 'PTFE 47mm Membrane Filters', status: '8 Units Left (Min: 10)', issue: 'Requisition Required', module: 'Inventory & Spare Parts' },
          { network: 'Sampling Pump Diaphragms', status: '4 Units Left (Min: 5)', issue: 'Restock Pending', module: 'Inventory & Spare Parts' }
        ]
      };
    }

    // Default EPA domain answer
    return {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Regarding your query on **"${query}"**:\n\nAll environmental telemetry streams across Sharjah Emirates are actively polled at 1-minute intervals. Currently, 8 monitoring sites are active with 98.4% total network uptime. You can inspect detailed work orders, calibration logs, and inventory balances directly in their respective platform modules.`,
      type: 'text'
    };
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Conversation cleared. How else may I assist you with Sharjah EPAA operational telemetry?',
        type: 'text'
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Icon-Only with Emerald-Black Gradient) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Sharjah EPAA ChatAI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00A878 0%, #0B132B 65%, #000000 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(0, 168, 120, 0.4)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 168, 120, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulseGlow 3s infinite ease-in-out'
          }}
        >
          <Bot size={24} />
        </button>
      )}

      {/* Main Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isExpanded ? '0' : '24px',
            right: isExpanded ? '0' : '24px',
            top: isExpanded ? '0' : 'auto',
            left: isExpanded ? '0' : 'auto',
            width: isExpanded ? '100vw' : '440px',
            height: isExpanded ? '100vh' : '620px',
            maxWidth: isExpanded ? '100vw' : '92vw',
            maxHeight: isExpanded ? '100vh' : '85vh',
            zIndex: 99999,
            background: '#FFFFFF',
            borderRadius: isExpanded ? '0' : '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            border: '1px solid #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'rgba(0,168,120,0.2)', borderRadius: '10px', color: '#00A878' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Sharjah EPAA Intelligence AI</h3>
                <span style={{ fontSize: '0.7rem', color: '#00A878', fontWeight: 600 }}>● Connected to EPA Telemetry Engine</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => setIsExpanded(!isExpanded)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}>
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={handleClear} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }} title="Clear Chat">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Suggested Prompts Pill Container */}
            {messages.length <= 2 && (
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#00A878" /> SUGGESTED OPERATIONAL PROMPTS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {predefinedPrompts.slice(0, 6).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        background: '#F1F5F9',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation list */}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    background: m.sender === 'user' ? '#00A878' : '#FFFFFF',
                    color: m.sender === 'user' ? '#FFFFFF' : '#0F172A',
                    padding: '12px 16px',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: m.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                    fontSize: '0.84rem',
                    lineHeight: 1.5
                  }}
                >
                  <p style={{ margin: 0 }}>{m.text}</p>

                  {/* Render Table Response */}
                  {m.type === 'card_table' && m.data && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                      {m.data.map((row, idx) => (
                        <div key={idx} style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '6px', marginBottom: '6px', fontSize: '0.76rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#0F172A' }}>{row.network}</strong>
                            <div style={{ color: '#64748B' }}>{row.issue}</div>
                          </div>
                          <button onClick={() => { setActiveTab(row.module); setIsOpen(false); }} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render KPI Summary */}
                  {m.type === 'kpi_summary' && m.kpis && (
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {m.kpis.map((kpi, idx) => (
                        <div key={idx} style={{ background: '#F1F5F9', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>{kpi.title}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: kpi.color }}>{kpi.val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render List Items */}
                  {m.type === 'list_items' && m.items && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {m.items.map((item, idx) => (
                        <div key={idx} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '8px 10px', borderRadius: '6px', fontSize: '0.76rem' }}>
                          <strong style={{ color: '#D97706' }}>{item.title}</strong>
                          <div style={{ color: '#451A03' }}>{item.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions line */}
                {m.sender === 'ai' && (
                  <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', paddingLeft: '4px' }}>
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      {copiedId === m.id ? <Check size={12} color="#00A878" /> : <Copy size={12} />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={14} color="#00A878" /> Analyzing Sharjah EPAA telemetry data...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{ padding: '12px 16px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Ask ChatAI about networks, work orders, telemetry..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, height: '40px', fontSize: '0.82rem' }}
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-epa"
              style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
