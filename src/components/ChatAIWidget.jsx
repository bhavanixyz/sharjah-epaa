import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Maximize2, Minimize2, Copy, Trash2, Sparkles, 
  Check, ArrowRight, MapPin, Radio, Cpu, Wrench, Target, 
  Boxes, ShoppingBag, FileCheck, ExternalLink, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Marhaba! I am your Sharjah EPAA Intelligence Assistant. I can help you analyze telemetry streams, SLA compliance, equipment drift, work orders, and network health across Sharjah Emirates.',
      type: 'text'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const { 
    navigateToTarget,
    networks,
    sites,
    stations,
    assets,
    workOrders,
    calibrations,
    inventory,
    procurement,
    contracts,
    users
  } = useApp();

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

  const handleNavigate = (targetModule, targetTab, searchTerm = '', item = null) => {
    if (navigateToTarget) {
      navigateToTarget(targetModule, targetTab, searchTerm, item);
    }
    setIsOpen(false);
  };

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
    }, 800);
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Environmental Networks & Health
    if (q.includes('network') || q.includes('lowest operational health') || q.includes('experiencing issues') || q.includes('health')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Here is the operational health breakdown for Sharjah environmental networks:',
        type: 'card_table',
        data: [
          { 
            network: 'Marine Water Quality Network', 
            status: 'Degraded (84% Health)', 
            issue: 'Sensor Drift on Buoy-02 • Action Required', 
            module: 'networks', 
            tab: 'Environmental Networks', 
            search: 'Marine Water Quality Network' 
          },
          { 
            network: 'Groundwater Hydrology Stream', 
            status: 'Maintenance (91% Health)', 
            issue: 'Well Pressure Calibration in Progress', 
            module: 'networks', 
            tab: 'Environmental Networks', 
            search: 'Groundwater Hydrology Stream' 
          },
          { 
            network: 'Air Quality Ambient Network', 
            status: 'Optimal (98.4% Health)', 
            issue: 'All 4 Monitoring Stations Active', 
            module: 'networks', 
            tab: 'Environmental Networks', 
            search: 'Air Quality Ambient Network' 
          },
          { 
            network: 'Soil Quality Assessment System', 
            status: 'Optimal (99.1% Health)', 
            issue: 'Routine Telemetry Active', 
            module: 'networks', 
            tab: 'Environmental Networks', 
            search: 'Soil Quality Assessment System' 
          }
        ]
      };
    }

    // 2. Work Orders, SLA & Maintenance
    if (q.includes('work order') || q.includes('sla') || q.includes('highest number') || q.includes('ticket') || q.includes('exceeded')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Work Orders & SLA Velocity analysis across Sharjah EPA sites:',
        type: 'kpi_summary',
        kpis: [
          { 
            title: 'CRITICAL OPEN WOs', 
            val: '3 Tickets', 
            color: '#DC2626',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: 'CRITICAL'
          },
          { 
            title: 'SLA OVERDUE', 
            val: '2 Tickets', 
            color: '#D97706',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: 'OVERDUE'
          },
          { 
            title: 'SLA COMPLIANCE RATE', 
            val: '96.2%', 
            color: '#00A878',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: ''
          }
        ],
        data: [
          {
            network: 'WO-2026-8901: Emergency Sensor Drift Reset',
            status: 'CRITICAL • Overdue 24h',
            issue: 'Sharjah Industrial Area 3 • Assigned: Eng. Tariq Mansoor',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: 'WO-2026-8901'
          },
          {
            network: 'WO-2026-8904: Telemetry Logger Modem Reset',
            status: 'HIGH • In Progress',
            issue: 'Khorfakkan Harbor Station • Assigned: Teledyne Service Tech',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: 'WO-2026-8904'
          },
          {
            network: 'WO-2026-8908: Gas Flow Cell Replacement',
            status: 'HIGH • Pending Parts',
            issue: 'Wasit Wetland Reserve • Assigned: Horiba Field Lead',
            module: 'maintenance',
            tab: 'Work Orders & SLA',
            search: 'WO-2026-8908'
          }
        ]
      };
    }

    // 3. Calibrations & Sensor Drift
    if (q.includes('calibration') || q.includes('overdue maintenance') || q.includes('drift') || q.includes('30 days')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Identified telemetry sensors requiring immediate gas calibration & drift verification:',
        type: 'list_items',
        items: [
          { 
            title: 'Teledyne T100 SO2 Analyzer (Khorfakkan)', 
            detail: 'Overdue by 4 days • Zero drift exceeded +2.1% tolerance', 
            module: 'calibration',
            tab: 'Drift & Gas Calibration',
            search: 'Teledyne'
          },
          { 
            title: 'Horiba APNA-370 NOx Analyzer (Wasit)', 
            detail: 'Due in 2 days • Span gas bottle verification required', 
            module: 'calibration',
            tab: 'Drift & Gas Calibration',
            search: 'Horiba'
          },
          { 
            title: 'YSI Exo2 Multiparameter Sonde (Kalba Buoy)', 
            detail: 'Calibration Due 28 Aug 2026 • Turbidity sensor check', 
            module: 'calibration',
            tab: 'Drift & Gas Calibration',
            search: 'YSI Exo2'
          }
        ]
      };
    }

    // 4. Inventory, Spare Parts & Procurement
    if (q.includes('spare parts') || q.includes('stock') || q.includes('inventory') || q.includes('reorder')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Spare parts currently below safety reorder threshold in central inventory:',
        type: 'card_table',
        data: [
          { 
            network: 'PTFE 47mm Membrane Filters (Pack 100)', 
            status: '8 Units Left (Min: 10)', 
            issue: 'Requisition Required • SKU: FLT-PTFE-47', 
            module: 'inventory', 
            tab: 'Inventory & Spare Parts', 
            search: 'PTFE' 
          },
          { 
            network: 'Sampling Pump Diaphragms', 
            status: '4 Units Left (Min: 5)', 
            issue: 'Restock Pending • SKU: PMP-DIA-02', 
            module: 'inventory', 
            tab: 'Inventory & Spare Parts', 
            search: 'Pump' 
          },
          { 
            network: 'SO2 Zero Air Scrubber Media', 
            status: '3 Kits Left (Min: 5)', 
            issue: 'Low Stock • SKU: SCR-SO2-01', 
            module: 'inventory', 
            tab: 'Inventory & Spare Parts', 
            search: 'Scrubber' 
          }
        ]
      };
    }

    // 5. Sites & Equipment Search
    if (q.includes('site') || q.includes('station') || q.includes('degraded equipment') || q.includes('khorfakkan') || q.includes('wasit')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Matching monitoring sites and station facilities across Sharjah EPA:',
        type: 'card_table',
        data: [
          { 
            network: 'Wasit Wetland Biodiversity Station', 
            status: 'Active • Air & Water', 
            issue: 'Code: EPA-AQ-ST01 • Zone: Central Reserve', 
            module: 'sites', 
            tab: 'Site Management', 
            search: 'Wasit' 
          },
          { 
            network: 'Khorfakkan Coastal Observatory', 
            status: 'Active • Marine Telemetry', 
            issue: 'Code: EPA-MAR-ST02 • Zone: Eastern Coast', 
            module: 'sites', 
            tab: 'Site Management', 
            search: 'Khorfakkan' 
          },
          { 
            network: 'Sharjah Industrial Area 3 Station', 
            status: 'Warning • Degraded Sensor', 
            issue: 'Code: EPA-AQ-ST03 • Zone: Industrial Sector', 
            module: 'sites', 
            tab: 'Site Management', 
            search: 'Industrial Area 3' 
          }
        ]
      };
    }

    // 6. Dynamic Dataset Match Fallback
    const matchSites = (sites || []).filter(s => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q)).slice(0, 2);
    const matchWO = (workOrders || []).filter(w => w.title?.toLowerCase().includes(q) || w.id?.toLowerCase().includes(q)).slice(0, 2);
    const matchAssets = (assets || []).filter(a => a.name?.toLowerCase().includes(q) || a.serialNo?.toLowerCase().includes(q)).slice(0, 2);
    const matchCal = (calibrations || []).filter(c => c.certificateNo?.toLowerCase().includes(q) || c.assetName?.toLowerCase().includes(q)).slice(0, 2);

    const dynamicResults = [
      ...matchSites.map(s => ({ network: s.name, status: `Code: ${s.code}`, issue: `Zone: ${s.zone}`, module: 'sites', tab: 'Site Management', search: s.name })),
      ...matchWO.map(w => ({ network: `${w.id}: ${w.title}`, status: `Status: ${w.status}`, issue: `Site: ${w.siteName}`, module: 'maintenance', tab: 'Work Orders & SLA', search: w.id })),
      ...matchAssets.map(a => ({ network: a.name, status: `Serial: ${a.serialNo}`, issue: `Site: ${a.siteName}`, module: 'assets', tab: 'Asset Catalog & Equipment', search: a.name })),
      ...matchCal.map(c => ({ network: `${c.certificateNo}: ${c.assetName}`, status: `Result: ${c.result}`, issue: `Site: ${c.siteName}`, module: 'calibration', tab: 'Drift & Gas Calibration', search: c.certificateNo }))
    ];

    if (dynamicResults.length > 0) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Found ${dynamicResults.length} telemetry records matching "${query}":`,
        type: 'card_table',
        data: dynamicResults
      };
    }

    // Default EPA Information response with quick shortcut links
    return {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Regarding your query on "${query}":\n\nAll 8 environmental telemetry monitoring sites across Sharjah Emirates are actively monitored in real time with 98.4% total network uptime. You can jump directly to operational modules below:`,
      type: 'list_items',
      items: [
        { title: 'Open Site Management Directory', detail: 'View status, GPS locations, and active sensors for all Sharjah sites', module: 'sites', tab: 'Site Management', search: '' },
        { title: 'Open Work Orders & SLA Tracker', detail: 'Inspect critical tickets, maintenance schedules, and SLA compliance', module: 'maintenance', tab: 'Work Orders & SLA', search: '' },
        { title: 'Open Gas & Drift Calibration Logs', detail: 'Review ISO 17025 certificates, span gas checks, and sensor drift logs', module: 'calibration', tab: 'Drift & Gas Calibration', search: '' }
      ]
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

  const handleClose = () => {
    handleClear();
    setIsOpen(false);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Sharjah EPAA ChatAI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00A878 0%, #0F172A 100%)',
            color: '#FFFFFF',
            border: '2px solid rgba(0, 168, 120, 0.5)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35), 0 0 16px rgba(0, 168, 120, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease'
          }}
        >
          <Bot size={26} />
        </button>
      )}

      {/* Main Chat Drawer (Right Side Panel when Expanded, Floating Window when Normal) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isExpanded ? '0' : '24px',
            right: '0',
            top: isExpanded ? '0' : 'auto',
            left: 'auto',
            width: isExpanded ? '540px' : '440px',
            height: isExpanded ? '100vh' : '620px',
            maxWidth: '100vw',
            maxHeight: isExpanded ? '100vh' : '88vh',
            zIndex: 99999,
            background: '#FFFFFF',
            borderRadius: isExpanded ? '0' : '20px 0 0 20px',
            boxShadow: isExpanded ? '-10px 0 40px rgba(15, 23, 42, 0.25)' : '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
            borderLeft: '1px solid #CBD5E1',
            borderTop: isExpanded ? 'none' : '1px solid #CBD5E1',
            borderBottom: isExpanded ? 'none' : '1px solid #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Short Title & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{ padding: '7px', background: 'rgba(0,168,120,0.25)', borderRadius: '9px', color: '#34D399', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={19} />
              </div>
              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                  EPAA AI
                </h3>
                <span style={{ fontSize: '0.70rem', color: '#34D399', fontWeight: 600, display: 'block', marginTop: '1px' }}>
                  ● Telemetry Engine
                </span>
              </div>
            </div>

            {/* Controls Header Options (Icon-Only: Clear, Expand/Collapse, Close) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
              
              {/* 1. Clear Chat Icon Button */}
              <button 
                onClick={handleClear} 
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#F8FAFC', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }} 
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>

              {/* 2. Expand / Collapse Icon Button */}
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#F8FAFC', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                title={isExpanded ? "Collapse to Window" : "Expand to Right Panel"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* 3. Close Icon Button (Closes & Clears All Chat) */}
              <button 
                onClick={handleClose} 
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#F8FAFC', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                title="Close & Clear All Chat"
              >
                <X size={18} />
              </button>

            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Suggested Prompts Pill Container */}
            {messages.length <= 2 && (
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#00A878" /> SUGGESTED OPERATIONAL PROMPTS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {predefinedPrompts.slice(0, 6).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      style={{
                        padding: '6px 11px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        background: '#F1F5F9',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      className="prompt-pill-btn"
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
                  maxWidth: '92%',
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
                    fontSize: '0.85rem',
                    lineHeight: 1.5
                  }}
                >
                  <p style={{ margin: 0, fontWeight: m.sender === 'user' ? 600 : 400 }}>{m.text}</p>

                  {/* Render Interactive Table Response */}
                  {m.type === 'card_table' && m.data && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {m.data.map((row, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleNavigate(row.module, row.tab, row.search, row.item)}
                          style={{ 
                            background: '#F8FAFC', 
                            border: '1px solid #E2E8F0',
                            padding: '10px 12px', 
                            borderRadius: '10px', 
                            cursor: 'pointer',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.18s ease'
                          }}
                          className="chat-interactive-card"
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {row.network}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#00A878', fontWeight: 700, marginTop: '2px' }}>
                              {row.status}
                            </div>
                            <div style={{ fontSize: '0.71rem', color: '#64748B', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {row.issue}
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(row.module, row.tab, row.search, row.item);
                            }} 
                            className="btn btn-epa" 
                            style={{ padding: '6px 12px', fontSize: '0.72rem', height: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span>View</span> <ChevronRight size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Interactive KPI Summary */}
                  {m.type === 'kpi_summary' && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {m.kpis && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {m.kpis.map((kpi, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => handleNavigate(kpi.module, kpi.tab, kpi.search)}
                              style={{ 
                                background: '#F8FAFC', 
                                border: '1px solid #E2E8F0',
                                padding: '10px 8px', 
                                borderRadius: '10px', 
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              className="chat-kpi-pill"
                            >
                              <div style={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800, letterSpacing: '0.3px' }}>{kpi.title}</div>
                              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: kpi.color, marginTop: '2px' }}>{kpi.val}</div>
                              <div style={{ fontSize: '0.62rem', color: '#00A878', fontWeight: 700, marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                View <ChevronRight size={10} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Work Order Cards underneath KPI summary */}
                      {m.data && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                          {m.data.map((row, idx) => (
                            <div 
                              key={idx}
                              onClick={() => handleNavigate(row.module, row.tab, row.search)}
                              style={{ 
                                background: '#F8FAFC', 
                                border: '1px solid #E2E8F0',
                                padding: '10px 12px', 
                                borderRadius: '10px', 
                                cursor: 'pointer',
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.18s ease'
                              }}
                              className="chat-interactive-card"
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {row.network}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, marginTop: '2px' }}>
                                  {row.status}
                                </div>
                                <div style={{ fontSize: '0.71rem', color: '#64748B', marginTop: '2px' }}>
                                  {row.issue}
                                </div>
                              </div>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavigate(row.module, row.tab, row.search);
                                }} 
                                className="btn btn-epa" 
                                style={{ padding: '6px 12px', fontSize: '0.72rem', height: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <span>View</span> <ChevronRight size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Interactive List Items */}
                  {m.type === 'list_items' && m.items && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {m.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleNavigate(item.module, item.tab, item.search)}
                          style={{ 
                            background: '#FFFBEB', 
                            border: '1px solid #FDE68A', 
                            padding: '10px 12px', 
                            borderRadius: '10px', 
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.18s ease'
                          }}
                          className="chat-list-card"
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ color: '#D97706', display: 'block', fontSize: '0.82rem' }}>{item.title}</strong>
                            <div style={{ color: '#451A03', fontSize: '0.73rem', marginTop: '2px' }}>{item.detail}</div>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(item.module, item.tab, item.search);
                            }}
                            className="btn btn-epa"
                            style={{ padding: '6px 12px', fontSize: '0.72rem', height: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' }}
                          >
                            <span>Inspect</span> <ChevronRight size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions line */}
                {m.sender === 'ai' && (
                  <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', paddingLeft: '4px', marginTop: '2px' }}>
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
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
              style={{ flex: 1, height: '42px', fontSize: '0.84rem', borderRadius: '10px' }}
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-epa"
              style={{ width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', flexShrink: 0 }}
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}

      <style>{`
        .chat-interactive-card:hover {
          background: #F0FDF4 !important;
          border-color: #00A878 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 168, 120, 0.12);
        }
        .chat-kpi-pill:hover {
          background: #F0FDF4 !important;
          border-color: #00A878 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 168, 120, 0.15);
        }
        .chat-list-card:hover {
          background: #FEF3C7 !important;
          border-color: #F59E0B !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
        }
        .prompt-pill-btn:hover {
          background: #E2E8F0 !important;
          border-color: #00A878 !important;
          color: #00A878 !important;
        }
      `}</style>
    </>
  );
}
