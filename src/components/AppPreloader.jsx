import React, { useEffect, useState } from 'react';
import logoNew from '../assets/LOGO.new.png';

export default function AppPreloader({ onLoaded }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 500);
    }, 1200);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        opacity: fade ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: fade ? 'none' : 'all'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '180px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            animation: 'pulseGlow 2s infinite ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={logoNew} alt="Sharjah EPAA Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#F8FAFC', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px', margin: 0 }}>
            SHARJAH EPAA
          </h2>
          <p style={{ color: '#00A878', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', margin: 0 }}>
            Environmental Asset & Maintenance Management Platform
          </p>
        </div>

        {/* Minimal Spinner */}
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(0, 168, 120, 0.2)',
            borderTopColor: '#00A878',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginTop: '10px'
          }}
        />
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0,168,120,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 35px rgba(0,168,120,0.6); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
