import React, { useState } from 'react';
import { Download, FileText, Search, Eye, X, CheckCircle } from 'lucide-react';

export default function DocumentReporting() {
  const [downloading, setDownloading] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewReport, setPreviewReport] = useState(null);

  const reports = [
    { id: 'rep-1', code: 'RPT-AST-01', title: 'Asset Register Report', type: 'PDF / Excel', size: '3.4 MB', category: 'Asset Management', desc: 'Comprehensive inventory of all EPA sensors, gas analyzers, and weather instruments.' },
    { id: 'rep-2', code: 'RPT-NET-02', title: 'Network Register & Topology Audit', type: 'PDF Document', size: '2.8 MB', category: 'Asset Management', desc: 'Hierarchy mapping across Air Quality, Marine, Meteorological, and Groundwater domains.' },
    { id: 'rep-3', code: 'RPT-SITE-03', title: 'Site Register & Coordinates Log', type: 'CSV / GeoJSON', size: '1.2 MB', category: 'Asset Management', desc: 'Spatial coordinates, zone boundaries, and assigned engineers for all 8 monitoring sites.' },
    { id: 'rep-4', code: 'RPT-STN-04', title: 'Station Infrastructure Summary', type: 'PDF Document', size: '4.1 MB', category: 'Asset Management', desc: 'Enclosure health, solar power backing, and telemetry logger operational statuses.' },
    { id: 'rep-5', code: 'RPT-MNT-05', title: 'Maintenance Due & Inspection Schedule', type: 'PDF / Excel', size: '2.5 MB', category: 'Maintenance & Calibration', desc: 'Preventive and scheduled maintenance activities due within 30/60/90 days.' },
    { id: 'rep-6', code: 'RPT-MNT-06', title: 'Maintenance Completion Summary', type: 'PDF Document', size: '5.6 MB', category: 'Maintenance & Calibration', desc: 'Historical work order execution logs, technician labor hours, and closure signoffs.' },
    { id: 'rep-7', code: 'RPT-WO-07', title: 'Work Order SLA Aging & Resolution Report', type: 'Excel Dataset', size: '1.8 MB', category: 'Maintenance & Calibration', desc: 'Critical vs High priority work order resolution times measured against EPA SLA limits.' },
    { id: 'rep-8', code: 'RPT-CAL-08', title: 'Calibration Due & Expired Gas Audit', type: 'PDF Document', size: '2.1 MB', category: 'Maintenance & Calibration', desc: 'Zero/span calibration drift logs, standard gas cylinder verification, and ISO certificates.' },
    { id: 'rep-9', code: 'RPT-CAL-09', title: 'Calibration History & Sensor Drift Log', type: 'CSV Dataset', size: '3.9 MB', category: 'Maintenance & Calibration', desc: 'Longitudinal telemetry drift trends for particulate matter (PM2.5) and gas sensors.' },
    { id: 'rep-10', code: 'RPT-WAR-10', title: 'Warranty Expiry Audit', type: 'PDF Document', size: '1.5 MB', category: 'Commercial & Stock', desc: 'Upcoming OEM warranty expirations across Horiba, Teledyne, and Vaisala analyzer fleets.' },
    { id: 'rep-11', code: 'RPT-AMC-11', title: 'Contract & AMC Renewal Schedule', type: 'PDF / Excel', size: '2.7 MB', category: 'Commercial & Stock', desc: 'Vendor SLAs, annual maintenance contracts, and commercial renewal deadlines.' },
    { id: 'rep-12', code: 'RPT-INV-12', title: 'Inventory Stock & Safety Threshold Report', type: 'Excel Dataset', size: '1.4 MB', category: 'Commercial & Stock', desc: 'Stock quantities, minimum reorder thresholds, and depot balances for spare parts.' },
    { id: 'rep-13', code: 'RPT-INV-13', title: 'Spare Part Consumption Log', type: 'CSV Dataset', size: '2.2 MB', category: 'Commercial & Stock', desc: 'PTFE filter replacements, sampling pump diaphragms, and reagent consumption tracking.' },
    { id: 'rep-14', code: 'RPT-PR-14', title: 'Procurement Status & Purchase Orders', type: 'PDF Document', size: '3.1 MB', category: 'Commercial & Stock', desc: 'Purchase requisitions, vendor quotes, PO approvals, and equipment capitalization status.' },
    { id: 'rep-15', code: 'RPT-SUP-15', title: 'Supplier Performance Evaluation', type: 'PDF Document', size: '1.9 MB', category: 'Commercial & Stock', desc: 'Vendor delivery SLAs, quality compliance metrics, and equipment defect ratios.' },
    { id: 'rep-16', code: 'RPT-DOC-16', title: 'Document & SOP Master Register', type: 'PDF Document', size: '4.8 MB', category: 'Governance & Compliance', desc: 'Catalog of standard operating procedures, ISO 17025 laboratory manuals, and engineering diagrams.' },
    { id: 'rep-17', code: 'RPT-AUD-17', title: 'Security & Audit Trail Summary', type: 'CSV Dataset', size: '6.4 MB', category: 'Governance & Compliance', desc: 'Cryptographic activity logs, user logins, configuration alterations, and RBAC changes.' },
    { id: 'rep-18', code: 'RPT-USR-18', title: 'User Access & Matrix Report', type: 'PDF Document', size: '1.3 MB', category: 'Governance & Compliance', desc: 'Role assignments, system privileges, and active EPA operator account security profiles.' },
    { id: 'rep-19', code: 'RPT-GIS-19', title: 'GIS Spatial Coverage & Layer Audit', type: 'GeoJSON / PDF', size: '8.2 MB', category: 'Asset Management', desc: 'Spatial density mapping of environmental monitoring stations across Sharjah Emirates.' },
    { id: 'rep-20', code: 'RPT-KPI-20', title: 'Executive Management KPI Dashboard Report', type: 'PDF Presentation', size: '5.0 MB', category: 'Governance & Compliance', desc: 'High-level executive briefing on environmental uptime, SLA compliance, and network health.' }
  ];

  const filteredReports = reports.filter(r => {
    const matchesCategory = activeCategory === 'ALL' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert('Report generated and exported successfully according to Sharjah EPA Regulatory Standards!');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>EPA Reporting & Compliance Catalogue</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
            20 Enterprise BRD Standard Reports: Export regulatory audits, telemetry logs & maintenance summaries
          </p>
        </div>

        <div className="page-header-actions">
          <span className="badge badge-normal">20 BRD Reports Available</span>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        
        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['ALL', 'Asset Management', 'Maintenance & Calibration', 'Commercial & Stock', 'Governance & Compliance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeCategory === cat ? '#00A878' : '#F1F5F9',
                color: activeCategory === cat ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search report code, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '0.8rem', height: '36px' }}
          />
        </div>
      </div>

      {/* Reports Catalogue Grid */}
      <div className="card-grid-responsive">
        {filteredReports.map((rep) => (
          <div key={rep.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-blue">{rep.category}</span>
                <span style={{ fontSize: '0.74rem', color: '#0891B2', fontWeight: 700, fontFamily: 'monospace' }}>{rep.code}</span>
              </div>

              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1F2937', marginBottom: '6px' }}>{rep.title}</h3>
              <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '16px', lineHeight: 1.4 }}>
                {rep.desc}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                <span className="badge badge-info">{rep.type}</span> • {rep.size}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setPreviewReport(rep)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                  title="Preview Report Details"
                >
                  <Eye size={14} /> Preview
                </button>
                <button 
                  onClick={() => handleDownload(rep.id)}
                  className="btn btn-epa" 
                  style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                >
                  <Download size={14} /> {downloading === rep.id ? 'Generating...' : 'Export'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '560px', maxWidth: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#00A878" />
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#0891B2', fontWeight: 700, fontFamily: 'monospace' }}>{previewReport.code}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>{previewReport.title}</h3>
                </div>
              </div>
              <button onClick={() => setPreviewReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '18px', fontSize: '0.82rem', color: '#334155' }}>
              <p style={{ marginBottom: '12px' }}>{previewReport.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                <div>Category: <strong>{previewReport.category}</strong></div>
                <div>Export Format: <strong>{previewReport.type}</strong></div>
                <div>File Size: <strong>{previewReport.size}</strong></div>
                <div>Standard: <strong>Sharjah EPA ISO 17025 Compliance</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#059669', marginBottom: '20px' }}>
              <CheckCircle size={16} /> Digitally signed by Sharjah EPA Environmental Intelligence Engine (v5.0)
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setPreviewReport(null)} className="btn btn-secondary">Close Preview</button>
              <button onClick={() => { handleDownload(previewReport.id); setPreviewReport(null); }} className="btn btn-epa">
                <Download size={14} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
