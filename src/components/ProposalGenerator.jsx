import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles } from 'lucide-react';

export default function ProposalGenerator() {
  const [clientName, setClientName] = useState('Sharjah Environment Protected Authority (SEPA)');
  const [projectTitle, setProjectTitle] = useState('Environmental Monitoring Systems Maintenance & Analytics Platform');
  const [domain, setDomain] = useState('IoT Environmental Telemetry');
  const [estimatedDuration, setEstimatedDuration] = useState('8 Weeks');
  const [budgetRange, setBudgetRange] = useState('$120,000 - $150,000');
  
  const [selectedTechs, setSelectedTechs] = useState([
    'React 19 Core Engine',
    'Vite 6 Fast Bundler',
    'Lucide Dynamic SVG Icons',
    'Recharts Interactive Visualizer',
    'Custom Glassmorphism CSS System',
    'REST & WebSocket Live Data Feeds'
  ]);

  const [copied, setCopied] = useState(false);

  const availableTechs = [
    'React 19 Core Engine',
    'Vite 6 Fast Bundler',
    'Lucide Dynamic SVG Icons',
    'Recharts Interactive Visualizer',
    'Custom Glassmorphism CSS System',
    'REST & WebSocket Live Data Feeds',
    'TailwindCSS V3 Integration',
    'Zustand State Management',
    'Mapbox GL / Leaflet GIS Integration',
    'WCAG 2.1 AA Accessibility Package'
  ];

  const toggleTech = (tech) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter(t => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const generateProposalText = () => {
    return `# BUSINESS DEVELOPMENT TECHNICAL PROPOSAL
--------------------------------------------------
CLIENT: ${clientName}
PROJECT: ${projectTitle}
DOMAIN: ${domain}
ESTIMATED TIMELINE: ${estimatedDuration}
TARGET BUDGET RANGE: ${budgetRange}

1. EXECUTIVE SUMMARY
-------------------
We propose a high-performance, responsive React-based frontend web platform tailored for ${clientName}. 
The solution leverages modern state-of-the-art UI aesthetics (glassmorphism, vibrant accessibility-focused dark themes, and dynamic micro-animations) to deliver real-time operational oversight and analytics.

2. FRONTEND ARCHITECTURE & TECH STACK
-------------------------------------
The requested application is engineered with the following enterprise stack:
${selectedTechs.map(t => `  - ${t}`).join('\n')}

3. CORE DELIVERABLE MILESTONES
------------------------------
- Milestone 1: UI/UX Wireframing & Glassmorphic Design System (Week 1 - 2)
- Milestone 2: Core React Architecture Setup & Component Library (Week 3 - 4)
- Milestone 3: Real-Time Data Visualization & Interactive Dashboards (Week 5 - 6)
- Milestone 4: Integration, QA Testing, Accessibility & Deployment (Week 7 - 8)

4. KEY QUALITY ASSURANCES
-------------------------
- Zero Security Vulnerability Standards
- Sub-second First Contentful Paint (FCP)
- Mobile & Desktop Cross-browser Fluid Responsiveness
- High Reusability Component Structure
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateProposalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px' }}>
      
      {/* Configuration Form Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-light)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Proposal Architect</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure parameters to auto-scaffold technical specifications</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>CLIENT ORGANISATION</label>
            <input 
              type="text" 
              className="input-field" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>PROJECT TITLE</label>
            <input 
              type="text" 
              className="input-field" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>INDUSTRY / DOMAIN</label>
            <input 
              type="text" 
              className="input-field" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>TIMELINE</label>
              <input 
                type="text" 
                className="input-field" 
                value={estimatedDuration} 
                onChange={(e) => setEstimatedDuration(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>ESTIMATED BUDGET</label>
              <input 
                type="text" 
                className="input-field" 
                value={budgetRange} 
                onChange={(e) => setBudgetRange(e.target.value)} 
              />
            </div>
          </div>

          {/* Tech Stack Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
              RECOMMENDED TECH STACK MODULES
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTechs.map((tech) => {
                const isSelected = selectedTechs.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: isSelected ? '1px solid var(--primary-light)' : '1px solid var(--border-light)',
                      background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{tech}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Generated Document</h3>
          </div>

          <button 
            onClick={handleCopy} 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Document'}
          </button>
        </div>

        <div style={{
          flex: 1,
          background: 'rgba(9, 13, 22, 0.8)',
          border: '1px solid var(--border-light)',
          borderRadius: '10px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          maxHeight: '480px',
          lineHeight: '1.5'
        }}>
          {generateProposalText()}
        </div>
      </div>

    </div>
  );
}
