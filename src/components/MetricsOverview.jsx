import React, { useState } from 'react';
import { FileCheck, Layers, ShieldCheck, DollarSign, Clock } from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import InteractiveChartContainer from './InteractiveChartContainer';
import KpiDetailModal from './KpiDetailModal';
import ChartPointDetailModal from './ChartPointDetailModal';

export default function MetricsOverview() {
  const [activeKpi, setActiveKpi] = useState(null);
  const [selectedModalKpi, setSelectedModalKpi] = useState(null);
  const [selectedChartPoint, setSelectedChartPoint] = useState(null);

  const handleInspectKpi = (type) => {
    if (type === 'pipeline') {
      setSelectedModalKpi({
        title: 'Proposal Financial Pipeline',
        value: '$4.25 Million',
        category: 'pipeline',
        color: '#2563EB',
        trendHistory: [
          { day: 'Jan', val: 1.2 }, { day: 'Feb', val: 1.8 }, { day: 'Mar', val: 2.4 },
          { day: 'Apr', val: 3.1 }, { day: 'May', val: 3.7 }, { day: 'Jun', val: 4.25 }
        ],
        breakdown: [
          { name: 'Sharjah EPA Phase II Proposal', value: '$2.10M', status: 'Optimal', action: 'Pending final review' },
          { name: 'Marine Buoy Expansion RFQ', value: '$1.15M', status: 'Optimal', action: 'Tech proposal submitted' },
          { name: 'Air Quality Sensor Refresh', value: '$1.00M', status: 'Active', action: 'Financial evaluation' }
        ]
      });
    } else if (type === 'active') {
      setSelectedModalKpi({
        title: 'Active Draft Proposals & Submissions',
        value: '14 Active Drafts',
        category: 'active',
        color: '#06B6D4',
        trendHistory: [
          { day: 'Jan', val: 6 }, { day: 'Feb', val: 8 }, { day: 'Mar', val: 10 },
          { day: 'Apr', val: 11 }, { day: 'May', val: 12 }, { day: 'Jun', val: 14 }
        ],
        breakdown: [
          { name: 'Wasit Microclimate Sensor Addendum', value: 'Draft #102', status: 'Active', action: 'Review in progress' },
          { name: 'Kalba Water Quality Sonde AMC', value: 'Draft #108', status: 'Optimal', action: 'Approved by Director' },
          { name: 'Al Dhaid Groundwater Well Monitoring', value: 'Draft #112', status: 'Active', action: 'SLA verification' }
        ]
      });
    } else if (type === 'reuse') {
      setSelectedModalKpi({
        title: 'Modular Engineering & Component Reuse Rate',
        value: '86.5% Efficiency',
        category: 'reuse',
        color: '#8B5CF6',
        trendHistory: [
          { day: 'Jan', val: 72 }, { day: 'Feb', val: 76 }, { day: 'Mar', val: 80 },
          { day: 'Apr', val: 82 }, { day: 'May', val: 84 }, { day: 'Jun', val: 86.5 }
        ],
        breakdown: [
          { name: 'Glass Panel Theme Components', value: '94% Reuse', status: 'Optimal', action: 'Standardized across modules' },
          { name: 'Recharts Interactive Containers', value: '88% Reuse', status: 'Optimal', action: 'Shared across dashboards' },
          { name: 'Leaflet Map Viewers', value: '78% Reuse', status: 'Active', action: 'Extensible GIS layer' }
        ]
      });
    } else if (type === 'compliance') {
      setSelectedModalKpi({
        title: 'Accessibility & Government Compliance Grade',
        value: 'Grade A+ (100% WCAG 2.1)',
        category: 'compliance',
        color: '#10B981',
        trendHistory: [
          { day: 'Jan', val: 95 }, { day: 'Feb', val: 97 }, { day: 'Mar', val: 98 },
          { day: 'Apr', val: 99 }, { day: 'May', val: 100 }, { day: 'Jun', val: 100 }
        ],
        breakdown: [
          { name: 'WCAG 2.1 AA Color Contrast', value: 'Pass (100%)', status: 'Optimal', action: 'Verified by automated auditor' },
          { name: 'Keyboard Focus Traps', value: 'Pass (0 issues)', status: 'Optimal', action: 'Accessible focus outlines' },
          { name: 'Screen Reader ARIA Attributes', value: 'Pass (100%)', status: 'Optimal', action: 'Semantic HTML5 structure' }
        ]
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Key Interactive Metrics Grid */}
      <div className="metric-cards-grid">
        
        {/* KPI 1 */}
        <InteractiveKpiCard
          id="pipeline"
          title="PROPOSAL PIPELINE"
          value="$4.25 M"
          subtitle="+18.4% vs last month"
          icon={DollarSign}
          iconBg="rgba(37, 99, 235, 0.15)"
          iconColor="#2563EB"
          trend="+18.4%"
          trendDirection="up"
          sparklineData={[{ v: 1.2 }, { v: 1.8 }, { v: 2.4 }, { v: 3.1 }, { v: 3.7 }, { v: 4.25 }]}
          isActive={activeKpi === 'pipeline'}
          onClick={() => setActiveKpi(activeKpi === 'pipeline' ? null : 'pipeline')}
          onInspect={() => handleInspectKpi('pipeline')}
        />

        {/* KPI 2 */}
        <InteractiveKpiCard
          id="active"
          title="ACTIVE PROPOSALS"
          value="14 Drafts"
          subtitle="Avg response: 3.2 days"
          icon={FileCheck}
          iconBg="rgba(6, 182, 212, 0.15)"
          iconColor="#06B6D4"
          trend="+12.0%"
          trendDirection="up"
          sparklineData={[{ v: 6 }, { v: 8 }, { v: 10 }, { v: 11 }, { v: 12 }, { v: 14 }]}
          isActive={activeKpi === 'active'}
          onClick={() => setActiveKpi(activeKpi === 'active' ? null : 'active')}
          onInspect={() => handleInspectKpi('active')}
        />

        {/* KPI 3 */}
        <InteractiveKpiCard
          id="reuse"
          title="REUSE RATE"
          value="86.5%"
          subtitle="+5.2% modular efficiency"
          icon={Layers}
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#8B5CF6"
          trend="+5.2%"
          trendDirection="up"
          sparklineData={[{ v: 72 }, { v: 76 }, { v: 80 }, { v: 82 }, { v: 84 }, { v: 86.5 }]}
          isActive={activeKpi === 'reuse'}
          onClick={() => setActiveKpi(activeKpi === 'reuse' ? null : 'reuse')}
          onInspect={() => handleInspectKpi('reuse')}
        />

        {/* KPI 4 */}
        <InteractiveKpiCard
          id="compliance"
          title="COMPLIANCE"
          value="Grade A+"
          subtitle="100% WCAG 2.1 AA"
          icon={ShieldCheck}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10B981"
          trend="100%"
          trendDirection="up"
          sparklineData={[{ v: 95 }, { v: 97 }, { v: 98 }, { v: 99 }, { v: 100 }, { v: 100 }]}
          isActive={activeKpi === 'compliance'}
          onClick={() => setActiveKpi(activeKpi === 'compliance' ? null : 'compliance')}
          onInspect={() => handleInspectKpi('compliance')}
        />

      </div>

      {/* Interactive Chart Section */}
      <InteractiveChartContainer
        title="Proposal Value vs Engineering Completion Trends"
        subtitle="Interactive financial trajectory & frontend delivery velocity tracking ($ Millions)"
        datasets={metricsDatasets}
        initialRange="7D"
        onPointClick={(point) => setSelectedChartPoint(point)}
      />

      {/* KPI Detail Modal */}
      {selectedModalKpi && (
        <KpiDetailModal
          kpiData={selectedModalKpi}
          onClose={() => setSelectedModalKpi(null)}
          onApplyFilter={(cat) => setActiveKpi(cat)}
        />
      )}

      {/* Chart Point Modal */}
      {selectedChartPoint && (
        <ChartPointDetailModal
          pointData={selectedChartPoint}
          onClose={() => setSelectedChartPoint(null)}
        />
      )}

    </div>
  );
}

const metricsDatasets = {
  '24H': [
    { day: '00:00', completedWO: 1, openWO: 0, avgResponseHours: 1.2 },
    { day: '04:00', completedWO: 2, openWO: 1, avgResponseHours: 1.5 },
    { day: '08:00', completedWO: 4, openWO: 2, avgResponseHours: 2.1 },
    { day: '12:00', completedWO: 6, openWO: 1, avgResponseHours: 1.9 },
    { day: '16:00', completedWO: 5, openWO: 3, avgResponseHours: 2.4 },
    { day: '20:00', completedWO: 3, openWO: 1, avgResponseHours: 1.8 }
  ],
  '7D': [
    { day: 'Mon', completedWO: 12, openWO: 3, avgResponseHours: 2.5 },
    { day: 'Tue', completedWO: 18, openWO: 2, avgResponseHours: 2.1 },
    { day: 'Wed', completedWO: 15, openWO: 4, avgResponseHours: 3.2 },
    { day: 'Thu', completedWO: 24, openWO: 1, avgResponseHours: 1.8 },
    { day: 'Fri', completedWO: 20, openWO: 3, avgResponseHours: 2.4 },
    { day: 'Sat', completedWO: 28, openWO: 2, avgResponseHours: 1.9 },
    { day: 'Sun', completedWO: 16, openWO: 1, avgResponseHours: 2.0 }
  ],
  '30D': [
    { day: 'Jan', completedWO: 9, openWO: 12, avgResponseHours: 3.8 },
    { day: 'Feb', completedWO: 14, openWO: 18, avgResponseHours: 3.2 },
    { day: 'Mar', completedWO: 21, openWO: 24, avgResponseHours: 2.8 },
    { day: 'Apr', completedWO: 27, openWO: 31, avgResponseHours: 2.4 },
    { day: 'May', completedWO: 32, openWO: 37, avgResponseHours: 2.1 },
    { day: 'Jun', completedWO: 39, openWO: 42, avgResponseHours: 1.8 }
  ],
  '90D': [
    { day: 'Month 1', completedWO: 45, openWO: 50, avgResponseHours: 3.5 },
    { day: 'Month 2', completedWO: 68, openWO: 75, avgResponseHours: 2.9 },
    { day: 'Month 3', completedWO: 92, openWO: 98, avgResponseHours: 2.2 }
  ],
  '1Y': [
    { day: '2025 Q1', completedWO: 140, openWO: 160, avgResponseHours: 4.1 },
    { day: '2025 Q2', completedWO: 210, openWO: 240, avgResponseHours: 3.3 },
    { day: '2025 Q3', completedWO: 290, openWO: 310, avgResponseHours: 2.7 },
    { day: '2025 Q4', completedWO: 380, openWO: 420, avgResponseHours: 2.0 }
  ]
};
