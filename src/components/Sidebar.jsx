import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Map, 
  Network, 
  Building2, 
  Radio, 
  Cpu, 
  Wrench, 
  Target, 
  Boxes, 
  ShoppingBag, 
  FileCheck, 
  FileText, 
  BarChart3, 
  Contact,
  Bell,
  Users,
  Shield,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronUp,
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

import logoImg from '../assets/LOGO.new.png';
import logoCollapseImg from '../assets/Logo collapse.png';

export default function Sidebar() {
  const { 
    activeModule, 
    setActiveModule, 
    isSidebarCollapsed, 
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setActiveTab
  } = useApp();

  // Single open group key ('operations', 'maintenance', or 'governance')
  // Default to 'operations'
  const [openGroupKey, setOpenGroupKey] = useState('operations');

  const navGroups = [
    {
      key: 'operations',
      group: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'gis', label: 'GIS Command Center', icon: Map },
        { id: 'networks', label: 'Environmental Networks', icon: Network },
        { id: 'sites', label: 'Site Management', icon: Building2 },
        { id: 'stations', label: 'Station Management', icon: Radio },
        { id: 'assets', label: 'Asset Catalog & Equipment', icon: Cpu }
      ]
    },
    {
      key: 'maintenance',
      group: 'Maintenance & Procurement',
      items: [
        { id: 'maintenance', label: 'Work Orders & SLA', icon: Wrench, badge: '3', badgeType: 'count-red' },
        { id: 'calibration', label: 'Drift & Gas Calibration', icon: Target },
        { id: 'inventory', label: 'Inventory & Spare Parts', icon: Boxes },
        { id: 'procurement', label: 'Procurement & Orders', icon: ShoppingBag },
        { id: 'contracts', label: 'Contracts & Warranty', icon: FileCheck },
        { id: 'providers', label: 'Service Providers / Contacts', icon: Contact }
      ]
    },
    {
      key: 'admin',
      group: 'Admin',
      items: [
        { id: 'documents', label: 'Document SOPs', icon: FileText },
        { id: 'reports', label: 'EPA Compliance Reports', icon: BarChart3 },
        { id: 'users', label: 'User Directory', icon: Users },
        { id: 'roles', label: 'Role & RBAC Matrix', icon: Shield },
        { id: 'audit', label: 'Security Audit Trail', icon: ShieldCheck }
      ]
    }
  ];

  // Auto sync open group key when activeModule changes externally
  useEffect(() => {
    if (!activeModule) return;
    const parentGroup = navGroups.find(g => g.items.some(i => i.id === activeModule));
    if (parentGroup && parentGroup.key !== openGroupKey) {
      setOpenGroupKey(parentGroup.key);
    }
  }, [activeModule]);

  // Requirement 1 & 3:
  // 1. Single dropdown open at a time (opening one closes others)
  // 3. When category dropdown is opened, select first item as default
  const toggleGroup = (group) => {
    const isOpening = openGroupKey !== group.key;
    const nextKey = isOpening ? group.key : null;
    setOpenGroupKey(nextKey);

    if (isOpening && group.items && group.items.length > 0) {
      handleModuleSelect(group.items[0].id);
    }
  };

  const handleModuleSelect = (id) => {
    const tabMap = {
      'dashboard': 'Executive Dashboard',
      'gis': 'GIS Command Center',
      'networks': 'Environmental Networks',
      'sites': 'Site Management',
      'stations': 'Station Management',
      'assets': 'Asset Catalog & Equipment',
      'maintenance': 'Work Orders & SLA',
      'calibration': 'Drift & Gas Calibration',
      'inventory': 'Inventory & Spare Parts',
      'procurement': 'Procurement & Orders',
      'contracts': 'Contracts & Warranty',
      'providers': 'Service Providers / Contacts',
      'documents': 'Document SOPs',
      'notifications': 'Notification Center',
      'reports': 'EPA Compliance Reports',
      'users': 'User Directory',
      'roles': 'Role & RBAC Matrix',
      'audit': 'Security Audit Trail'
    };

    const targetTab = tabMap[id] || 'Dashboard';
    if (setActiveTab) setActiveTab(targetTab);
    if (setActiveModule) setActiveModule(id);

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignOut = () => {
    alert('Successfully signed out of Sharjah EPAA Enterprise Session.');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="mobile-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 998
          }}
        />
      )}

      <aside className={`sidebar-container ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isSidebarCollapsed ? '72px' : '272px',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)'
      }}>
        
        {/* Expand/Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="desktop-sidebar-edge-toggle"
          title={isSidebarCollapsed ? "Expand Navigation Bar" : "Collapse Navigation Bar"}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-15px',
            transform: 'translateY(-50%)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#1E293B',
            border: '1.5px solid rgba(0, 168, 120, 0.6)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 168, 120, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1001,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={18} color="#34D399" />
          ) : (
            <ChevronLeft size={18} color="#34D399" />
          )}
        </button>

        {/* Brand Header with Dynamic Logos */}
        <div style={{
          padding: isSidebarCollapsed ? '16px 8px' : '16px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
            <img 
              src={isSidebarCollapsed ? logoCollapseImg : logoImg} 
              alt="Sharjah EPAA Logo" 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: isSidebarCollapsed ? '44px' : '64px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0, 168, 120, 0.3))',
                transition: 'all 0.25s ease'
              }}
            />
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-close-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#F8FAFC',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="sidebar-scroll-content" style={{ flex: 1, padding: isSidebarCollapsed ? '12px 8px' : '16px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navGroups.map((group) => {
            const isGroupOpen = openGroupKey === group.key;

            return (
              <div key={group.key}>
                {!isSidebarCollapsed ? (
                  <>
                    {/* Category Header Accordion */}
                    <div 
                      onClick={() => toggleGroup(group)}
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#34D399',
                        marginBottom: '6px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                        background: isGroupOpen ? 'rgba(0, 168, 120, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ whiteSpace: 'nowrap' }}>{group.group}</span>
                      {isGroupOpen ? (
                        <ChevronUp size={16} color="#34D399" />
                      ) : (
                        <ChevronDown size={16} color="#64748B" />
                      )}
                    </div>

                    {/* Sub-Items List */}
                    {isGroupOpen && (
                      <div style={{
                        paddingLeft: '10px',
                        marginLeft: '8px',
                        borderLeft: '2px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px'
                      }}>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeModule === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleModuleSelect(item.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '8px 10px',
                                minHeight: '36px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.8rem',
                                fontWeight: isActive ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                background: isActive ? 'linear-gradient(90deg, rgba(0, 168, 120, 0.35) 0%, rgba(0, 168, 120, 0.12) 100%)' : 'transparent',
                                color: isActive ? '#FFFFFF' : '#CBD5E1',
                                borderLeft: isActive ? '3px solid #00A878' : '3px solid transparent',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                <Icon size={16} color={isActive ? '#34D399' : '#94A3B8'} style={{ flexShrink: 0 }} />
                                <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.label}</span>
                              </div>

                              {/* Notification / Status Badges */}
                              {item.badge && (
                                <div style={{ marginLeft: '6px', flexShrink: 0 }}>
                                  {item.badgeType === 'count-red' && (
                                    <span style={{ 
                                      background: '#EF4444', 
                                      color: '#FFFFFF', 
                                      borderRadius: '50%', 
                                      width: '18px', 
                                      height: '18px', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      fontSize: '0.68rem', 
                                      fontWeight: 800 
                                    }}>
                                      {item.badge}
                                    </span>
                                  )}
                                  {item.badgeType === 'count-blue' && (
                                    <span style={{ 
                                      background: '#3B82F6', 
                                      color: '#FFFFFF', 
                                      borderRadius: '50%', 
                                      width: '18px', 
                                      height: '18px', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      fontSize: '0.68rem', 
                                      fontWeight: 800 
                                    }}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* Compact Collapsed Icon View */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleModuleSelect(item.id)}
                          title={item.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(0, 168, 120, 0.3)' : 'transparent',
                            color: isActive ? '#34D399' : '#64748B'
                          }}
                        >
                          <Icon size={18} color={isActive ? '#34D399' : '#64748B'} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with Sign Out Action Button */}
        <div style={{
          padding: isSidebarCollapsed ? '12px 8px' : '12px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              background: 'rgba(220, 38, 38, 0.1)',
              color: '#F87171',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Sign Out of EPA Session"
          >
            <LogOut size={16} color="#F87171" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>

      </aside>
    </>
  );
}
