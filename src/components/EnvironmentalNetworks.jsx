import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, MapPin, Cpu, ChevronRight, ChevronDown, Layers, 
  Plus, X, Activity, ShieldAlert, CheckCircle2, List, 
  Table, Map, ChevronLeft 
} from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import InteractiveChartContainer from './InteractiveChartContainer';
import DataTable from './common/DataTable';
import MapView from './common/MapView';

export default function EnvironmentalNetworks() {
  const { networks, setNetworks, sites, assets } = useApp();
  const [expandedNetwork, setExpandedNetwork] = useState('net-aqmn');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [netName, setNetName] = useState('');
  const [netCode, setNetCode] = useState('');
  const [netDomain, setNetDomain] = useState('Soil');
  const [activeKpi, setActiveKpi] = useState(null);

  // Category View Options & Pagination State
  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'table' | 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      assetsCount: 0,
      status: 'Operational'
    };
    setNetworks([newNet, ...networks]);
    setExpandedNetwork(newNet.id);
    setIsModalOpen(false);
    setNetName('');
    setNetCode('');
  };

  const avgHealth = Math.round(networks.reduce((acc, n) => acc + (n.healthScore || 90), 0) / networks.length);
  const operationalCount = networks.filter(n => n.status === 'Operational').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      


      {/* Network Tree & Details */}
      <div className="grid-2-responsive">
        
        {/* Left: Networks Tree Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#1F2937' }}>
              <Layers size={18} color="#00A878" /> Environmental Networks List
            </h3>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-epa" style={{ padding: '6px 12px', fontSize: '0.76rem' }}>
              <Plus size={14} /> Create Network
            </button>
          </div>

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
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => {
                      setExpandedNetwork(net.id);
                      setCurrentPage(1);
                    }}
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

                // Table View Columns
                const siteColumns = [
                  { key: 'name', label: 'Site / Station Name', sortable: true, render: (val, row) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#0891B2" />
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{row.name}</span>
                    </div>
                  )},
                  { key: 'zone', label: 'Zone Sector', sortable: true },
                  { key: 'assignedEngineer', label: 'Assigned Specialist', sortable: true },
                  { key: 'status', label: 'Status', sortable: true, render: (val) => (
                    <span className={`badge badge-${(val || 'normal').toLowerCase()}`}>{val}</span>
                  )},
                  { key: 'assetsCount', label: 'Equipment', sortable: true, render: (val, row) => {
                    const asts = assets.filter(a => a.siteId === row.id);
                    return (
                      <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.78rem' }}>
                        {asts.length > 0 ? `${asts.length} Units` : 'Standard Sensors'}
                      </span>
                    );
                  }},
                  { key: 'healthScore', label: 'Health', sortable: true, render: (val, row) => (
                    <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>
                      {row.healthScore || 95}%
                    </span>
                  )}
                ];

                // Pagination Calculations for Tree View
                const totalRecords = activeSites.length;
                const totalPages = Math.ceil(totalRecords / pageSize) || 1;
                const startIndex = (currentPage - 1) * pageSize;
                const paginatedSites = activeSites.slice(startIndex, startIndex + pageSize);

                return (
                  <div>
                    {/* Active Network Header & Multi-View Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span className="badge badge-blue">{activeNet.type} Domain</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{activeNet.name}</h3>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span className="badge badge-normal" style={{ fontSize: '0.78rem' }}>Health: {activeNet.healthScore || 100}%</span>

                        {/* View Switcher: Tree View / Table View / Map View */}
                        <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                          <button
                            onClick={() => { setViewMode('tree'); setCurrentPage(1); }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: viewMode === 'tree' ? '#FFFFFF' : 'transparent',
                              color: viewMode === 'tree' ? '#00A878' : '#64748B',
                              boxShadow: viewMode === 'tree' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                          >
                            <List size={14} /> Tree View
                          </button>

                          <button
                            onClick={() => { setViewMode('table'); setCurrentPage(1); }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                              color: viewMode === 'table' ? '#00A878' : '#64748B',
                              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                          >
                            <Table size={14} /> Table View
                          </button>

                          <button
                            onClick={() => { setViewMode('map'); setCurrentPage(1); }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                              color: viewMode === 'map' ? '#00A878' : '#64748B',
                              boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                          >
                            <Map size={14} /> Map View
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* View Mode 1: Tree / Cards View */}
                    {viewMode === 'tree' && (
                      <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase' }}>
                          Associated Sites & Equipment Tree
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {paginatedSites.length > 0 ? (
                            paginatedSites.map((site) => {
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

                        {/* Bottom Pagination & Records Dropdown */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #E2E8F0', fontSize: '0.78rem', color: '#64748B' }}>
                          
                          {/* Bottom-left: View records per page dropdown */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>View records per page:</span>
                            <select
                              value={pageSize}
                              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontWeight: 700,
                                color: '#0F172A',
                                cursor: 'pointer',
                                background: '#FFFFFF'
                              }}
                            >
                              <option value={10}>10</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                              <option value={500}>500</option>
                            </select>
                          </div>

                          {/* Showing records count */}
                          <div>
                            Showing {totalRecords > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, totalRecords)} of {totalRecords} records
                          </div>

                          {/* Bottom-right: Pagination navigation */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                              <ChevronLeft size={14} /> Previous
                            </button>

                            <span style={{ fontWeight: 700, color: '#0F172A', padding: '0 4px' }}>
                              Page {currentPage} of {totalPages}
                            </span>

                            <button
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                            >
                              Next <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View Mode 2: Table View */}
                    {viewMode === 'table' && (
                      <DataTable 
                        columns={siteColumns} 
                        data={activeSites} 
                        title={`${activeNet.name} Sites & Stations Directory`} 
                      />
                    )}

                    {/* View Mode 3: Map View */}
                    {viewMode === 'map' && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                        <MapView height="480px" />
                      </div>
                    )}
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
