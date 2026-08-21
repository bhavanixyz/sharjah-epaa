import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Cpu, Wrench, X } from 'lucide-react';

// Custom Marker Icons for Leaflet (Light Theme)
const createCustomIcon = (status) => {
  let color = '#00A878'; // normal green
  if (status === 'Warning') color = '#F59E0B';
  if (status === 'Critical') color = '#EF4444';

  return L.divIcon({
    className: 'custom-gis-pin',
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function GisMap() {
  const { sites, selectedSite, setSelectedSite, setActiveModule, setIsWoModalOpen } = useApp();
  const [filterNetwork, setFilterNetwork] = useState('ALL');

  const filteredSites = filterNetwork === 'ALL' 
    ? sites 
    : sites.filter(s => s.networkId === filterNetwork);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: 'calc(100vh - 110px)' }}>
      
      {/* GIS Header & Layer Filter Bar */}
      <div className="glass-panel page-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0, 168, 120, 0.1) 0%, rgba(13, 186, 139, 0.2) 100%)', color: '#00A878', flexShrink: 0 }}>
            <MapPin size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Sharjah EPA Spatial GIS Command Platform</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Real-time telemetry monitoring across 8 protected sanctuaries & urban monitoring stations</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="page-header-actions">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'rgba(248, 250, 252, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(226, 232, 240, 0.8)', maxWidth: '100%' }}>
            {[
              { id: 'ALL', label: 'All Stations' },
              { id: 'net-aqmn', label: 'Air Quality' },
              { id: 'net-mcwmn', label: 'Marine Water' },
              { id: 'net-gapn', label: 'Groundwater' },
              { id: 'net-icmn', label: 'Industrial' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterNetwork(f.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterNetwork === f.id ? '#00A878' : 'transparent',
                  color: filterNetwork === f.id ? '#FFFFFF' : '#475569'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Detail Sidebar Area */}
      <div className={selectedSite ? 'gis-map-grid' : ''} style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedSite ? undefined : '1fr', gap: '18px', position: 'relative' }}>
        
        {/* Leaflet GIS Map Container */}
        <div className="glass-panel" style={{ overflow: 'hidden', position: 'relative' }}>
          <MapContainer 
            center={[25.25, 55.70]} 
            zoom={9} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> Voyager'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {filteredSites.map((site) => (
              <Marker
                key={site.id}
                position={[site.lat, site.lng]}
                icon={createCustomIcon(site.status)}
                eventHandlers={{
                  click: () => setSelectedSite(site)
                }}
              >
                <Popup>
                  <div style={{ padding: '6px', width: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>{site.name}</span>
                      <span className={`badge badge-${site.status.toLowerCase()}`} style={{ fontSize: '0.6rem' }}>{site.status}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '10px' }}>
                      {site.zone} • {site.code}
                    </div>
                    <button 
                      onClick={() => setSelectedSite(site)}
                      className="btn btn-epa"
                      style={{ width: '100%', padding: '5px 10px', fontSize: '0.74rem' }}
                    >
                      View Station Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
