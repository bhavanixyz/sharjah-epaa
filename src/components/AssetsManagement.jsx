import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, QrCode, Wrench } from 'lucide-react';

export default function AssetsManagement() {
  const { assets, setIsWoModalOpen } = useApp();
  const [searchAsset, setSearchAsset] = useState('');

  const filteredAssets = assets.filter(a => {
    return a.name.toLowerCase().includes(searchAsset.toLowerCase()) || 
           a.serialNo.toLowerCase().includes(searchAsset.toLowerCase()) ||
           a.siteName.toLowerCase().includes(searchAsset.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Controls */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>EPA Equipment & Asset Master Catalog</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Managed environmental analyzers, gas sensors, data loggers & marine probes</p>
        </div>

        <div className="page-header-actions">
          <div className="page-header-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search serial, name..." 
              value={searchAsset} 
              onChange={(e) => setSearchAsset(e.target.value)} 
              style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#F8FAFC' }}
            />
          </div>

          <button onClick={() => setIsWoModalOpen(true)} className="btn btn-epa">
            <Wrench size={16} /> Maintenance Request
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="card-grid-responsive">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-blue">{asset.category}</span>
                <span className={`badge badge-${asset.status.toLowerCase().replace(' ', '-')}`}>{asset.status}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{asset.name}</h3>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '12px', fontFamily: 'monospace' }}>
                Serial: <span style={{ color: '#00A878', fontWeight: 700 }}>{asset.serialNo}</span>
              </div>

              {/* Station Location */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.78rem' }}>
                <span style={{ color: '#6B7280' }}>Location: </span>
                <strong style={{ color: '#1F2937' }}>{asset.siteName}</strong>
              </div>

              {/* Specs & Health */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', color: '#6B7280', marginBottom: '14px' }}>
                <div>Manufacturer: <strong style={{ color: '#1F2937' }}>{asset.manufacturer}</strong></div>
                <div>Health Score: <strong style={{ color: asset.healthScore > 80 ? '#00A878' : '#DC2626' }}>{asset.healthScore}%</strong></div>
                <div>Last Calibrated: <strong style={{ color: '#1F2937' }}>{asset.lastCalibrated}</strong></div>
                <div>Next Due: <strong style={{ color: asset.nextCalibration.includes('OVERDUE') ? '#DC2626' : '#1F2937' }}>{asset.nextCalibration}</strong></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#6B7280' }}>
                <QrCode size={14} color="#0891B2" /> QR Tagged
              </div>
              <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{asset.warrantyStatus}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
