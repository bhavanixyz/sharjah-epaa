import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  MapPin,
  Wrench,
  Cpu,
  Target,
  Boxes,
  FileCheck
} from 'lucide-react';

export default function NotificationDrawer() {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearAllNotifications,
    isNotifDrawerOpen, 
    setIsNotifDrawerOpen,
    setActiveModule,
    setActiveTab,
    sites,
    setSelectedSite,
    assets,
    setSelectedAsset
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isNotifDrawerOpen) return null;

  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;
  const criticalCount = notifications.filter(n => n.severity === 'critical').length;
  const warningCount = notifications.filter(n => n.severity === 'warning').length;
  const infoCount = notifications.filter(n => n.severity === 'info' || n.severity === 'normal').length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'CRITICAL') return n.severity === 'critical';
    if (activeFilter === 'WARNING') return n.severity === 'warning';
    if (activeFilter === 'INFO') return n.severity === 'info' || n.severity === 'normal';
    return true;
  });

  const moduleTabMap = {
    'dashboard': 'Dashboard',
    'gis': 'Map',
    'networks': 'Environmental Networks',
    'sites': 'Site Management',
    'stations': 'Live Site Management',
    'assets': 'Equipment Management',
    'providers': 'Service Providers / Contacts',
    'maintenance': 'Work Orders & SLA',
    'calibration': 'Drift & Gas Calibration',
    'inventory': 'Inventory & Spare Parts',
    'procurement': 'Procurement & Orders',
    'contracts': 'Contracts & Warranty',
    'documents': 'Document SOPs',
    'reports': 'EPA Compliance Reports'
  };

  const handleNotificationClick = (item) => {
    // 1. Mark as read
    markNotificationRead(item.id);

    // 2. Redirect to site context if siteId is present
    if (item.siteId && sites && setSelectedSite) {
      const targetSite = sites.find(s => s.id === item.siteId);
      if (targetSite) {
        setSelectedSite(targetSite);
      }
    }

    // 3. Redirect to asset context if assetId is present
    if (item.assetId && assets && setSelectedAsset) {
      const targetAsset = assets.find(a => a.id === item.assetId);
      if (targetAsset) {
        setSelectedAsset(targetAsset);
      }
    }

    // 4. Redirect to respective module & tab
    const mod = item.targetModule || 'dashboard';
    const tabName = moduleTabMap[mod] || 'Dashboard';

    if (setActiveTab) setActiveTab(tabName);
    if (setActiveModule) setActiveModule(mod);

    // 5. Close notification panel
    setIsNotifDrawerOpen(false);
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          iconColor: '#EF4444',
          badgeBg: '#EF4444',
          badgeText: '#FFFFFF',
          label: 'CRITICAL ALARM',
          IconComponent: AlertOctagon
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          iconColor: '#D97706',
          badgeBg: '#F59E0B',
          badgeText: '#FFFFFF',
          label: 'WARNING',
          IconComponent: AlertTriangle
        };
      default:
        return {
          bg: '#F0FDF4',
          border: '#BBF7D0',
          iconColor: '#00A878',
          badgeBg: '#00A878',
          badgeText: '#FFFFFF',
          label: 'SYSTEM INFO',
          IconComponent: Info
        };
    }
  };

  const getModuleIcon = (mod) => {
    switch (mod) {
      case 'gis': return MapPin;
      case 'maintenance': return Wrench;
      case 'assets': return Cpu;
      case 'calibration': return Target;
      case 'inventory': return Boxes;
      case 'contracts': return FileCheck;
      default: return Bell;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsNotifDrawerOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 999990,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Sliding Right Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '450px',
          maxWidth: '92vw',
          background: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.18)',
          zIndex: 999995,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '1px solid #E2E8F0'
        }}
      >
        {/* Drawer Header */}
        <div 
          style={{ 
            padding: '20px 24px', 
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="#00A878" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                Notifications & Alerts
              </h2>
              {unreadCount > 0 && (
                <span 
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  {unreadCount} New
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.76rem', color: '#F1F5F9', margin: '4px 0 0 0', opacity: 0.9 }}>
              Live Telemetry Alarms & Operational Events
            </p>
          </div>

          <button 
            onClick={() => setIsNotifDrawerOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Close Panel"
          >
            <X size={18} color="#FFFFFF" />
          </button>
        </div>

        {/* Action Controls Toolbar & Filter Tabs */}
        <div style={{ padding: '14px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Top Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
              Showing {filteredNotifications.length} items
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#00A878',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <CheckCheck size={14} /> Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Trash2 size={14} /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'ALL', label: `All (${notifications.length})` },
              { id: 'CRITICAL', label: `Critical (${criticalCount})` },
              { id: 'WARNING', label: `Warning (${warningCount})` },
              { id: 'INFO', label: `Info (${infoCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeFilter === tab.id ? '#0F172A' : '#E2E8F0',
                  color: activeFilter === tab.id ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Notifications List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
              <CheckCircle2 size={48} color="#00A878" style={{ opacity: 0.6, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
                All Clear!
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                No active notifications or telemetry alarms match your selected filter.
              </p>
            </div>
          ) : (
            filteredNotifications.map(item => {
              const severityMeta = getSeverityStyle(item.severity);
              const SeverityIcon = severityMeta.IconComponent;
              const ModuleIcon = getModuleIcon(item.targetModule);
              const isUnread = !item.read && !item.isRead;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className="notif-card-hover"
                  style={{
                    position: 'relative',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isUnread ? severityMeta.bg : '#FFFFFF',
                    border: `1px solid ${isUnread ? severityMeta.border : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isUnread ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  {/* Unread Glowing Dot */}
                  {isUnread && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: severityMeta.iconColor,
                        boxShadow: `0 0 8px ${severityMeta.iconColor}`
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    
                    {/* Severity Icon Badge */}
                    <div 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        background: '#FFFFFF',
                        border: `1px solid ${severityMeta.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <SeverityIcon size={20} color={severityMeta.iconColor} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      
                      {/* Top Header: Badge & Time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span 
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: severityMeta.badgeBg,
                            color: severityMeta.badgeText,
                            letterSpacing: '0.5px'
                          }}
                        >
                          {severityMeta.label}
                        </span>

                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                          <Clock size={12} /> {item.time}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 
                        style={{ 
                          fontSize: '0.88rem', 
                          fontWeight: isUnread ? 800 : 700, 
                          color: '#0F172A', 
                          margin: '0 0 4px 0',
                          lineHeight: '1.3'
                        }}
                      >
                        {item.title}
                      </h4>

                      {/* Message Body */}
                      <p 
                        style={{ 
                          fontSize: '0.78rem', 
                          color: '#475569', 
                          margin: '0 0 10px 0', 
                          lineHeight: '1.4' 
                        }}
                      >
                        {item.message}
                      </p>

                      {/* Bottom Footer Action Hint */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px stroke #CBD5E1', paddingTop: '6px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00A878', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ModuleIcon size={13} /> {moduleTabMap[item.targetModule] || 'View Detail'}
                        </span>
                        
                        <span className="redirect-hint" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Open Page <ExternalLink size={12} />
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '14px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
            Sharjah EPA Notification Dispatcher
          </span>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('Notifications');
              if (setActiveModule) setActiveModule('notifications');
              setIsNotifDrawerOpen(false);
            }}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Notification Center <ExternalLink size={13} />
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .notif-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
          border-color: #00A878 !important;
        }
      `}</style>
    </>
  );
}
