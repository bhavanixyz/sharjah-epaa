import React, { useState } from 'react';
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
  Bell, 
  BarChart3, 
  Users, 
  Shield, 
  Settings, 
  ShieldCheck, 
  Trees, 
  ChevronUp,
  ChevronDown, 
  PanelLeftClose, 
  PanelLeftOpen,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { 
    activeModule, 
    setActiveModule, 
    workOrders, 
    notifications, 
    isSidebarCollapsed, 
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  // Core Operations ('operations') is open by default; single-open accordion behavior
  const [openGroupKey, setOpenGroupKey] = useState('operations');

  const toggleGroup = (groupKey) => {
    setOpenGroupKey(prev => prev === groupKey ? null : groupKey);
  };

  const handleModuleSelect = (id) => {
    setActiveModule(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const openTicketsCount = workOrders.filter(w => w.status === 'Open' || w.status === 'In Progress').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navGroups = [
    {
      key: 'operations',
      group: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'gis', label: 'GIS Command Center', icon: Map, badge: 'Live' },
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
        { id: 'maintenance', label: 'Work Orders & SLA', icon: Wrench, count: openTicketsCount },
        { id: 'calibration', label: 'Drift & Gas Calibration', icon: Target },
        { id: 'inventory', label: 'Inventory & Spare Parts', icon: Boxes },
        { id: 'procurement', label: 'Procurement & Orders', icon: ShoppingBag },
        { id: 'contracts', label: 'Contracts & Warranty', icon: FileCheck }
      ]
    },
    {
      key: 'governance',
      group: 'Governance & Admin',
      items: [
        { id: 'documents', label: 'Document SOPs', icon: FileText },
        { id: 'notifications', label: 'Alarm & Notifications', icon: Bell, count: unreadNotifCount },
        { id: 'reports', label: 'EPA Compliance Reports', icon: BarChart3 },
        { id: 'users', label: 'User Directory', icon: Users },
        { id: 'roles', label: 'Role & RBAC Matrix', icon: Shield },
        { id: 'config', label: 'System Configuration', icon: Settings },
        { id: 'audit', label: 'Security Audit Trail', icon: ShieldCheck }
      ]
    }
  ];

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
        width: isSidebarCollapsed ? '72px' : '265px',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)'
      }}>
        
        {/* Dark Brand Header */}
        <div style={{
          padding: isSidebarCollapsed ? '16px 12px' : '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00A878 0%, #0DBA8B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0, 168, 120, 0.4)',
              flexShrink: 0
            }}>
              <Trees size={22} />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                  Sharjah EPA
                </h1>
                <p style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 700, letterSpacing: '0.02em' }}>
                  Command Platform
                </p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          {!isSidebarCollapsed && (
            <button 
              onClick={toggleSidebar}
              className="desktop-toggle-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}

          {/* Mobile Close X Button */}
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
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dark Navigation Group Items */}
        <div style={{ flex: 1, padding: isSidebarCollapsed ? '12px 8px' : '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navGroups.map((group) => {
            const isGroupOpen = openGroupKey === group.key;

            return (
              <div key={group.key}>
                {!isSidebarCollapsed ? (
                  <>
                    {/* Group Header Accordion Button */}
                    <div 
                      onClick={() => toggleGroup(group.key)}
                      style={{
                        fontSize: '13px',
                        fontWeight: isGroupOpen ? 700 : 500,
                        color: isGroupOpen ? '#34D399' : '#CBD5E1',
                        marginBottom: '6px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                        background: isGroupOpen ? 'rgba(52, 211, 153, 0.12)' : 'transparent'
                      }}
                    >
                      <span>{group.group}</span>
                      {isGroupOpen ? (
                        <ChevronUp size={16} color="#34D399" />
                      ) : (
                        <ChevronDown size={16} color="#64748B" />
                      )}
                    </div>

                    {/* Sub-Items List with Left Vertical Trunk Line */}
                    {isGroupOpen && (
                      <div style={{
                        paddingLeft: '18px',
                        marginLeft: '14px',
                        borderLeft: '2px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
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
                                padding: '7px 10px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: isActive ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                background: isActive ? 'linear-gradient(90deg, rgba(0, 168, 120, 0.3) 0%, rgba(0, 168, 120, 0.15) 100%)' : 'transparent',
                                color: isActive ? '#FFFFFF' : '#94A3B8',
                                borderLeft: isActive ? '3px solid #00A878' : '3px solid transparent'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Icon size={15} color={isActive ? '#34D399' : '#64748B'} />
                                <span>{item.label}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {item.badge && (
                                  <span className="badge badge-normal" style={{ fontSize: '0.58rem', padding: '1px 5px', background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                                    {item.badge}
                                  </span>
                                )}

                                {item.count > 0 && (
                                  <span style={{
                                    background: item.id === 'notifications' ? '#2563EB' : '#EF4444',
                                    color: '#FFFFFF',
                                    fontSize: '0.64rem',
                                    fontWeight: 800,
                                    padding: '2px 6px',
                                    borderRadius: '10px'
                                  }}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
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
                          onClick={() => {
                            handleModuleSelect(item.id);
                            setOpenGroupKey(group.key);
                          }}
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

        {/* Dark Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between'
        }}>
          {isSidebarCollapsed ? (
            <button 
              onClick={toggleSidebar}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              title="Expand Sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          ) : (
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>EPA Telemetry Engine</div>
              <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 700 }}>● Connected (v5.0)</div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
