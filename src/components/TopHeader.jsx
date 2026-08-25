import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Bell, Plus, Menu, MapPin, Radio, Cpu, Wrench, 
  Target, Boxes, ShoppingBag, FileCheck, Contact, FileText, 
  Users, Shield, Network, ArrowRight, X, ExternalLink
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function TopHeader({ onOpenSearch }) {
  const { 
    setActiveModule,
    setActiveTab,
    notifications, 
    setIsWoModalOpen,
    isNotifDrawerOpen,
    setIsNotifDrawerOpen,
    toggleMobileMenu,
    navigateToTarget,
    sites,
    stations,
    assets,
    workOrders,
    calibrations,
    inventory,
    procurement,
    contracts,
    users,
    networks
  } = useApp();

  const [headerQuery, setHeaderQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const unreadCount = notifications ? notifications.filter(n => !n.read && !n.isRead).length : 0;

  const handleOpenNotifications = (e) => {
    e?.stopPropagation();
    if (setIsNotifDrawerOpen) {
      setIsNotifDrawerOpen(prev => !prev);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Standard static documents
  const docsList = [
    { title: 'ISO 17025 Calibration Manual', code: 'SOP-CAL-01', tab: 'Document SOPs', module: 'documents' },
    { title: 'Air Quality Network Monitoring Standard', code: 'SOP-AIR-04', tab: 'Document SOPs', module: 'documents' },
    { title: 'Marine Water Telemetry Protocol', code: 'SOP-MAR-08', tab: 'Document SOPs', module: 'documents' },
    { title: 'Asset Register Report', code: 'RPT-AST-01', tab: 'EPA Compliance Reports', module: 'reports' },
    { title: 'Maintenance Completion Summary', code: 'RPT-MNT-06', tab: 'EPA Compliance Reports', module: 'reports' }
  ];

  // Service providers list
  const providersList = [
    { provider: 'Teledyne API Environmental', contactPerson: 'Mark Harrison', role: 'Chief Calibration Engineer' },
    { provider: 'Horiba Instruments Middle East', contactPerson: 'Eng. Ahmed Al-Standard', role: 'Regional Maintenance Manager' },
    { provider: 'Thermo Fisher Scientific', contactPerson: 'David Miller', role: 'Gas Analyzer Specialist' },
    { provider: 'YSI Xylem Water Solutions', contactPerson: 'Dr. Sarah Jenkins', role: 'Marine Sonde Calibration Lead' },
    { provider: 'Campbell Scientific Middle East', contactPerson: 'Omar Al-Sabah', role: 'Telemetry & Data Logger Engineer' }
  ];

  // Search Results aggregation
  const q = headerQuery.trim().toLowerCase();

  const results = {
    sites: q ? (sites || []).filter(s => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q) || s.zone?.toLowerCase().includes(q)).slice(0, 3) : [],
    stations: q ? (stations || []).filter(st => st.name?.toLowerCase().includes(q) || st.code?.toLowerCase().includes(q) || st.siteName?.toLowerCase().includes(q)).slice(0, 3) : [],
    assets: q ? (assets || []).filter(a => a.name?.toLowerCase().includes(q) || a.serialNo?.toLowerCase().includes(q) || a.siteName?.toLowerCase().includes(q)).slice(0, 3) : [],
    workOrders: q ? (workOrders || []).filter(w => w.title?.toLowerCase().includes(q) || w.id?.toLowerCase().includes(q) || w.siteName?.toLowerCase().includes(q)).slice(0, 3) : [],
    calibrations: q ? (calibrations || []).filter(c => c.certificateNo?.toLowerCase().includes(q) || c.assetName?.toLowerCase().includes(q) || c.siteName?.toLowerCase().includes(q)).slice(0, 2) : [],
    inventory: q ? (inventory || []).filter(i => i.name?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)).slice(0, 2) : [],
    procurement: q ? (procurement || []).filter(p => p.title?.toLowerCase().includes(q) || p.requisitionNo?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q)).slice(0, 2) : [],
    contracts: q ? (contracts || []).filter(c => c.title?.toLowerCase().includes(q) || c.vendor?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q)).slice(0, 2) : [],
    providers: q ? providersList.filter(p => p.provider?.toLowerCase().includes(q) || p.contactPerson?.toLowerCase().includes(q)).slice(0, 2) : [],
    docs: q ? docsList.filter(d => d.title?.toLowerCase().includes(q) || d.code?.toLowerCase().includes(q)).slice(0, 2) : [],
    users: q ? (users || []).filter(u => u.name?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q) || u.code?.toLowerCase().includes(q)).slice(0, 2) : [],
    networks: q ? (networks || []).filter(n => n.name?.toLowerCase().includes(q) || n.code?.toLowerCase().includes(q) || n.type?.toLowerCase().includes(q)).slice(0, 2) : []
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

  const handleItemSelect = (module, tab, searchTerm, item) => {
    if (navigateToTarget) {
      navigateToTarget(module, tab, searchTerm, item);
    } else {
      if (setActiveModule) setActiveModule(module);
      if (setActiveTab) setActiveTab(tab);
    }
    setHeaderQuery('');
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const firstCategory = Object.keys(results).find(k => results[k].length > 0);
      if (firstCategory) {
        const item = results[firstCategory][0];
        if (firstCategory === 'sites') handleItemSelect('sites', 'Site Management', item.name, item);
        else if (firstCategory === 'stations') handleItemSelect('stations', 'Station Management', item.name, item);
        else if (firstCategory === 'assets') handleItemSelect('assets', 'Asset Catalog & Equipment', item.name, item);
        else if (firstCategory === 'workOrders') handleItemSelect('maintenance', 'Work Orders & SLA', item.id, item);
        else if (firstCategory === 'calibrations') handleItemSelect('calibration', 'Drift & Gas Calibration', item.certificateNo, item);
        else if (firstCategory === 'inventory') handleItemSelect('inventory', 'Inventory & Spare Parts', item.name, item);
        else if (firstCategory === 'procurement') handleItemSelect('procurement', 'Procurement & Orders', item.title, item);
        else if (firstCategory === 'contracts') handleItemSelect('contracts', 'Contracts & Warranty', item.title, item);
        else if (firstCategory === 'providers') handleItemSelect('providers', 'Service Providers / Contacts', item.provider, item);
        else if (firstCategory === 'docs') handleItemSelect(item.module, item.tab, item.title, item);
        else if (firstCategory === 'users') handleItemSelect('users', 'User Directory', item.name, item);
        else if (firstCategory === 'networks') handleItemSelect('networks', 'Environmental Networks', item.name, item);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="glass-header" style={{ padding: '12px 24px', position: 'relative', zIndex: 99999, background: '#FFFFFF', borderBottom: '1px solid #CBD5E1', width: '100%' }}>
      <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
        
        {/* Left Side: Mobile Hamburger + Global Live Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', maxWidth: '580px' }}>
          
          <button 
            onClick={toggleMobileMenu}
            className="hamburger-btn"
            style={{ 
              background: '#F1F5F9', 
              border: '1px solid #CBD5E1', 
              color: '#334155', 
              cursor: 'pointer', 
              display: 'none', 
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              flexShrink: 0
            }}
            title="Open Mobile Menu"
          >
            <Menu size={20} />
          </button>

          {/* Active Search Input & Live Suggestion Dropdown */}
          <div 
            ref={searchContainerRef}
            className="header-search-wrapper" 
            style={{ position: 'relative', width: '100%' }}
          >
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00A878', zIndex: 2 }} />
            
            <input 
              ref={inputRef}
              type="text"
              className="input-field header-prominent-search"
              placeholder="Search Sites, Stations, Equipment, Work Orders, Inventory..."
              value={headerQuery}
              onChange={(e) => {
                setHeaderQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (headerQuery.trim()) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              style={{ 
                paddingLeft: '40px', 
                paddingRight: headerQuery ? '36px' : '16px',
                fontSize: '0.86rem', 
                height: '42px', 
                width: '100%', 
                borderRadius: '12px',
                border: isDropdownOpen && headerQuery ? '1.5px solid #00A878' : '1.5px solid rgba(0, 168, 120, 0.35)',
                background: '#F8FAFC',
                boxShadow: '0 2px 8px rgba(0, 168, 120, 0.05)',
                fontWeight: 500
              }}
            />

            {/* Clear Button if query exists */}
            {headerQuery ? (
              <button
                type="button"
                onClick={() => {
                  setHeaderQuery('');
                  setIsDropdownOpen(false);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
                title="Clear Search"
              >
                <X size={16} />
              </button>
            ) : null}

            {/* Live Autocomplete Dropdown Popover */}
            {isDropdownOpen && headerQuery.trim().length > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
                  zIndex: 999999,
                  maxHeight: '440px',
                  overflowY: 'auto',
                  padding: '8px 0',
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                {totalResults === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B' }}>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                      No direct matches for "{headerQuery}"
                    </p>
                    <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
                      Try searching with a different station, asset serial, or work order title
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    
                    {/* 1. SITES */}
                    {results.sites.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#00A878', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={13} /> SITES DIRECTORY ({results.sites.length})
                        </div>
                        {results.sites.map(s => (
                          <div 
                            key={s.id}
                            onClick={() => handleItemSelect('sites', 'Site Management', s.name, s)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{s.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Code: {s.code} • Zone: {s.zone}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#00A878', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Go to Site <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. STATIONS */}
                    {results.stations.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Radio size={13} /> STATIONS ({results.stations.length})
                        </div>
                        {results.stations.map(st => (
                          <div 
                            key={st.id}
                            onClick={() => handleItemSelect('stations', 'Station Management', st.name, st)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{st.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Code: {st.code} • Location: {st.siteName}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#0891B2', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              View Station <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. EQUIPMENT & ASSETS */}
                    {results.assets.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Cpu size={13} /> EQUIPMENT & SENSORS ({results.assets.length})
                        </div>
                        {results.assets.map(a => (
                          <div 
                            key={a.id}
                            onClick={() => handleItemSelect('assets', 'Asset Catalog & Equipment', a.name, a)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{a.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Serial: {a.serialNo} • {a.siteName}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Asset Catalog <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 4. WORK ORDERS */}
                    {results.workOrders.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Wrench size={13} /> WORK ORDERS & SLA ({results.workOrders.length})
                        </div>
                        {results.workOrders.map(w => (
                          <div 
                            key={w.id}
                            onClick={() => handleItemSelect('maintenance', 'Work Orders & SLA', w.id, w)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{w.id}: {w.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Assigned: {w.assignedTo} • Priority: {w.priority}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              View WO <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 5. CALIBRATIONS */}
                    {results.calibrations.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Target size={13} /> DRIFT CALIBRATIONS ({results.calibrations.length})
                        </div>
                        {results.calibrations.map(c => (
                          <div 
                            key={c.id}
                            onClick={() => handleItemSelect('calibration', 'Drift & Gas Calibration', c.certificateNo, c)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{c.certificateNo}: {c.assetName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Location: {c.siteName} • Result: {c.result}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Calibrations <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 6. INVENTORY */}
                    {results.inventory.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Boxes size={13} /> INVENTORY & SPARES ({results.inventory.length})
                        </div>
                        {results.inventory.map(i => (
                          <div 
                            key={i.id}
                            onClick={() => handleItemSelect('inventory', 'Inventory & Spare Parts', i.name, i)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{i.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>SKU: {i.sku} • Stock: {i.quantity} units</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Inventory <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 7. PROCUREMENT */}
                    {results.procurement.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShoppingBag size={13} /> PROCUREMENT ORDERS ({results.procurement.length})
                        </div>
                        {results.procurement.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handleItemSelect('procurement', 'Procurement & Orders', p.title, p)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{p.id}: {p.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Vendor: {p.vendor} • {p.totalAmount}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#EA580C', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Procurement <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 8. CONTRACTS */}
                    {results.contracts.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileCheck size={13} /> CONTRACTS & WARRANTY ({results.contracts.length})
                        </div>
                        {results.contracts.map(c => (
                          <div 
                            key={c.id}
                            onClick={() => handleItemSelect('contracts', 'Contracts & Warranty', c.title, c)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{c.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Vendor: {c.vendor} • Value: {c.value}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Contracts <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 9. SERVICE PROVIDERS */}
                    {results.providers.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Contact size={13} /> SERVICE PROVIDERS ({results.providers.length})
                        </div>
                        {results.providers.map((pr, idx) => (
                          <div 
                            key={idx}
                            onClick={() => handleItemSelect('providers', 'Service Providers / Contacts', pr.provider, pr)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{pr.provider}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Contact: {pr.contactPerson} ({pr.role})</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Contacts <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 10. DOCUMENTS & REPORTS */}
                    {results.docs.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileText size={13} /> SOPS & COMPLIANCE REPORTS ({results.docs.length})
                        </div>
                        {results.docs.map((d, idx) => (
                          <div 
                            key={idx}
                            onClick={() => handleItemSelect(d.module, d.tab, d.title, d)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{d.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Code: {d.code} • Section: {d.tab}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#9333EA', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Open {d.tab} <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 11. USERS */}
                    {results.users.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={13} /> USER DIRECTORY ({results.users.length})
                        </div>
                        {results.users.map(u => (
                          <div 
                            key={u.id}
                            onClick={() => handleItemSelect('users', 'User Directory', u.name, u)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{u.role} • {u.department}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#00A878', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              User Profile <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 12. NETWORKS */}
                    {results.networks.length > 0 && (
                      <div>
                        <div style={{ padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Network size={13} /> ENVIRONMENTAL NETWORKS ({results.networks.length})
                        </div>
                        {results.networks.map(n => (
                          <div 
                            key={n.id}
                            onClick={() => handleItemSelect('networks', 'Environmental Networks', n.name, n)}
                            className="search-item-hover"
                            style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>{n.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Domain: {n.type} • Status: {n.status}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Networks <ArrowRight size={13} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* Popover Footer */}
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 14px', 
                  borderTop: '1px solid #F1F5F9', 
                  background: '#F8FAFC',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '0.72rem',
                  color: '#64748B'
                }}>
                  <span>Click any result to jump to record • Press <strong>ESC</strong> to close</span>
                  <span style={{ fontWeight: 700, color: '#00A878' }}>{totalResults} items found</span>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Right Side: New Work Order CTA + Notifications Bell + Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: 'auto' }}>
          
          <button 
            onClick={() => setIsWoModalOpen && setIsWoModalOpen(true)}
            className="btn btn-epa header-action-btn" 
            style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} /> <span>New Work Order</span>
          </button>

          {/* Dedicated Notifications Button */}
          <button 
            onClick={handleOpenNotifications}
            title="Open Dedicated Notifications Center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <Bell size={20} color="#00A878" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.66rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown />

        </div>

      </div>

      <style>{`
        .search-item-hover:hover {
          background: #F1F5F9;
        }
      `}</style>
    </header>
  );
}
