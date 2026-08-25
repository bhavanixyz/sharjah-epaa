import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock } from 'lucide-react';

export default function PageHeaderBar() {
  const { 
    activeModule, 
    activeTab,
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = useApp();

  const lastUpdatedText = `24 Aug 2026, 16:40`;

  // Compute Page Title dynamically based on active selection (matches navigation label)
  const getPageTitle = () => {
    const titleMap = {
      'dashboard': 'Executive Dashboard',
      'gis': 'GIS Command Center',
      'networks': 'Environmental Networks',
      'sites': 'Site Management',
      'stations': 'Station Management',
      'assets': 'Asset Catalog & Equipment',
      'providers': 'Service Providers / Contacts',
      'maintenance': 'Work Orders & SLA',
      'calibration': 'Drift & Gas Calibration',
      'inventory': 'Inventory & Spare Parts',
      'procurement': 'Procurement & Orders',
      'contracts': 'Contracts & Warranty',
      'documents': 'Document SOPs',
      'reports': 'EPA Compliance Reports',
      'notifications': 'Notification Center',
      'users': 'User Directory',
      'roles': 'Role & RBAC Matrix',
      'audit': 'Security Audit Trail'
    };

    if (titleMap[activeModule]) {
      return titleMap[activeModule];
    }

    if (activeTab && activeTab !== 'Admin' && activeTab !== 'Dashboard') {
      return activeTab;
    }

    return 'Executive Dashboard';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginBottom: '6px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        
        {/* Left: Standardized Bold Page Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em', margin: 0 }}>
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Aligned Controls: 1. Last Updated Timestamp + 2. Date Range Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
          
          {/* 1. Last Updated Information (SINGLE LINE) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
            <Clock size={15} color="#00A878" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: '#334155' }}>Last updated:</span>
            <span style={{ color: '#64748B', fontWeight: 500 }}>{lastUpdatedText}</span>
          </div>

          {/* 2. Date Range Filter Dropdown with 36px right padding */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '8px 36px 8px 16px',
              paddingRight: '36px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              minWidth: '140px'
            }}
          >
            <option value="7D">Last 7 Days</option>
            <option value="15D">Last 15 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="CUSTOM">Custom Range</option>
          </select>

        </div>
      </div>

      {/* Render Custom Date Picker UNDER the dropdown when 'CUSTOM' is selected */}
      {dateFilter === 'CUSTOM' && (
        <div style={{ 
          display: 'flex', 
          justify: 'flex-end', 
          alignItems: 'center', 
          gap: '10px', 
          fontSize: '0.78rem',
          paddingTop: '10px',
          borderTop: '1px dashed #E2E8F0',
          width: '100%'
        }}>
          <span style={{ fontWeight: 600, color: '#475569' }}>Select Custom Dates:</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }} />
          <span>to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }} />
          <button onClick={() => alert('Custom date range applied.')} className="btn btn-epa" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
            Apply
          </button>
        </div>
      )}

    </div>
  );
}
