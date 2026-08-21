import React, { useState, useEffect } from 'react';
import { Sliders, Radio, RefreshCw } from 'lucide-react';

export default function FeatureShowcase() {
  // Glassmorphism customizer state
  const [blurVal, setBlurVal] = useState(16);
  const [bgOpacity, setBgOpacity] = useState(65);
  const [borderOpacity, setBorderOpacity] = useState(12);

  // Live telemetry stream simulator state
  const [telemetry, setTelemetry] = useState({
    temp: 32.4,
    humidity: 45.2,
    activeNodes: 128,
    bandwidth: 8.4
  });

  const [streamActive, setStreamActive] = useState(true);

  useEffect(() => {
    if (!streamActive) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        temp: +(prev.temp + (Math.random() * 0.8 - 0.4)).toFixed(1),
        humidity: +(prev.humidity + (Math.random() * 1.2 - 0.6)).toFixed(1),
        activeNodes: Math.floor(125 + Math.random() * 8),
        bandwidth: +(prev.bandwidth + (Math.random() * 0.4 - 0.2)).toFixed(2)
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [streamActive]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Feature 1: Interactive Glassmorphism Lab */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <Sliders size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Glassmorphism UI Engine</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tweak backdrop filter parameters live</p>
          </div>
        </div>

        {/* Live Playground Preview Card */}
        <div 
          style={{
            background: `rgba(18, 26, 44, ${bgOpacity / 100})`,
            backdropFilter: `blur(${blurVal}px)`,
            WebkitBackdropFilter: `blur(${blurVal}px)`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Glassmorphism Preview Card</span>
            <span className="badge badge-purple">Live Render</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            This panel updates dynamically based on CSS variables and inline glass styling parameters.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Backdrop Blur: {blurVal}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={blurVal} 
              onChange={(e) => setBlurVal(+e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Background Opacity: {bgOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="95" 
              value={bgOpacity} 
              onChange={(e) => setBgOpacity(+e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Border Glow Opacity: {borderOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={borderOpacity} 
              onChange={(e) => setBorderOpacity(+e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Feature 2: Real-time Telemetry Stream Simulator */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Radio size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Telemetry Feed Simulator</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulated WebSocket real-time state updates</p>
            </div>
          </div>

          <button 
            onClick={() => setStreamActive(!streamActive)} 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={14} className={streamActive ? 'animate-pulse-slow' : ''} />
            {streamActive ? 'Pause Feed' : 'Resume Feed'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ambient Temperature</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
              {telemetry.temp} °C
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Relative Humidity</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {telemetry.humidity} %
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active IoT Nodes</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)', marginTop: '4px' }}>
              {telemetry.activeNodes}
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Network Throughput</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '4px' }}>
              {telemetry.bandwidth} MB/s
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
