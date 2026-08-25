import React, { useState } from 'react';
import { Bell, Search, Filter, CheckCircle2, AlertTriangle, Info, Clock, Check, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationsPage() {
  const { notifications, setNotifications, setActiveModule } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterModule, setFilterModule] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, UNREAD, READ

  // Initial Sample Notifications if context is empty
  const initialData = notifications && notifications.length > 0 ? notifications : [
    { id: 'notif-1', title: 'PM2.5 Sensor Threshold Exceeded', desc: 'Sharjah Industrial Zone 3 station logged PM2.5 at 145 µg/m³ (exceeding EPA limit of 50 µg/m³).', module: 'Live Site Management', date: '2026-08-24 14:22', priority: 'HIGH', type: 'ALERT', isRead: false },
    { id: 'notif-2', title: 'SO2 Gas Analyzer Calibration Overdue', desc: 'Teledyne T100 SO2 analyzer at Khorfakkan Harbor has exceeded its 30-day calibration window.', module: 'Drift & Gas Calibration', date: '2026-08-24 11:05', priority: 'CRITICAL', type: 'WARNING', isRead: false },
    { id: 'notif-3', title: 'Work Order SLA Closure Sign-off Needed', desc: 'Work Order WO-2026-089 (Solar Battery Replacement) marked completed by technician Eng. Rashid.', module: 'Work Orders & SLA', date: '2026-08-24 09:40', priority: 'MEDIUM', type: 'ACTION', isRead: true },
    { id: 'notif-4', title: 'PTFE Filter Reorder Safety Threshold Hit', desc: 'Central Depot stock for 47mm PTFE Membrane Filters dropped below safety threshold (8 units remaining).', module: 'Inventory & Spare Parts', date: '2026-08-23 16:50', priority: 'HIGH', type: 'INVENTORY', isRead: true },
    { id: 'notif-5', title: 'Annual Marine AMC Renewal Pending', desc: 'Vendor AMC contract with YSI Xylem for Marine Water Quality Buoys expires in 14 days.', module: 'Contracts & Warranty', date: '2026-08-23 10:15', priority: 'LOW', type: 'CONTRACT', isRead: true },
    { id: 'notif-6', title: 'ISO 17025 Audit Trail Export Generated', desc: 'System security audit log for Q3 2026 successfully compiled and archived.', module: 'Security Audit Trail', date: '2026-08-22 18:30', priority: 'INFO', type: 'SYSTEM', isRead: true }
  ];

  const [items, setItems] = useState(initialData);

  const handleMarkAllRead = () => {
    setItems(items.map(item => ({ ...item, isRead: true })));
  };

  const handleToggleRead = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, isRead: !item.isRead } : item));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.module.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterPriority !== 'ALL' && item.priority !== filterPriority) return false;
    if (filterModule !== 'ALL' && item.module !== filterModule) return false;
    if (filterStatus === 'UNREAD' && item.isRead) return false;
    if (filterStatus === 'READ' && !item.isRead) return false;

    return true;
  });

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filter & Controls Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search notification title, module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '0.8rem', height: '36px' }}
          />
        </div>

        {/* Filters & Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="chart-dropdown-select"
            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
          >
            <option value="ALL">All Statuses (Read & Unread)</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="chart-dropdown-select"
            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <button onClick={handleMarkAllRead} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
            <Check size={14} /> Mark All as Read
          </button>
        </div>

      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
            <Bell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>No notifications found</h3>
            <p style={{ fontSize: '0.8rem' }}>There are no notifications matching your search or filter parameters.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                borderLeft: `5px solid ${
                  item.priority === 'CRITICAL' ? '#DC2626' :
                  item.priority === 'HIGH' ? '#D97706' :
                  item.priority === 'MEDIUM' ? '#2563EB' : '#00A878'
                }`,
                background: item.isRead ? '#FFFFFF' : 'rgba(0, 168, 120, 0.03)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  {!item.isRead && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A878' }} />
                  )}
                  <span className={`badge ${
                    item.priority === 'CRITICAL' ? 'badge-critical' :
                    item.priority === 'HIGH' ? 'badge-degraded' : 'badge-info'
                  }`}>
                    {item.priority}
                  </span>

                  <span className="badge badge-blue">{item.module}</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.date}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setActiveModule?.('dashboard')}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View Module <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => handleToggleRead(item.id)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                  title={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <Check size={14} color={item.isRead ? '#00A878' : '#94A3B8'} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.76rem', color: '#DC2626' }}
                  title="Delete Notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
