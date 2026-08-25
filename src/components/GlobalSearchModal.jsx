import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, MapPin, Radio, Cpu, Wrench, Target, Boxes, 
  ShoppingBag, FileCheck, Contact, FileText, Users, Network, ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { 
    sites, 
    stations, 
    assets, 
    workOrders, 
    calibrations, 
    inventory, 
    procurement, 
    contracts, 
    users, 
    networks,
    navigateToTarget, 
    setActiveTab, 
    setActiveModule, 
    setSelectedSite, 
    setSelectedAsset 
  } = useApp();

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
    { title: 'ISO 17025 Calibration Manual', code: 'SOP-CAL-01', tab: 'Document SOPs', module: 'documents' },
    { title: 'Air Quality Network Monitoring Standard', code: 'SOP-AIR-04', tab: 'Document SOPs', module: 'documents' },
    { title: 'Marine Water Telemetry Protocol', code: 'SOP-MAR-08', tab: 'Document SOPs', module: 'documents' },
    { title: 'Asset Register Report', code: 'RPT-AST-01', tab: 'EPA Compliance Reports', module: 'reports' },
    { title: 'Maintenance Completion Summary', code: 'RPT-MNT-06', tab: 'EPA Compliance Reports', module: 'reports' }
  ];

  const providersList = [
    { provider: 'Teledyne API Environmental', contactPerson: 'Mark Harrison', role: 'Chief Calibration Engineer' },
    { provider: 'Horiba Instruments Middle East', contactPerson: 'Eng. Ahmed Al-Standard', role: 'Regional Maintenance Manager' },
    { provider: 'Thermo Fisher Scientific', contactPerson: 'David Miller', role: 'Gas Analyzer Specialist' },
    { provider: 'YSI Xylem Water Solutions', contactPerson: 'Dr. Sarah Jenkins', role: 'Marine Sonde Calibration Lead' },
    { provider: 'Campbell Scientific Middle East', contactPerson: 'Omar Al-Sabah', role: 'Telemetry & Data Logger Engineer' }
  ];

  const q = query.trim().toLowerCase();

  const results = {
    sites: q ? (sites || []).filter(s => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q) || s.zone?.toLowerCase().includes(q)).slice(0, 5) : [],
    stations: q ? (stations || []).filter(st => st.name?.toLowerCase().includes(q) || st.code?.toLowerCase().includes(q) || st.siteName?.toLowerCase().includes(q)).slice(0, 5) : [],
    assets: q ? (assets || []).filter(a => a.name?.toLowerCase().includes(q) || a.serialNo?.toLowerCase().includes(q) || a.siteName?.toLowerCase().includes(q)).slice(0, 5) : [],
    workOrders: q ? (workOrders || []).filter(w => w.title?.toLowerCase().includes(q) || w.id?.toLowerCase().includes(q) || w.siteName?.toLowerCase().includes(q)).slice(0, 5) : [],
    calibrations: q ? (calibrations || []).filter(c => c.certificateNo?.toLowerCase().includes(q) || c.assetName?.toLowerCase().includes(q) || c.siteName?.toLowerCase().includes(q)).slice(0, 5) : [],
    inventory: q ? (inventory || []).filter(i => i.name?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)).slice(0, 5) : [],
    procurement: q ? (procurement || []).filter(p => p.title?.toLowerCase().includes(q) || p.requisitionNo?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q)).slice(0, 5) : [],
    contracts: q ? (contracts || []).filter(c => c.title?.toLowerCase().includes(c) || c.vendor?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q)).slice(0, 5) : [],
    providers: q ? providersList.filter(p => p.provider?.toLowerCase().includes(q) || p.contactPerson?.toLowerCase().includes(q)).slice(0, 5) : [],
    docs: q ? mockDocs.filter(d => d.title?.toLowerCase().includes(q) || d.code?.toLowerCase().includes(q)).slice(0, 5) : [],
    users: q ? (users || []).filter(u => u.name?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q) || u.code?.toLowerCase().includes(q)).slice(0, 5) : [],
    networks: q ? (networks || []).filter(n => n.name?.toLowerCase().includes(q) || n.code?.toLowerCase().includes(q) || n.type?.toLowerCase().includes(q)).slice(0, 5) : []
  };

  const totalResults = 
    results.sites.length + 
    results.stations.length + 
    results.assets.length + 
    results.workOrders.length + 
    results.calibrations.length + 
    results.inventory.length + 
    results.procurement.length + 
    results.contracts.length + 
    results.providers.length + 
    results.docs.length + 
    results.users.length + 
    results.networks.length;

  const handleSelect = (module, tab, searchTerm, item = null) => {
    if (navigateToTarget) {
      navigateToTarget(module, tab, searchTerm, item);
    } else {
      if (setActiveTab) setActiveTab(tab);
      if (setActiveModule) setActiveModule(module);
      if (item && item.site && setSelectedSite) setSelectedSite(item.site);
      else if (module === 'sites' && item && setSelectedSite) setSelectedSite(item);
      if (item && item.asset && setSelectedAsset) setSelectedAsset(item.asset);
      else if (module === 'assets' && item && setSelectedAsset) setSelectedAsset(item);
    }
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
        paddingTop: '60px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '740px',
          maxWidth: '94vw',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', gap: '12px' }}>
          <Search size={22} color="#00A878" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Global Search (Sites, Stations, Equipment, Work Orders, Inventory, Users...)"
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {!query && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <Search size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>Type to search across the entire Sharjah EPA Platform</p>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Instant search covers Sites, Stations, Equipment, Work Orders, Calibrations, Inventory, Contracts, SOPs, and Admin Users.</span>
            </div>
          )}

          {query && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>No platform records matching "{query}"</p>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Try searching by serial number, site name, work order ID, SKU, or user name.</p>
            </div>
          )}

          {query && totalResults > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 1. Sites Results */}
              {results.sites.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A878', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> SITES DIRECTORY ({results.sites.length})
                  </div>
                  {results.sites.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSelect('sites', 'Site Management', s.name, s)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{s.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Zone: {s.zone} • Code: {s.code} • Status: {s.status}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#00A878', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Open Site <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Stations */}
              {results.stations.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0891B2', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Radio size={14} /> STATIONS DIRECTORY ({results.stations.length})
                  </div>
                  {results.stations.map(st => (
                    <div
                      key={st.id}
                      onClick={() => handleSelect('stations', 'Station Management', st.name, st)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{st.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Code: {st.code} • Location: {st.siteName} • Type: {st.type}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#0891B2', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Station <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Equipment / Assets */}
              {results.assets.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} /> EQUIPMENT & ASSET CATALOG ({results.assets.length})
                  </div>
                  {results.assets.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('assets', 'Asset Catalog & Equipment', a.name, a)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{a.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Serial: {a.serialNo} • Location: {a.siteName} • Model: {a.model}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Asset Catalog <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Work Orders */}
              {results.workOrders.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wrench size={14} /> WORK ORDERS & SLA ({results.workOrders.length})
                  </div>
                  {results.workOrders.map(w => (
                    <div
                      key={w.id}
                      onClick={() => handleSelect('maintenance', 'Work Orders & SLA', w.id, w)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{w.id}: {w.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Assigned: {w.assignedTo} • Priority: {w.priority} • SLA: {w.slaTimeRemaining}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View WO <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Calibrations */}
              {results.calibrations.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={14} /> DRIFT & GAS CALIBRATIONS ({results.calibrations.length})
                  </div>
                  {results.calibrations.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect('calibration', 'Drift & Gas Calibration', c.certificateNo, c)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{c.certificateNo}: {c.assetName}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Site: {c.siteName} • Result: {c.result} • Date: {c.date}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Calibration <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Inventory */}
              {results.inventory.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Boxes size={14} /> INVENTORY & SPARE PARTS ({results.inventory.length})
                  </div>
                  {results.inventory.map(i => (
                    <div
                      key={i.id}
                      onClick={() => handleSelect('inventory', 'Inventory & Spare Parts', i.name, i)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{i.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>SKU: {i.sku} • Stock: {i.quantity} units • Category: {i.category}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#7C3AED', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Inventory <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. Procurement */}
              {results.procurement.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EA580C', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShoppingBag size={14} /> PROCUREMENT & ORDERS ({results.procurement.length})
                  </div>
                  {results.procurement.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect('procurement', 'Procurement & Orders', p.title, p)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{p.id}: {p.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Vendor: {p.vendor} • Amount: {p.totalAmount} • Status: {p.status}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#EA580C', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Procurement <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 8. Contracts */}
              {results.contracts.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileCheck size={14} /> CONTRACTS & WARRANTY ({results.contracts.length})
                  </div>
                  {results.contracts.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect('contracts', 'Contracts & Warranty', c.title, c)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{c.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Vendor: {c.vendor} • Value: {c.value} • Type: {c.contractType}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#4F46E5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Contracts <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 9. Service Providers */}
              {results.providers.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Contact size={14} /> SERVICE PROVIDERS & CONTACTS ({results.providers.length})
                  </div>
                  {results.providers.map((pr, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect('providers', 'Service Providers / Contacts', pr.provider, pr)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{pr.provider}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Lead: {pr.contactPerson} • Role: {pr.role}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Contacts <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 10. Documents */}
              {results.docs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} /> DOCUMENT SOPS & REPORTS ({results.docs.length})
                  </div>
                  {results.docs.map((d, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect(d.module, d.tab, d.title, d)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{d.title}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Code: {d.code} • Section: {d.tab}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#8B5CF6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Open {d.tab} <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 11. Users */}
              {results.users.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> USER DIRECTORY ({results.users.length})
                  </div>
                  {results.users.map(u => (
                    <div
                      key={u.id}
                      onClick={() => handleSelect('users', 'User Directory', u.name, u)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{u.name} ({u.code})</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Role: {u.role} • Department: {u.department}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#00A878', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        User Profile <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 12. Networks */}
              {results.networks.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Network size={14} /> ENVIRONMENTAL NETWORKS ({results.networks.length})
                  </div>
                  {results.networks.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleSelect('networks', 'Environmental Networks', n.name, n)}
                      className="search-item-hover"
                      style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{n.name}</div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Code: {n.code} • Domain: {n.type} • Status: {n.status}</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Network Tree <ArrowRight size={15} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ background: '#F8FAFC', padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
          <span>Search powered by Sharjah EPA Enterprise Search Engine</span>
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
