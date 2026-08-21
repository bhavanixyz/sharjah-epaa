import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, ArrowRight } from 'lucide-react';

export default function NotificationManagement() {
  const { notifications, markNotificationRead, setActiveModule, setSelectedSite, sites } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredNotifs = filterSeverity === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.severity === filterSeverity);

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);

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
      }
    }

    if (targetSiteId) {
      const siteObj = sites.find(s => s.id === targetSiteId);
      if (siteObj) {
        setSelectedSite(siteObj);
      }
    }

    if (targetMod) {
      setActiveModule(targetMod);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>EPA Alarm & Notification Center</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Real-time telemetry threshold alarms, work order dispatches & system broadcast logs</p>
        </div>

        <div className="page-header-actions">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: '#F8FAFC', padding: '4px', borderRadius: '8px', border: '1px solid #E5E7EB', maxWidth: '100%' }}>
            {['ALL', 'critical', 'warning', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: filterSeverity === sev ? '#00A878' : 'transparent',
                  color: filterSeverity === sev ? '#FFFFFF' : '#4B5563'
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifs.map((n) => (
          <div 
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderLeft: n.severity === 'critical' ? '4px solid #DC2626' : n.severity === 'warning' ? '4px solid #D97706' : '4px solid #2563EB',
              background: n.read ? '#FFFFFF' : '#E6F6F2',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
              <div style={{
                padding: '10px',
                borderRadius: '8px',
                flexShrink: 0,
                background: n.severity === 'critical' ? '#FEE2E2' : n.severity === 'warning' ? '#FEF3C7' : '#EFF6FF',
                color: n.severity === 'critical' ? '#DC2626' : n.severity === 'warning' ? '#D97706' : '#2563EB'
              }}>
                <Bell size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1F2937' }}>{n.title}</h4>
                  <span className={`badge ${n.severity === 'critical' ? 'badge-critical' : n.severity === 'warning' ? 'badge-warning' : 'badge-info'}`}>
                    {n.severity}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{n.message}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{n.time}</span>
                  <span style={{ fontSize: '0.72rem', color: '#00A878', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View target details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>

            {!n.read && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  markNotificationRead(n.id);
                }}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.74rem' }}
              >
                <Check size={14} /> Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
