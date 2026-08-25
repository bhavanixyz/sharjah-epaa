import React, { useEffect, useState } from 'react';
import loadingLogo from '../assets/loading-logo.png';

export default function AppPreloader({ isLoading, onComplete, onLoaded }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onComplete) onComplete();
        if (onLoaded) onLoaded();
      }, 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading && fade) return null;

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
            width: '520px',
            maxWidth: '92vw',
            padding: '28px 40px',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            animation: 'pulseGlow 2s infinite ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={loadingLogo} alt="Sharjah EPAA Government Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
