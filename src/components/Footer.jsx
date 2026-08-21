import React from 'react';
import { Shield, Terminal, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-light)',
      background: 'rgba(9, 13, 22, 0.9)',
      padding: '24px 0',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            © 2026 NexusBD Enterprise Platform • React 19 Frontend Architecture
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} color="var(--accent-cyan)" /> Vite 6 Engine
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--accent-emerald)" /> WCAG 2.1 AA
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} color="var(--primary-light)" /> Global Edge CDN
          </span>
        </div>
      </div>
    </footer>
  );
}
