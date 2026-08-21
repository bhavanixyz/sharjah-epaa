import React from 'react';
import { Layers, Sparkles, Code, FileText, LayoutDashboard, Cpu, CheckCircle2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'proposals', label: 'Proposal Architect', icon: FileText },
    { id: 'architecture', label: 'Tech Architecture', icon: Cpu },
    { id: 'components', label: 'Feature System', icon: Layers },
  ];

  return (
    <header className="glass-nav">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            color: '#fff'
          }}>
            <Code size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">NexusBD Studio</h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={10} /> React 19 Engine
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Proposal & Frontend Architecture Suite</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none'
                }}
              >
                <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* System Status Pill & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: 'var(--accent-emerald)',
            fontWeight: 600
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
            Vite 6 Dev Ready
          </div>
          
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <CheckCircle2 size={15} /> Active Workspace
          </button>
        </div>

      </div>
    </header>
  );
}
