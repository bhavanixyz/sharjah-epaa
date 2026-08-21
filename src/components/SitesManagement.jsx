import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Navigation } from 'lucide-react';

export default function SitesManagement() {
  const { sites, setSelectedSite, setActiveModule } = useApp();
  const [searchSite, setSearchSite] = useState('');

  const filteredSites = sites.filter(s => 
    s.name.toLowerCase().includes(searchSite.toLowerCase()) ||
    s.code.toLowerCase().includes(searchSite.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchSite.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Search Bar */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Environmental Sites Directory</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Physical monitoring locations, nature reserves, and biosphere protected zones in Sharjah</p>
        </div>

        <div className="page-header-actions">
          <div className="page-header-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search site, code, zone..." 
              value={searchSite}
              onChange={(e) => setSearchSite(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#F8FAFC' }}
            />
          </div>

          <button className="btn btn-epa">
            <Plus size={16} /> Register New Site
          </button>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="card-grid-responsive">
        {filteredSites.map((site) => (
          <div key={site.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-info">{site.protectedStatus}</span>
                <span className={`badge badge-${site.status.toLowerCase()}`}>{site.status}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{site.name}</h3>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '12px', fontFamily: 'monospace' }}>
                Code: <span style={{ color: '#00A878', fontWeight: 700 }}>{site.code}</span> • Zone: {site.zone}
              </div>

              {/* Coordinates & Technical Specs */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#6B7280' }}>Coordinates:</span>
                  <strong style={{ color: '#1F2937', fontFamily: 'monospace' }}>{site.lat.toFixed(4)}° N, {site.lng.toFixed(4)}° E</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#6B7280' }}>Assigned Engineer:</span>
                  <strong style={{ color: '#1F2937' }}>{site.assignedEngineer}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Stations & Assets:</span>
                  <strong style={{ color: '#2563EB' }}>{site.stationsCount} Stations ({site.assetsCount} Assets)</strong>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>Last Maint: {site.lastMaintenance}</span>
              
              <button 
                onClick={() => {
                  setSelectedSite(site);
                  setActiveModule('gis');
                }}
                className="btn btn-secondary" 
                style={{ padding: '5px 12px', fontSize: '0.76rem' }}
              >
                <Navigation size={14} color="#00A878" /> View on GIS Map
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
