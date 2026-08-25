import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Table, LayoutGrid, Map, MapPin, User, Building2, 
  ShieldCheck, AlertTriangle, CheckCircle2, Download, ChevronDown, 
  ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, Square, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText
} from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import KpiDetailModal from './KpiDetailModal';
import MapView from './common/MapView';

export default function SitesManagement() {
  const { sites, setSelectedSite } = useApp();
  
  // Search & View Mode states
  const [searchSite, setSearchSite] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'map'
  const [activeKpiFilter, setActiveKpiFilter] = useState(null);
  const [selectedKpiModal, setSelectedKpiModal] = useState(null);

  // Sorting states
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Row Selection states (Single/Multi-select)
  const [selectedSiteIds, setSelectedSiteIds] = useState([]);

  // Pagination states
  const [pageSize, setPageSize] = useState(10); // 10, 50, 100, 500
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Handle outside click for export dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Top KPI counts
  const totalSites = sites.length;
  const protectedSites = sites.filter(s => s.protectedStatus && (s.protectedStatus.includes('Protected') || s.protectedStatus.includes('Reserve'))).length;
  const normalSites = sites.filter(s => s.status === 'Normal' || s.status === 'Optimal').length;
  const actionSites = sites.filter(s => s.status !== 'Normal' && s.status !== 'Optimal').length;

  // Dynamic sorting & filtering
  const filteredSites = useMemo(() => {
    return sites.filter(s => {
      // Global Search
      const matchesSearch = 
        !searchSite ||
        s.name.toLowerCase().includes(searchSite.toLowerCase()) ||
        s.code.toLowerCase().includes(searchSite.toLowerCase()) ||
        s.zone.toLowerCase().includes(searchSite.toLowerCase()) ||
        (s.assignedEngineer && s.assignedEngineer.toLowerCase().includes(searchSite.toLowerCase()));
      if (!matchesSearch) return false;

      // KPI Card quick filters
      if (activeKpiFilter === 'protected' && (!s.protectedStatus || (!s.protectedStatus.includes('Protected') && !s.protectedStatus.includes('Reserve')))) return false;
      if (activeKpiFilter === 'normal' && s.status !== 'Normal' && s.status !== 'Optimal') return false;
      if (activeKpiFilter === 'action' && (s.status === 'Normal' || s.status === 'Optimal')) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sites, searchSite, activeKpiFilter, sortField, sortDirection]);

  // Pagination math
  const totalRecords = filteredSites.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedSites = useMemo(() => {
    return filteredSites.slice(startIndex, endIndex);
  }, [filteredSites, startIndex, endIndex]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ color: '#94A3B8', opacity: 0.6 }} />;
    return sortDirection === 'asc' ? <ArrowUp size={13} style={{ color: '#00A878' }} /> : <ArrowDown size={13} style={{ color: '#00A878' }} />;
  };

  // Row selection logic
  const isAllPaginatedSelected = useMemo(() => {
    if (paginatedSites.length === 0) return false;
    return paginatedSites.every(s => selectedSiteIds.includes(s.id));
  }, [paginatedSites, selectedSiteIds]);

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      setSelectedSiteIds(prev => prev.filter(id => !paginatedSites.some(ps => ps.id === id)));
    } else {
      const newIds = new Set([...selectedSiteIds, ...paginatedSites.map(s => s.id)]);
      setSelectedSiteIds(Array.from(newIds));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedSiteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export handler (CSV / PDF)
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);

    const exportData = selectedSiteIds.length > 0
      ? filteredSites.filter(s => selectedSiteIds.includes(s.id))
      : filteredSites;

    if (exportData.length === 0) {
      alert('No site records available to export.');
      return;
    }

    if (format === 'csv') {
      const headers = ['Site Code', 'Site Name', 'Protected Category', 'Zone / Location', 'Latitude', 'Longitude', 'Stations Count', 'Assets Count', 'Assigned Engineer', 'Status', 'Last Maintenance'];
      const rows = exportData.map(s => [
        `"${s.code || ''}"`,
        `"${s.name || ''}"`,
        `"${s.protectedStatus || ''}"`,
        `"${s.zone || ''}"`,
        s.lat || 0,
        s.lng || 0,
        s.stationsCount || 0,
        s.assetsCount || 0,
        `"${s.assignedEngineer || ''}"`,
        `"${s.status || ''}"`,
        `"${s.lastMaintenance || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Sharjah_EPA_Sites_${exportData.length}_Records.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      window.print();
    }
  };

  // Inspect KPI details
  const handleInspectKpi = (id) => {
    if (id === 'total') {
      setSelectedKpiModal({
        title: 'Sharjah Environmental Sites Directory',
        value: `${totalSites} Physical Sites`,
        category: 'total',
        color: '#2563EB',
        trendHistory: [
          { day: 'Aug 1', val: 6 }, { day: 'Aug 5', val: 7 }, { day: 'Aug 9', val: 7 },
          { day: 'Aug 13', val: 8 }, { day: 'Aug 17', val: 8 }, { day: 'Aug 21', val: 8 }, { day: 'Aug 24', val: totalSites }
        ],
        breakdown: sites.map(s => ({
          name: s.name,
          value: `${s.stationsCount} Stations (${s.zone})`,
          status: s.status === 'Normal' ? 'Optimal' : s.status,
          action: `Lead Engineer: ${s.assignedEngineer}`
        }))
      });
    } else if (id === 'protected') {
      setSelectedKpiModal({
        title: 'Biosphere & Protected Reserve Reserves',
        value: `${protectedSites} Reserves`,
        category: 'protected',
        color: '#00A878',
        trendHistory: [
          { day: 'Aug 1', val: 3 }, { day: 'Aug 5', val: 4 }, { day: 'Aug 9', val: 4 },
          { day: 'Aug 13', val: 5 }, { day: 'Aug 17', val: 5 }, { day: 'Aug 21', val: 5 }, { day: 'Aug 24', val: protectedSites }
        ],
        breakdown: sites.filter(s => s.protectedStatus.includes('Protected') || s.protectedStatus.includes('Reserve')).map(s => ({
          name: s.name,
          value: s.protectedStatus,
          status: 'Optimal',
          action: `Zone: ${s.zone}`
        }))
      });
    } else if (id === 'normal') {
      setSelectedKpiModal({
        title: 'Optimal Operational Sites',
        value: `${normalSites} Optimal`,
        category: 'normal',
        color: '#0891B2',
        trendHistory: [
          { day: 'Aug 1', val: 4 }, { day: 'Aug 5', val: 5 }, { day: 'Aug 9', val: 5 },
          { day: 'Aug 13', val: 6 }, { day: 'Aug 17', val: 6 }, { day: 'Aug 21', val: 6 }, { day: 'Aug 24', val: normalSites }
        ],
        breakdown: sites.filter(s => s.status === 'Normal' || s.status === 'Optimal').map(s => ({
          name: s.name,
          value: `Telemetry Online`,
          status: 'Optimal',
          action: `Last Maint: ${s.lastMaintenance}`
        }))
      });
    } else if (id === 'action') {
      setSelectedKpiModal({
        title: 'Sites Requiring Technical Attention',
        value: `${actionSites} Sites`,
        category: 'action',
        color: '#EF4444',
        trendHistory: [
          { day: 'Aug 1', val: 3 }, { day: 'Aug 5', val: 2 }, { day: 'Aug 9', val: 2 },
          { day: 'Aug 13', val: 2 }, { day: 'Aug 17', val: 2 }, { day: 'Aug 21', val: 1 }, { day: 'Aug 24', val: actionSites }
        ],
        breakdown: sites.filter(s => s.status !== 'Normal' && s.status !== 'Optimal').map(s => ({
          name: s.name,
          value: s.status,
          status: s.status,
          action: `Assignee: ${s.assignedEngineer}`
        }))
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      


      {/* Main Sites Management Panel Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Header Inside the Card Container: Search, Export Dropdown, View Mode Toggle, Register Site */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 340px', minWidth: '240px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search site, code, zone, engineer..." 
                value={searchSite}
                onChange={(e) => {
                  setSearchSite(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right: Export Dropdown + View Mode Switcher + Register New Site CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            
            {/* Export Dropdown Button */}
            <div ref={exportDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(prev => !prev)}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  boxSizing: 'border-box'
                }}
              >
                <Download size={14} color="#00A878" />
                <span>Export {selectedSiteIds.length > 0 ? `(${selectedSiteIds.length})` : ''}</span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {isExportDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  zIndex: 9999,
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '190px',
                  padding: '6px 0',
                  fontSize: '0.76rem'
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', borderBottom: '1px solid #F1F5F9', textTransform: 'uppercase' }}>
                    {selectedSiteIds.length > 0 ? `Selected Sites (${selectedSiteIds.length})` : `All Filtered (${filteredSites.length})`}
                  </div>
                  <div 
                    onClick={() => handleExport('csv')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileSpreadsheet size={15} color="#00A878" /> Export as CSV
                  </div>
                  <div 
                    onClick={() => handleExport('pdf')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileText size={15} color="#EF4444" /> Export as PDF
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle Switch (Table View, Card View, Map View) */}
            <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1', height: '36px', boxSizing: 'border-box' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'table' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'table' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Table size={15} /> Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'cards' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'cards' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <LayoutGrid size={15} /> Card View
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'map' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'map' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Map size={15} /> Map View
              </button>
            </div>

            <button 
              className="btn btn-epa" 
              style={{ 
                height: '36px', 
                padding: '0 16px', 
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}
            >
              <Plus size={16} /> Register New Site
            </button>

          </div>
        </div>

        {/* Selected Items Counter Bar */}
        {selectedSiteIds.length > 0 && (
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            marginBottom: '14px',
            background: '#E6F6F2',
            border: '1px solid rgba(0, 168, 120, 0.3)',
            borderRadius: '10px',
            color: '#00A878',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} />
              <span>Selected {selectedSiteIds.length} site(s) for bulk export or operation</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSiteIds([])}
              style={{ background: 'transparent', border: 'none', color: '#00A878', fontWeight: 800, cursor: 'pointer', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> Clear Selection
            </button>
          </div>
        )}

        {/* View 1: MAP VIEW */}
        {viewMode === 'map' ? (
          <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Sharjah GIS Site Locations & Spatial Distribution</h3>
                <p style={{ fontSize: '0.76rem', color: '#64748B' }}>Interactive map with GIS widgets, layer controls, and real-time station status</p>
              </div>
              <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>
                <MapPin size={12} /> {filteredSites.length} Locations Tagged
              </span>
            </div>
            <div style={{ height: '580px', borderRadius: '12px', overflow: 'hidden' }}>
              <MapView height="100%" onSelectSite={(loc) => setSelectedSite(loc)} />
            </div>
          </div>
        ) : viewMode === 'table' ? (
          
          /* View 2: TABLE VIEW */
          <div className="table-responsive">
            <table className="epa-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isAllPaginatedSelected}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', accentColor: '#00A878' }}
                    />
                  </th>
                  <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Site Code {renderSortIcon('code')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Site Name & Protected Category {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('zone')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Zone / Location {renderSortIcon('zone')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('lat')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Coordinates {renderSortIcon('lat')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('stationsCount')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Stations & Assets {renderSortIcon('stationsCount')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assignedEngineer')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Assigned Lead Engineer {renderSortIcon('assignedEngineer')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('lastMaintenance')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Last Maint {renderSortIcon('lastMaintenance')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSites.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontWeight: 600 }}>
                      No site records matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedSites.map((site) => {
                    const isSelected = selectedSiteIds.includes(site.id);
                    return (
                      <tr 
                        key={site.id} 
                        style={{ background: isSelected ? 'rgba(0, 168, 120, 0.04)' : undefined, cursor: 'pointer' }}
                        onClick={() => toggleSelectRow(site.id)}
                      >
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(site.id)}
                            style={{ cursor: 'pointer', accentColor: '#00A878' }}
                          />
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace', background: '#E6F6F2', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0, 168, 120, 0.2)' }}>
                            {site.code}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.88rem' }}>{site.name}</div>
                          <span className="badge badge-info" style={{ marginTop: '3px', display: 'inline-block', fontSize: '0.68rem' }}>{site.protectedStatus}</span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                          {site.zone}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#334155', fontFamily: 'monospace' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="#00A878" />
                            {site.lat ? site.lat.toFixed(4) : 0}° N, {site.lng ? site.lng.toFixed(4) : 0}° E
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-blue" style={{ fontWeight: 700, fontSize: '0.74rem' }}>
                            {site.stationsCount} Stations ({site.assetsCount} Assets)
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#1F2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} color="#0891B2" />
                            {site.assignedEngineer}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${(site.status || 'normal').toLowerCase()}`}>{site.status}</span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          {site.lastMaintenance}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          
          /* View 3: CARDS VIEW */
          <div className="card-grid-responsive">
            {paginatedSites.map((site) => {
              const isSelected = selectedSiteIds.includes(site.id);
              return (
                <div 
                  key={site.id} 
                  className="glass-panel glass-panel-hover" 
                  style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justify: 'space-between',
                    border: isSelected ? '2px solid #00A878' : undefined,
                    background: isSelected ? 'rgba(0, 168, 120, 0.03)' : undefined
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(site.id)}
                          style={{ cursor: 'pointer', accentColor: '#00A878' }}
                        />
                        <span className="badge badge-info">{site.protectedStatus}</span>
                      </div>
                      <span className={`badge badge-${(site.status || 'normal').toLowerCase()}`}>{site.status}</span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{site.name}</h3>
                    <div style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '12px', fontFamily: 'monospace' }}>
                      Code: <span style={{ color: '#00A878', fontWeight: 700 }}>{site.code}</span> • Zone: {site.zone}
                    </div>

                    {/* Coordinates & Technical Specs */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#6B7280' }}>Coordinates:</span>
                        <strong style={{ color: '#1F2937', fontFamily: 'monospace' }}>{site.lat ? site.lat.toFixed(4) : 0}° N, {site.lng ? site.lng.toFixed(4) : 0}° E</strong>
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
                    <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>
                      Telemetry Online
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar (Bottom Left & Bottom Right) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          padding: '12px 18px', 
          background: '#FFFFFF', 
          border: '1px solid #E2E8F0', 
          borderRadius: '10px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginTop: '16px',
          width: '100%'
        }}>
          
          {/* Bottom Left: View Records (10, 50, 100, 500) Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
            <span>View records:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0F172A',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> site records</span>
          </div>

          {/* Bottom Right: Pagination Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              title="First Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === 1 ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              title="Previous Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === 1 ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', padding: '0 8px' }}>
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              title="Next Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === totalPages ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              title="Last Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === totalPages ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronsRight size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* KPI Inspection Modal */}
      {selectedKpiModal && (
        <KpiDetailModal 
          kpiData={selectedKpiModal}
          onClose={() => setSelectedKpiModal(null)}
          onApplyFilter={(cat) => { setActiveKpiFilter(cat === 'total' ? null : cat); setCurrentPage(1); }}
        />
      )}

    </div>
  );
}
