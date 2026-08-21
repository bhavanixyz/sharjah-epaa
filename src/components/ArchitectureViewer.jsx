import React, { useState } from 'react';
import { Folder, FileCode, CheckCircle, Shield, Zap, Box, Terminal } from 'lucide-react';

export default function ArchitectureViewer() {
  const [selectedNode, setSelectedNode] = useState('src/App.jsx');

  const fileTree = [
    { name: 'src/main.jsx', type: 'entry', desc: 'React 19 Root Render Engine & StrictMode container' },
    { name: 'src/App.jsx', type: 'container', desc: 'Main Layout shell with state routing & active tab switcher' },
    { name: 'src/index.css', type: 'styles', desc: 'Core Design System tokens, Glassmorphic classes & CSS Variables' },
    { name: 'src/components/Header.jsx', type: 'component', desc: 'Glassmorphic Top Navigation & System Status Bar' },
    { name: 'src/components/MetricsOverview.jsx', type: 'component', desc: 'Recharts analytics visualizer & KPI status cards' },
    { name: 'src/components/ProposalGenerator.jsx', type: 'component', desc: 'BD technical proposal configurator & markdown exporter' },
    { name: 'src/components/ArchitectureViewer.jsx', type: 'component', desc: 'Interactive visualizer of folder structure & tech specs' },
    { name: 'src/components/FeatureShowcase.jsx', type: 'component', desc: 'Modular UI component showcase & interactive demos' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Architecture Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-light)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Lightning Fast Vite 6</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hot Module Replacement under 50ms</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <Box size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Zero Dependency Bloat</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clean, modular Vanilla CSS design system</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Shield size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Production Ready</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fully typed patterns & high accessibility</p>
          </div>
        </div>
      </div>

      {/* Directory & Spec Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        
        {/* Left: Directory Tree */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Folder size={18} color="var(--primary-light)" />
            React Application Blueprint
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fileTree.map((item) => {
              const isSelected = selectedNode === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedNode(item.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                    border: isSelected ? '1px solid var(--primary-light)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileCode size={16} color={isSelected ? 'var(--primary-light)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-main)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className={`badge ${isSelected ? 'badge-blue' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                    {item.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Spec Card */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--accent-cyan)" />
            Module Inspection: <span style={{ color: 'var(--accent-cyan)' }}>{selectedNode}</span>
          </h3>

          <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '12px' }}>
              {fileTree.find(f => f.name === selectedNode)?.desc}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Framework:</strong> React 19.x (ES modules)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Styling:</strong> CSS Variables & Backdrop Filters
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architectural Compliance Check
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle size={15} /> SEO Tags & Semantic HTML5 Document Structure
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle size={15} /> Fully Responsive Layout (Mobile, Tablet, 4K Desktop)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle size={15} /> High Contrast WCAG Glassmorphism Color Palette
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
