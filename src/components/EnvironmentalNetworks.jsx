import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Network, MapPin, Cpu, ChevronRight, ChevronDown, Layers } from 'lucide-react';

export default function EnvironmentalNetworks() {
  const { networks, sites, assets } = useApp();
  const [expandedNetwork, setExpandedNetwork] = useState('net-aqmn');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Environmental Networks Hierarchy</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
            Core Enterprise Business Structure: Network → Monitoring Site → Equipment Asset → Component
          </p>
        </div>
        <div className="page-header-actions">
          <span className="badge badge-normal">5 Networks Configured</span>
        </div>
      </div>

      {/* Network Tree & Details */}
      <div className="grid-2-responsive">
        
        {/* Left: Networks Tree Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1F2937' }}>
            <Layers size={18} color="#00A878" /> Environmental Networks List
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {networks.map((net) => {
              const isExpanded = expandedNetwork === net.id;
              const netSites = sites.filter(s => s.networkId === net.id);
              return (
                <div 
                  key={net.id}
                  style={{
                    background: isExpanded ? '#E6F6F2' : '#F8FAFC',
                    border: isExpanded ? '1px solid #A3E6D2' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    onClick={() => setExpandedNetwork(net.id)}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Network size={18} color={isExpanded ? '#00A878' : '#6B7280'} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2937' }}>{net.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Code: {net.code} • {netSites.length} Sites</div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown size={18} color="#00A878" /> : <ChevronRight size={18} color="#9CA3AF" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Hierarchy Detail Inspector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          {expandedNetwork && (
            <div>
              {(() => {
                const activeNet = networks.find(n => n.id === expandedNetwork);
                const activeSites = sites.filter(s => s.networkId === expandedNetwork);
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <span className="badge badge-blue">{activeNet.type} Domain</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{activeNet.name}</h3>
                      </div>
                      <span className="badge badge-normal">Health: {activeNet.healthScore}%</span>
                    </div>

                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase' }}>
                      Associated Sites & Equipment Tree
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeSites.map((site) => {
                        const siteAssets = assets.filter(a => a.siteId === site.id);
                        return (
                          <div 
                            key={site.id}
                            style={{
                              background: '#F8FAFC',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '14px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color="#0891B2" />
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2937' }}>{site.name}</span>
                              </div>
                              <span className={`badge badge-${site.status.toLowerCase()}`}>{site.status}</span>
                            </div>

                            <p style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '10px' }}>
                              Zone: {site.zone} • Assigned: {site.assignedEngineer}
                            </p>

                            {/* Assets list under site */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '14px', borderLeft: '2px solid #A3E6D2' }}>
                              {siteAssets.length > 0 ? (
                                siteAssets.map(ast => (
                                  <div key={ast.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1F2937' }}>
                                      <Cpu size={14} color="#2563EB" /> {ast.name} ({ast.model})
                                    </span>
                                    <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Health: {ast.healthScore}%</span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>Standard telemetry loggers active</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
