import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Plus, PanelLeftOpen, Menu, MapPin, Cpu, Wrench, Boxes, User, Network, FileText, ArrowRight } from 'lucide-react';

export default function TopHeader() {
  const { 
    searchQuery, 
    setSearchQuery, 
    activeModule,
    setActiveModule,
    networks,
    sites,
    stations,
    assets,
    workOrders,
    inventory,
    procurement,
    users,
    setSelectedSite,
    setSelectedStation,
    notifications, 
    setIsWoModalOpen,
    isNotifDrawerOpen,
    setIsNotifDrawerOpen,
    currentUser,
    markNotificationRead,
    isSidebarCollapsed,
    toggleSidebar,
    toggleMobileMenu
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter Search Suggestions across Enterprise Datasets
  const getSearchResults = (query) => {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search Sites
    sites.forEach(site => {
      if (site.name.toLowerCase().includes(q) || site.code.toLowerCase().includes(q) || site.zone.toLowerCase().includes(q) || site.protectedStatus.toLowerCase().includes(q)) {
        results.push({
          id: site.id,
          category: 'Site',
          icon: MapPin,
          title: site.name,
          subtitle: `Zone: ${site.zone} • ${site.code}`,
          targetModule: 'gis',
          siteObj: site,
          badgeColor: '#00A878'
        });
      }
    });

    // Search Assets
    assets.forEach(ast => {
      if (ast.name.toLowerCase().includes(q) || ast.serialNo.toLowerCase().includes(q) || ast.category.toLowerCase().includes(q) || ast.manufacturer.toLowerCase().includes(q)) {
        const siteObj = sites.find(s => s.id === ast.siteId);
        results.push({
          id: ast.id,
          category: 'Asset',
          icon: Cpu,
          title: ast.name,
          subtitle: `S/N: ${ast.serialNo} • ${ast.siteName}`,
          targetModule: 'assets',
          siteObj,
          badgeColor: '#8B5CF6'
        });
      }
    });

    // Search Work Orders
    workOrders.forEach(wo => {
      if (wo.id.toLowerCase().includes(q) || wo.title.toLowerCase().includes(q) || wo.siteName.toLowerCase().includes(q) || wo.assignedTo.toLowerCase().includes(q)) {
        results.push({
          id: wo.id,
          category: 'Work Order',
          icon: Wrench,
          title: `${wo.id}: ${wo.title}`,
          subtitle: `Site: ${wo.siteName} • Tech: ${wo.assignedTo}`,
          targetModule: 'maintenance',
          badgeColor: '#EF4444'
        });
      }
    });

    // Search Inventory
    inventory.forEach(inv => {
      if (inv.name.toLowerCase().includes(q) || inv.sku.toLowerCase().includes(q) || inv.category.toLowerCase().includes(q)) {
        results.push({
          id: inv.id,
          category: 'Inventory',
          icon: Boxes,
          title: inv.name,
          subtitle: `SKU: ${inv.sku} • Stock: ${inv.quantity} (${inv.status})`,
          targetModule: 'inventory',
          badgeColor: '#F59E0B'
        });
      }
    });

    // Search Networks
    networks.forEach(net => {
      if (net.name.toLowerCase().includes(q) || net.code.toLowerCase().includes(q) || net.type.toLowerCase().includes(q)) {
        results.push({
          id: net.id,
          category: 'Network',
          icon: Network,
          title: net.name,
          subtitle: `Code: ${net.code} • ${net.totalStations} Stations`,
          targetModule: 'networks',
          badgeColor: '#3B82F6'
        });
      }
    });

    // Search Stations
    stations.forEach(stn => {
      if (stn.name.toLowerCase().includes(q) || stn.code.toLowerCase().includes(q) || stn.siteName.toLowerCase().includes(q)) {
        const siteObj = sites.find(s => s.id === stn.siteId);
        results.push({
          id: stn.id,
          category: 'Station',
          icon: MapPin,
          title: stn.name,
          subtitle: `Location: ${stn.siteName} • ${stn.code}`,
          targetModule: 'stations',
          siteObj,
          badgeColor: '#06B6D4'
        });
      }
    });

    // Search Staff
    users.forEach(usr => {
      if (usr.name.toLowerCase().includes(q) || usr.role.toLowerCase().includes(q) || usr.badge.toLowerCase().includes(q)) {
        results.push({
          id: usr.id,
          category: 'Staff User',
          icon: User,
          title: usr.name,
          subtitle: `${usr.role} • Badge: ${usr.badge}`,
          targetModule: 'users',
          badgeColor: '#10B981'
        });
      }
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults(searchQuery);

  // Handle Search Result Click Selection & Navigation
  const handleSelectSearchResult = (result) => {
    if (result.siteObj) {
      setSelectedSite(result.siteObj);
    }
    if (result.stationObj) {
      setSelectedStation(result.stationObj);
    }
    if (result.assetObj) {
      setSelectedAsset(result.assetObj);
    }
    if (result.targetModule) {
      setActiveModule(result.targetModule);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Handle Notification Redirection on Click
  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    setIsNotifDrawerOpen(false);

    let targetMod = n.targetModule;
    let targetSiteId = n.siteId;

    if (!targetMod) {
      const titleLower = n.title.toLowerCase();
      const msgLower = n.message.toLowerCase();

      if (titleLower.includes('khor kalba') || msgLower.includes('khor kalba') || titleLower.includes('alarm')) {
        targetMod = 'gis';
        targetSiteId = 'site-khor-kalba';
      } else if (titleLower.includes('work order') || titleLower.includes('wo-')) {
        targetMod = 'maintenance';
      } else if (titleLower.includes('stock') || msgLower.includes('stock') || titleLower.includes('inventory')) {
        targetMod = 'inventory';
      } else if (titleLower.includes('calibration')) {
        targetMod = 'calibration';
      } else if (titleLower.includes('requisition') || titleLower.includes('pr-')) {
        targetMod = 'procurement';
      } else {
        targetMod = 'notifications';
      }
    }

    if (targetSiteId) {
      const siteObj = sites.find(s => s.id === targetSiteId);
      if (siteObj) {
        setSelectedSite(siteObj);
      }
    }

    setActiveModule(targetMod);
  };

  // Close search and notification dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifDrawerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotifDrawerOpen]);

  return (
    <header className="glass-header" style={{ padding: '12px 18px', position: 'relative', zIndex: 99999 }}>
      <div className="header-container">
        
        {/* Main Header Row */}
        <div className="header-main-row">
          
          {/* Left: Hamburger & Brand Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            
            {/* Mobile & Tablet Hamburger Button */}
            <button 
              onClick={toggleMobileMenu}
              className="hamburger-btn"
              style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                border: '1px solid var(--border-light)', 
                color: '#334155', 
                cursor: 'pointer', 
                display: 'none', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
              title="Open Menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Collapsed Sidebar Toggle */}
            {isSidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="desktop-expand-btn"
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Expand Sidebar"
              >
                <PanelLeftOpen size={20} />
              </button>
            )}

            {/* Mobile Brand Title Badge */}
            <div className="mobile-brand-title" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
              <div style={{ padding: '4px 10px', borderRadius: '8px', background: '#E6F6F2', color: '#00A878', fontWeight: 800, fontSize: '0.82rem', border: '1px solid rgba(0, 168, 120, 0.2)' }}>
                Sharjah EPA
              </div>
            </div>

            {/* Desktop Search Bar with Live Suggestions Dropdown */}
            <div ref={searchRef} className="header-search-wrapper desktop-search-bar" style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00A878' }} />
              <input 
                type="text"
                className="input-field header-prominent-search"
                placeholder="Search sites, assets, work orders, inventory..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                style={{ 
                  paddingLeft: '40px', 
                  paddingRight: '60px',
                  fontSize: '0.86rem', 
                  height: '42px', 
                  width: '100%', 
                  borderRadius: '12px',
                  border: '1.5px solid rgba(0, 168, 120, 0.35)',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 10px rgba(0, 168, 120, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
                  fontWeight: 500
                }}
              />
              <span style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: '#F1F5F9', 
                border: '1px solid #CBD5E1', 
                borderRadius: '6px', 
                padding: '2px 7px', 
                fontSize: '0.66rem', 
                fontWeight: 700, 
                color: '#64748B', 
                pointerEvents: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                ⌘K
              </span>

              {/* Desktop Live Search Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div 
                  className="glass-panel" 
                  style={{
                    position: 'absolute',
                    top: '46px',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
                    border: '1px solid #E2E8F0',
                    zIndex: 9999,
                    maxHeight: '380px',
                    overflowY: 'auto',
                    padding: '8px'
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Suggestions for "{searchQuery}"</span>
                    <span>{searchResults.length} Results</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
                      No matching records found across networks, sites, assets, or work orders.
                    </div>
                  ) : (
                    searchResults.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={`${item.category}-${item.id}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectSearchResult(item);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectSearchResult(item);
                          }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            marginBottom: '4px',
                            background: '#F8FAFC'
                          }}
                          className="search-suggestion-item"
                          onMouseEnter={(e) => e.currentTarget.style.background = '#E6F6F2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                            <div style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: `1px solid ${item.badgeColor}40`,
                              color: item.badgeColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <IconComponent size={15} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${item.badgeColor}15`, color: item.badgeColor }}>
                              {item.category}
                            </span>
                            <ArrowRight size={14} color="#94A3B8" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            
            {/* Create WO Button */}
            <button 
              onClick={() => setIsWoModalOpen(true)}
              className="btn btn-epa header-action-btn" 
              style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> <span className="btn-text">New Work Order</span>
            </button>

            {/* Notifications Trigger */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid var(--border-light)',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <Bell size={18} />
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
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {isNotifDrawerOpen && (
                <div className="glass-panel notif-dropdown" style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  width: '350px',
                  maxWidth: '90vw',
                  zIndex: 999999,
                  padding: '16px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22), 0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Alerts & Notifications</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{unreadCount} Unread</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNotificationClick(n);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNotificationClick(n);
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: n.read ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 168, 120, 0.08)',
                          border: n.read ? '1px solid #F1F5F9' : '1px solid rgba(0, 168, 120, 0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="notification-item-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: n.severity === 'critical' ? '#DC2626' : '#0F172A' }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#94A3B8', flexShrink: 0, marginLeft: '6px' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: '1.4' }}>{n.message}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#00A878', fontWeight: 700, marginTop: '6px' }}>
                          Click to view details <ArrowRight size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid rgba(226, 232, 240, 0.8)' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #00A878', boxShadow: '0 2px 8px rgba(0,168,120,0.2)' }}
              />
              <div className="user-profile-text">
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#00A878', fontWeight: 700, whiteSpace: 'nowrap' }}>{currentUser.role}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Dedicated Full-Width Mobile Search Bar Row */}
        <div className="mobile-search-row">
          <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              className="input-field"
              placeholder="Search sites, assets, work orders, inventory..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              style={{ paddingLeft: '36px', fontSize: '0.84rem', height: '40px', width: '100%', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #CBD5E1' }}
            />

            {/* Mobile Live Search Suggestions Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div 
                className="glass-panel" 
                style={{
                  position: 'absolute',
                  top: '46px',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.22)',
                  border: '1px solid #E2E8F0',
                  zIndex: 9999,
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '8px'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Suggestions for "{searchQuery}"</span>
                  <span>{searchResults.length} Results</span>
                </div>

                {searchResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
                    No matching records found.
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={`mob-${item.category}-${item.id}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectSearchResult(item);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectSearchResult(item);
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          marginBottom: '4px',
                          background: '#F8FAFC'
                        }}
                        className="search-suggestion-item"
                        onMouseEnter={(e) => e.currentTarget.style.background = '#E6F6F2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <div style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            border: `1px solid ${item.badgeColor}40`,
                            color: item.badgeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconComponent size={15} />
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${item.badgeColor}15`, color: item.badgeColor }}>
                            {item.category}
                          </span>
                          <ArrowRight size={14} color="#94A3B8" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

