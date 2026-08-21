import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Zap, Wifi, Wrench } from 'lucide-react';

export default function StationsManagement() {
  const { stations, setIsWoModalOpen } = useApp();
  const [searchStn, setSearchStn] = useState('');

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchStn.toLowerCase()) ||
    s.code.toLowerCase().includes(searchStn.toLowerCase()) ||
    s.siteName.toLowerCase().includes(searchStn.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Controls */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Environmental Stations Management</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Physical station enclosures, power supply systems, telemetry links & field loggers</p>
        </div>

        <div className="page-header-actions">
          <div className="page-header-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search station, code, site..." 
              value={searchStn}
              onChange={(e) => setSearchStn(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#F8FAFC' }}
            />
          </div>

          <button className="btn btn-epa">
            <Plus size={16} /> Add Monitoring Station
          </button>
        </div>
      </div>

      {/* Stations Table */}
      <div className="glass-panel table-responsive">
        <table className="epa-table">
          <thead>
            <tr>
              <th>Station Code</th>
              <th>Station Name & Type</th>
              <th>Parent Site</th>
              <th>Power Supply</th>
              <th>Telemetry Link</th>
              <th>Engineer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.map((stn) => (
              <tr key={stn.id}>
                <td style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                  {stn.code}
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#1F2937' }}>{stn.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>{stn.type}</div>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                  {stn.siteName}
                </td>
                <td style={{ fontSize: '0.8rem', color: '#1F2937' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#D97706" /> {stn.powerSource}
                  </div>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#1F2937' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wifi size={14} color="#2563EB" /> {stn.telemetry}
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                  {stn.assignedEngineer}
                </td>
                <td>
                  <span className={`badge badge-${stn.status.toLowerCase().replace(' ', '-')}`}>{stn.status}</span>
                </td>
                <td>
                  <button 
                    onClick={() => setIsWoModalOpen(true)}
                    className="btn btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                  >
                    <Wrench size={12} /> Dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
