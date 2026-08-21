import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Plus, PanelLeftOpen, Menu } from 'lucide-react';

export default function TopHeader() {
  const { 
    searchQuery, 
    setSearchQuery, 
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="glass-header" style={{ padding: '12px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Left: Mobile Hamburger & Sidebar Toggle & Global Search Bar */}
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

          {/* Search Bar (Responsive) */}
          <div className="header-search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              className="input-field"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.82rem', height: '38px', width: '100%' }}
            />
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
          <div style={{ position: 'relative' }}>
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
                width: '320px',
                maxWidth: '90vw',
                zIndex: 1000,
                padding: '16px',
                boxShadow: 'var(--shadow-glass-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Alerts & Notifications</h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{unreadCount} Unread</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: n.read ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 168, 120, 0.08)',
                        border: n.read ? '1px solid #F1F5F9' : '1px solid rgba(0, 168, 120, 0.25)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: n.severity === 'critical' ? '#DC2626' : '#0F172A' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: '1.4' }}>{n.message}</p>
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
    </header>
  );
}
