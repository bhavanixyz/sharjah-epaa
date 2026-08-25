import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, ChevronDown, Check, ArrowRight } from 'lucide-react';

export default function PageHeaderBar() {
  const { 
    activeModule, 
    activeTab,
    dateFilter, 
    setDateFilter, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate,
    getDateRangeLabel
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate || '2026-08-25');
  const [localEnd, setLocalEnd] = useState(endDate || '2026-08-25');
  const [showCustomFields, setShowCustomFields] = useState(dateFilter === 'CUSTOM');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lastUpdatedText = `25 Aug 2026, 12:00`;

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

    if (titleMap[activeModule]) return titleMap[activeModule];
    if (activeTab && activeTab !== 'Admin' && activeTab !== 'Dashboard') return activeTab;
    return 'Executive Dashboard';
  };

  const getDisplayLabel = () => {
    switch (dateFilter) {
      case 'TODAY': return 'Today';
      case '7D': return 'Last 7 Days';
      case '15D': return 'Last 15 Days';
      case '30D': return 'Last 30 Days';
      case 'ALL': return 'All Time';
      case 'CUSTOM': return startDate && endDate ? `${startDate} to ${endDate}` : 'Custom Range';
      default: return 'Today';
    }
  };

  const handleSelectOption = (key) => {
    if (key === 'CUSTOM') {
      setShowCustomFields(true);
    } else {
      setShowCustomFields(false);
      setDateFilter(key);
      setIsDropdownOpen(false);
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (localStart && localEnd) {
      setStartDate(localStart);
      setEndDate(localEnd);
      setDateFilter('CUSTOM');
      setIsDropdownOpen(false);
    }
  };

  const filterOptions = [
    { key: 'TODAY', label: 'Today' },
    { key: '7D', label: 'Last 7 Days' },
    { key: '15D', label: 'Last 15 Days' },
    { key: '30D', label: 'Last 30 Days' },
    { key: 'ALL', label: 'All Time' },
    { key: 'CUSTOM', label: 'Custom Range' }
  ];

  // Modules where the common date filter is strictly applicable
  const DATE_FILTER_APPLICABLE_MODULES = [
    'dashboard',
    'networks',
    'sites',
    'stations',
    'assets',
    'maintenance',
    'calibration',
    'inventory',
    'procurement',
    'contracts',
    'providers',
    'documents',
    'reports',
    'notifications',
    'users',
    'audit'
  ];

  const isDateFilterApplicable = DATE_FILTER_APPLICABLE_MODULES.includes(activeModule);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '4px', position: 'relative', zIndex: 900 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        
        {/* Left: Standardized Bold Page Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em', margin: 0 }}>
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Aligned Controls: Last Updated Timestamp + Optional Date Range Popover Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          
          {/* Last Updated Information (SINGLE LINE) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
            <Clock size={15} color="#00A878" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: '#334155' }}>Last updated:</span>
            <span style={{ color: '#64748B', fontWeight: 500 }}>{lastUpdatedText}</span>
          </div>

          {/* Date Range Popover Trigger & Floating Dropdown (Only shown if applicable on this page) */}
          {isDateFilterApplicable && (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                border: isDropdownOpen ? '1.5px solid #00A878' : '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isDropdownOpen ? '0 0 0 3px rgba(0, 168, 120, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Calendar size={14} color="#00A878" />
              <span>{getDisplayLabel()}</span>
              <ChevronDown 
                size={14} 
                color="#64748B" 
                style={{ 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.15s ease' 
                }} 
              />
            </button>

            {/* Floating Dropdown Menu (No bottom row on page) */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '185px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)',
                  padding: '5px',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  animation: 'fadeIn 0.12s ease-out'
                }}
              >
                {filterOptions.map((opt) => {
                  const isSelected = dateFilter === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(opt.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: isSelected ? 'rgba(0, 168, 120, 0.08)' : 'transparent',
                        color: isSelected ? '#00A878' : '#334155',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 600 : 450,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s ease'
                      }}
                      className="date-option-hover"
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} color="#00A878" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}

                {/* Inline Custom Range Inputs (Inside dropdown itself) */}
                {(showCustomFields || dateFilter === 'CUSTOM') && (
                  <div style={{
                    marginTop: '6px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>
                      Custom Date Range:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Start Date</label>
                      <input 
                        type="date" 
                        value={localStart} 
                        onChange={(e) => setLocalStart(e.target.value)} 
                        style={{ 
                          padding: '5px 8px', 
                          borderRadius: '6px', 
                          border: '1px solid #CBD5E1', 
                          fontSize: '0.74rem', 
                          background: '#FFFFFF',
                          color: '#0F172A',
                          width: '100%',
                          outline: 'none'
                        }} 
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>End Date</label>
                      <input 
                        type="date" 
                        value={localEnd} 
                        onChange={(e) => setLocalEnd(e.target.value)} 
                        style={{ 
                          padding: '5px 8px', 
                          borderRadius: '6px', 
                          border: '1px solid #CBD5E1', 
                          fontSize: '0.74rem', 
                          background: '#FFFFFF',
                          color: '#0F172A',
                          width: '100%',
                          outline: 'none'
                        }} 
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyCustom}
                      className="btn btn-epa"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginTop: '4px',
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Apply Custom Range <ArrowRight size={13} />
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
          )}

        </div>
      </div>

      <style>{`
        .date-option-hover:hover {
          background: #F1F5F9 !important;
        }
      `}</style>

    </div>
  );
}
