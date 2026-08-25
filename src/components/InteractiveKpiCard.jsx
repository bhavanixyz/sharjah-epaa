import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Activity, Clock, Layers, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function InteractiveKpiCard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'linear-gradient(135deg, rgba(0, 168, 120, 0.1) 0%, rgba(13, 186, 139, 0.2) 100%)',
  iconColor = '#00A878',
  trend = '+12.4%',
  trendDirection = 'up',
  sparklineData = [
    { v: 40 }, { v: 48 }, { v: 45 }, { v: 58 }, { v: 52 }, { v: 65 }, { v: 72 }
  ],
  isActive = false,
  lastUpdated = '24 Aug 2026, 16:40',
  onClick,
  onInspect
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (onInspect) onInspect();
  };

  return (
    <div 
      className={`glass-panel interactive-kpi-card metric-card ${isActive ? 'kpi-active' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '14px 18px', 
        minHeight: '135px', 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '14px',
        background: isHovered 
          ? `linear-gradient(135deg, #FFFFFF 0%, ${iconColor}08 100%)` 
          : '#FFFFFF',
        border: isActive 
          ? `2px solid ${iconColor}` 
          : isHovered 
            ? `1.5px solid ${iconColor}66` 
            : '1px solid #E2E8F0',
        boxShadow: isHovered 
          ? `0 10px 22px -6px ${iconColor}22, 0 4px 10px -4px rgba(0,0,0,0.04)` 
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-3px)' : 'none'
      }}
    >
      {/* Active Filter Badge */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          background: `linear-gradient(135deg, ${iconColor} 0%, #0F172A 100%)`,
          color: '#fff',
          fontSize: '0.6rem',
          fontWeight: 800,
          padding: '2px 10px',
          borderBottomLeftRadius: '8px',
          borderTopRightRadius: '12px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          boxShadow: `0 3px 8px ${iconColor}44`,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={10} /> Active Filter
        </div>
      )}

      {/* Top Section: Title & Icon */}
      <div>
        <div className="metric-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="metric-title" style={{ 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              color: '#64748B', 
              letterSpacing: '0.06em', 
              textTransform: 'uppercase' 
            }}>
              {title}
            </span>
          </div>

          <div 
            className="metric-icon-box" 
            style={{ 
              background: iconBg, 
              color: iconColor,
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isHovered ? `0 4px 12px ${iconColor}33` : 'none',
              transition: 'all 0.25s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
          >
            {Icon && <Icon size={18} />}
          </div>
        </div>

        {/* Value + Trend Row Inline (No Sparkline Graph) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
          <div className="metric-value" style={{ 
            fontSize: '22px', 
            fontWeight: 800, 
            color: '#0F172A', 
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}>
            {value}
          </div>
          
          {trend && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: trendDirection === 'up' ? '#00A878' : trendDirection === 'down' ? '#DC2626' : '#64748B',
              background: trendDirection === 'up' ? 'rgba(0, 168, 120, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: `1px solid ${trendDirection === 'up' ? 'rgba(0, 168, 120, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
            }}>
              {trendDirection === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {trend}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle & Pop-Up Inspection CTA */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        marginTop: '8px', 
        paddingTop: '6px', 
        borderTop: '1px solid rgba(226, 232, 240, 0.8)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', width: '100%', overflow: 'hidden' }}>
          <span 
            className="metric-subtitle" 
            title={typeof subtitle === 'string' ? subtitle : ''}
            style={{ 
              margin: 0, 
              fontSize: '0.74rem', 
              fontWeight: 600, 
              color: '#475569',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              flex: '1 1 auto',
              minWidth: 0
            }}
          >
            {subtitle}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onInspect) onInspect();
              else if (onClick) onClick(e);
            }}
            className="kpi-expand-hint"
            style={{
              background: isHovered ? iconColor : '#F8FAFC',
              border: `1px solid ${isHovered ? iconColor : '#CBD5E1'}`,
              borderRadius: '7px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: isHovered ? '#FFFFFF' : '#0F172A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: isHovered ? `0 4px 10px ${iconColor}44` : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Open Interactive Details Pop-Up"
          >
            <Activity size={12} color={isHovered ? '#FFFFFF' : iconColor} /> 
            <span>Details</span> 
            <ExternalLink size={10} color={isHovered ? '#FFFFFF' : '#64748B'} />
          </button>
        </div>

        {/* Timestamp Footer inside Card */}
        {lastUpdated && (
          <div style={{ fontSize: '0.66rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            <Clock size={10} color="#00A878" style={{ flexShrink: 0 }} /> 
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Last updated: {lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}
