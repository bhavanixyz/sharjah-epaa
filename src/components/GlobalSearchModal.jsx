import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Cpu, Wrench, Shield, FileText, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { sites, assets, workOrders, inventory, procurement, setActiveTab, setActiveModule, setSelectedSite, setSelectedAsset } = useApp();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockDocs = [
    { title: 'ISO 17025 Calibration Manual', code: 'SOP-CAL-01', tab: 'Document SOPs' },
    { title: 'Air Quality Network Monitoring Standard', code: 'SOP-AIR-04', tab: 'Document SOPs' },
    { title: 'Marine Water Telemetry Protocol', code: 'SOP-MAR-08', tab: 'Document SOPs' }
  ];

  const results = {
    sites: query ? sites.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())) : [],
    assets: query ? assets.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.serialNo.toLowerCase().includes(query.toLowerCase())) : [],
    workOrders: query ? workOrders.filter(w => w.title.toLowerCase().includes(query.toLowerCase()) || w.id.toLowerCase().includes(query.toLowerCase())) : [],
    inventory: query ? inventory.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.sku.toLowerCase().includes(query.toLowerCase())) : [],
    docs: query ? mockDocs.filter(d => d.title.toLowerCase().includes(query.toLowerCase()) || d.code.toLowerCase().includes(query.toLowerCase())) : []
  };

  const totalResults = results.sites.length + results.assets.length + results.workOrders.length + results.inventory.length + results.docs.length;

  const moduleTabMap = {
    'Executive Dashboard': 'dashboard',
    'GIS Command Center': 'gis',
    'Environmental Networks': 'networks',
    'Site Management': 'sites',
    'Station Management': 'stations',
    'Equipment Management': 'assets',
    'Service Providers / Contacts': 'providers',
    'Work Orders & SLA': 'maintenance',
    'Drift & Gas Calibration': 'calibration',
    'Inventory & Spare Parts': 'inventory',
    'Procurement & Orders': 'procurement',
    'Contracts & Warranty': 'contracts',
    'Document SOPs': 'documents',
    'EPA Compliance Reports': 'reports',
    'User Directory': 'users',
    'Role & RBAC Matrix': 'roles',
    'Security Audit Trail': 'audit'
  };

  const handleSelect = (tab, item = null) => {
    const mod = moduleTabMap[tab] || 'dashboard';
    if (setActiveTab) setActiveTab(tab);
    if (setActiveModule) setActiveModule(mod);
    if (item && item.site && setSelectedSite) setSelectedSite(item.site);
    if (item && item.asset && setSelectedAsset) setSelectedAsset(item.asset);
    if (onNavigate) onNavigate(tab);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '680px',
          maxWidth: '92vw',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', gap: '12px' }}>
          <Search size={22} color="#00A878" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Global Search (Sites, Equipment, Work Orders, Docs, Inventory...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#0F172A'
            }}
          />
          <kbd style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
            ESC
          </kbd>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px' }}>
          {!query && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <Search size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>Type to search across the entire Sharjah EPAA Platform</p>
              <span style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>Shortcuts: Press Ctrl+F anywhere to summon global search</span>
            </div>
          )}

          {query && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>No platform records matching "{query}"</p>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Try searching by serial number, site name, work order ID, or document code.</p>
            </div>
          )}

          {query && totalResults > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Sites Results */}
              {results.sites.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A878', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> SITES DIRECTORY ({results.sites.length})
                  </div>
                  {results.sites.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSelect('Site Management')}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{s.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Zone: {s.zone} • Code: {s.code}</span>
                      </div>
                      <ArrowRight size={16} color="#00A878" />
                    </div>
                  ))}
                </div>
              )}

              {/* Equipment / Assets */}
              {results.assets.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} /> EQUIPMENT & ASSETS ({results.assets.length})
                  </div>
                  {results.assets.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('Equipment Management')}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{a.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Serial: {a.serialNo} • Location: {a.siteName}</span>
                      </div>
                      <ArrowRight size={16} color="#2563EB" />
                    </div>
                  ))}
                </div>
              )}

              {/* Work Orders */}
              {results.workOrders.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wrench size={14} /> WORK ORDERS & SLA ({results.workOrders.length})
                  </div>
                  {results.workOrders.map(w => (
                    <div
                      key={w.id}
                      onClick={() => handleSelect('Work Orders & SLA')}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{w.id}: {w.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Assigned: {w.technician} • Priority: {w.priority}</span>
                      </div>
                      <ArrowRight size={16} color="#D97706" />
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {results.docs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} /> DOCUMENT SOPs ({results.docs.length})
                  </div>
                  {results.docs.map((d, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect('Document SOPs')}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{d.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Code: {d.code}</span>
                      </div>
                      <ArrowRight size={16} color="#8B5CF6" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ background: '#F8FAFC', padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
          <span>Search powered by Sharjah EPAA Enterprise Search Engine</span>
          <span>{totalResults} records found</span>
        </div>
      </div>

      <style>{`
        .search-item-hover:hover {
          background: #F1F5F9;
        }
      `}</style>
    </div>
  );
}
