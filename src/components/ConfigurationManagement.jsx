import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save } from 'lucide-react';

export default function ConfigurationManagement() {
  const { config, setConfig } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button onClick={handleSave} className="btn btn-epa">
          <Save size={16} /> {saved ? 'Saved Successfully!' : 'Save System Configuration'}
        </button>
      </div>

      <div className="grid-2-responsive">
        
        {/* Core Parameters */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#1F2937' }}>Telemetry & SLA Thresholds</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>TELEMETRY POLLING INTERVAL (MINUTES)</label>
              <input 
                type="number" 
                className="input-field" 
                value={config.telemetryIntervalMinutes} 
                onChange={(e) => setConfig({ ...config, telemetryIntervalMinutes: parseInt(e.target.value) || 5 })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CRITICAL SLA RESOLUTION TIMEOUT (HOURS)</label>
              <input 
                type="number" 
                className="input-field" 
                value={config.defaultSlaHoursCritical} 
                onChange={(e) => setConfig({ ...config, defaultSlaHoursCritical: parseInt(e.target.value) || 24 })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>HIGH SLA RESOLUTION TIMEOUT (HOURS)</label>
              <input 
                type="number" 
                className="input-field" 
                value={config.defaultSlaHoursHigh} 
                onChange={(e) => setConfig({ ...config, defaultSlaHoursHigh: parseInt(e.target.value) || 48 })}
              />
            </div>
          </div>
        </div>

        {/* Future Domain Modular Configuration */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#1F2937' }}>Environmental Domain Modules</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.futureDomains.map((dom) => (
              <div 
                key={dom.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1F2937' }}>{dom.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{dom.status}</div>
                </div>
                <span className={`badge ${dom.status.includes('Active') ? 'badge-normal' : 'badge-info'}`}>
                  {dom.status.includes('Active') ? 'Enabled' : 'Configurable'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
