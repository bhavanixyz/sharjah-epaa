import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MapView from './common/MapView';
import { MapPin, Cpu, Wrench, X } from 'lucide-react';

export default function GisMap() {
  const { sites, selectedSite, setSelectedSite, setActiveModule, setIsWoModalOpen } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: 'calc(100vh - 160px)', width: '100%' }}>
      
      {/* Main Interactive Map & Detail Sidebar Area */}
      <div className={selectedSite ? 'gis-map-grid' : ''} style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedSite ? undefined : '1fr', gap: '18px', position: 'relative', height: '100%' }}>
        
        {/* Leaflet GIS Map Container with Integrated Controls */}
        <div style={{ overflow: 'hidden', position: 'relative', flex: 1, height: '100%', minHeight: '580px', borderRadius: '16px' }}>
          <MapView height="100%" onSelectSite={(loc) => setSelectedSite(loc)} />
        </div>

        {/* Selected Station Inspector Drawer */}
        {selectedSite && (
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'rgba(255, 255, 255, 0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span className={`badge badge-${selectedSite.status.toLowerCase()}`}>{selectedSite.status} Status</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>{selectedSite.name}</h3>
                <p style={{ fontSize: '0.76rem', color: '#64748B' }}>{selectedSite.zone} • {selectedSite.code}</p>
              </div>
              <button 
                onClick={() => setSelectedSite(null)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Live Telemetry Box */}
            <div style={{ background: 'rgba(248, 250, 252, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '10px', padding: '14px 16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: '10px', letterSpacing: '0.04em' }}>LIVE TELEMETRY READINGS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                {selectedSite.aqi && <div><span style={{ color: '#64748B' }}>AQI:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.aqi}</strong></div>}
                {selectedSite.pm25 && <div><span style={{ color: '#64748B' }}>PM2.5:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.pm25}</strong></div>}
                {selectedSite.salinity && <div><span style={{ color: '#64748B' }}>Salinity:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.salinity}</strong></div>}
                {selectedSite.ph && <div><span style={{ color: '#64748B' }}>pH Level:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.ph}</strong></div>}
                {selectedSite.temp && <div><span style={{ color: '#64748B' }}>Temp:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.temp}</strong></div>}
                {selectedSite.humidity && <div><span style={{ color: '#64748B' }}>Humidity:</span> <strong style={{ color: '#0F172A' }}>{selectedSite.humidity}</strong></div>}
              </div>
            </div>

            {/* Station Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#334155', flex: 1 }}>
              <div><strong style={{ color: '#0F172A' }}>Assigned Engineer:</strong> {selectedSite.assignedEngineer}</div>
              <div><strong style={{ color: '#0F172A' }}>Last Maintenance:</strong> {selectedSite.lastMaintenance}</div>
              <div><strong style={{ color: '#0F172A' }}>Installed Equipment:</strong> {selectedSite.assetsCount} Analyzers</div>
              <div><strong style={{ color: '#0F172A' }}>Open Maintenance Tickets:</strong> {selectedSite.openTickets}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
              <button 
                onClick={() => setActiveModule('assets')}
                className="btn btn-epa" 
                style={{ width: '100%', fontSize: '0.82rem' }}
              >
                <Cpu size={14} /> View Station Assets
              </button>

              <button 
                onClick={() => setIsWoModalOpen(true)}
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: '0.82rem' }}
              >
                <Wrench size={14} /> Create Work Order
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
