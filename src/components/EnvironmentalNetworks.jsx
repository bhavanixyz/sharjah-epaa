import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Network, MapPin, Cpu, ChevronRight, ChevronDown, Layers, Plus, X } from 'lucide-react';

export default function EnvironmentalNetworks() {
  const { networks, setNetworks, sites, assets } = useApp();
  const [expandedNetwork, setExpandedNetwork] = useState('net-aqmn');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [netName, setNetName] = useState('');
  const [netCode, setNetCode] = useState('');
  const [netDomain, setNetDomain] = useState('Soil');

  const handleCreateNetwork = (e) => {
    e.preventDefault();
    if (!netName) return;
    const newNet = {
      id: `net-${Date.now()}`,
      name: netName,
      code: netCode || `${netDomain.toUpperCase()}-01`,
      type: netDomain,
      healthScore: 100,
      sitesCount: 0,
      assetsCount: 0
    };
    setNetworks([newNet, ...networks]);
    setExpandedNetwork(newNet.id);
    setIsModalOpen(false);
    setNetName('');
    setNetCode('');
  };

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
          <button onClick={() => setIsModalOpen(true)} className="btn btn-epa">
            <Plus size={16} /> Create New Network Type
          </button>
          <span className="badge badge-normal">{networks.length} Networks Configured</span>
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
                if (!activeNet) return null;
                const activeSites = sites.filter(s => s.networkId === expandedNetwork);
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <span className="badge badge-blue">{activeNet.type} Domain</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{activeNet.name}</h3>
                      </div>
                      <span className="badge badge-normal">Health: {activeNet.healthScore || 100}%</span>
                    </div>

                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase' }}>
                      Associated Sites & Equipment Tree
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeSites.length > 0 ? (
                        activeSites.map((site) => {
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
                        })
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', color: '#64748B', fontSize: '0.85rem' }}>
                          No sites currently mapped to this network. Navigate to <strong>Site Management</strong> to register stations & telemetry nodes.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      </div>

      {/* Create New Network Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '480px', maxWidth: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>Create Environmental Network</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateNetwork} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>NETWORK NAME</label>
                <input type="text" required placeholder="e.g. Sharjah Soil Quality Monitoring Network" className="input-field" value={netName} onChange={(e) => setNetName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>NETWORK CODE</label>
                  <input type="text" placeholder="e.g. SQMN-01" className="input-field" value={netCode} onChange={(e) => setNetCode(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>ENVIRONMENTAL DOMAIN</label>
                  <select className="input-field" value={netDomain} onChange={(e) => setNetDomain(e.target.value)}>
                    <option value="Soil">Soil Quality</option>
                    <option value="Noise">Acoustic & Noise</option>
                    <option value="Waste">Waste Management</option>
                    <option value="Radiation">Radiation Monitoring</option>
                    <option value="Biodiversity">Biodiversity & Reserves</option>
                    <option value="Air Quality">Air Quality</option>
                    <option value="Marine">Marine & Coastal</option>
                    <option value="Groundwater">Groundwater Aquifers</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Create Network</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
