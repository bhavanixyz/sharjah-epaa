import React, { useState } from 'react';
import { FileCheck, Layers, ShieldCheck, ArrowUpRight, BarChart3, Clock, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { month: 'Jan', pipeline: 1.2, completed: 0.9, velocity: 85 },
  { month: 'Feb', pipeline: 1.8, completed: 1.4, velocity: 88 },
  { month: 'Mar', pipeline: 2.4, completed: 2.1, velocity: 92 },
  { month: 'Apr', pipeline: 3.1, completed: 2.7, velocity: 94 },
  { month: 'May', pipeline: 3.7, completed: 3.2, velocity: 96 },
  { month: 'Jun', pipeline: 4.2, completed: 3.9, velocity: 98 },
];

export default function MetricsOverview() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Key Metrics Grid */}
      <div className="metric-cards-grid">
        
        {/* KPI 1 */}
        <div className="glass-panel glass-panel-hover metric-card">
          <div className="metric-card-header">
            <span className="metric-title">PROPOSAL PIPELINE</span>
            <div className="metric-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-light)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="metric-value">$4.25 M</div>
          <div className="metric-subtitle" style={{ color: 'var(--accent-emerald)' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontWeight: 700 }}>+18.4%</span> vs last month
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel glass-panel-hover metric-card">
          <div className="metric-card-header">
            <span className="metric-title">ACTIVE PROPOSALS</span>
            <div className="metric-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <FileCheck size={20} />
            </div>
          </div>
          <div className="metric-value">14 Drafts</div>
          <div className="metric-subtitle" style={{ color: 'var(--accent-cyan)' }}>
            <Clock size={16} />
            <span>Avg response: 3.2 days</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel glass-panel-hover metric-card">
          <div className="metric-card-header">
            <span className="metric-title">REUSE RATE</span>
            <div className="metric-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div className="metric-value">86.5%</div>
          <div className="metric-subtitle" style={{ color: 'var(--accent-purple)' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontWeight: 700 }}>+5.2%</span> modular efficiency
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel glass-panel-hover metric-card">
          <div className="metric-card-header">
            <span className="metric-title">COMPLIANCE</span>
            <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-value">Grade A+</div>
          <div className="metric-subtitle" style={{ color: 'var(--accent-emerald)' }}>
            <span>100% WCAG 2.1 AA</span>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="var(--primary-light)" />
              Proposal Value vs Engineering Completion Trends
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Financial trajectory & frontend delivery velocity tracking ($ Millions)</p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: timeRange === range ? 'var(--primary)' : 'transparent',
                  color: timeRange === range ? '#fff' : 'var(--text-muted)'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              />
              <Area type="monotone" dataKey="pipeline" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPipeline)" name="Proposal Value ($M)" />
              <Area type="monotone" dataKey="completed" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Delivered Value ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
