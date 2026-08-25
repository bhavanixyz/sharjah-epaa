import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Database, Bell, Server } from 'lucide-react';

export default function SystemSettings() {
  const [telemetryPoll, setTelemetryPoll] = useState('60');
  const [slaWarning, setSlaWarning] = useState('4');
  const [isoAuditMode, setIsoAuditMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('System Configuration settings updated successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Telemetry Polling */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="#00A878" /> Telemetry Stream & Polling Configuration
          </h3>
          <div className="card-grid-2">
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                TELEMETRY POLLING FREQUENCY (SECONDS)
              </label>
              <select value={telemetryPoll} onChange={(e) => setTelemetryPoll(e.target.value)} className="input-field">
                <option value="15">15 Seconds (High Density)</option>
                <option value="30">30 Seconds</option>
                <option value="60">60 Seconds (Standard EPA Baseline)</option>
                <option value="300">5 Minutes</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                WORK ORDER SLA ESCALATION THRESHOLD (HOURS)
              </label>
              <select value={slaWarning} onChange={(e) => setSlaWarning(e.target.value)} className="input-field">
                <option value="2">2 Hours (Strict)</option>
                <option value="4">4 Hours (Default SLA)</option>
                <option value="8">8 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Audit Protocol */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#0891B2" /> Compliance & Cryptographic Audit Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" checked={isoAuditMode} onChange={(e) => setIsoAuditMode(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#00A878' }} />
              Enforce ISO 17025 Laboratory Cryptographic Log Signing for all Gas Calibrations
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#00A878' }} />
              Enable Daily Automated Cloud Database Backup & Disaster Recovery (02:00 GST)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-epa" style={{ padding: '10px 24px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={16} /> Save Configuration Changes
          </button>
        </div>

      </form>

    </div>
  );
}
