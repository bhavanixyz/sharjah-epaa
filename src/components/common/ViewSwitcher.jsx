import React from 'react';
import { Table, LayoutGrid, MapPin } from 'lucide-react';

export default function ViewSwitcher({ activeView, onViewChange, views = ['table', 'cards', 'map'] }) {
  return (
    <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
      {views.includes('table') && (
        <button
          onClick={() => onViewChange('table')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeView === 'table' ? '#FFFFFF' : 'transparent',
            color: activeView === 'table' ? '#00A878' : '#64748B',
            boxShadow: activeView === 'table' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Table size={15} /> Table View
        </button>
      )}

      {views.includes('cards') && (
        <button
          onClick={() => onViewChange('cards')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeView === 'cards' ? '#FFFFFF' : 'transparent',
            color: activeView === 'cards' ? '#00A878' : '#64748B',
            boxShadow: activeView === 'cards' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <LayoutGrid size={15} /> Cards View
        </button>
      )}

      {views.includes('map') && (
        <button
          onClick={() => onViewChange('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeView === 'map' ? '#FFFFFF' : 'transparent',
            color: activeView === 'map' ? '#00A878' : '#64748B',
            boxShadow: activeView === 'map' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <MapPin size={15} /> Map View
        </button>
      )}
    </div>
  );
}
