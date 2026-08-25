import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function TopHeader({ onOpenSearch }) {
  const { 
    setActiveModule,
    setActiveTab,
    notifications, 
    setIsWoModalOpen,
    isNotifDrawerOpen,
    setIsNotifDrawerOpen,
    toggleMobileMenu
  } = useApp();

  const unreadCount = notifications ? notifications.filter(n => !n.read && !n.isRead).length : 0;

  const handleOpenNotifications = (e) => {
    e?.stopPropagation();
    if (setIsNotifDrawerOpen) {
      setIsNotifDrawerOpen(prev => !prev);
    }
  };

  return (
    <header className="glass-header" style={{ padding: '12px 24px', position: 'relative', zIndex: 99999, background: '#FFFFFF', borderBottom: '1px solid #CBD5E1', width: '100%' }}>
      <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
        
        {/* Left Side: Mobile Hamburger + Global Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', maxWidth: '520px' }}>
          
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

          {/* Search Input Trigger (Ctrl + F) */}
          <div 
            onClick={onOpenSearch}
            className="header-search-wrapper" 
            style={{ position: 'relative', width: '100%', cursor: 'pointer' }}
          >
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00A878' }} />
            <input 
              type="text"
              readOnly
              className="input-field header-prominent-search"
              placeholder="Global Search (Ctrl + F across Sites, Equipment, WOs, Inventory...)"
              style={{ 
                paddingLeft: '40px', 
                paddingRight: '80px',
                fontSize: '0.86rem', 
                height: '42px', 
                width: '100%', 
                borderRadius: '12px',
                border: '1.5px solid rgba(0, 168, 120, 0.35)',
                background: '#F8FAFC',
                boxShadow: '0 2px 8px rgba(0, 168, 120, 0.05)',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            />
            <span style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: '#FFFFFF', 
              border: '1px solid #CBD5E1', 
              borderRadius: '6px', 
              padding: '2px 8px', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: '#00A878'
            }}>
              Ctrl + F
            </span>
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
    </header>
  );
}
