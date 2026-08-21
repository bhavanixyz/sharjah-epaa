import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function DocumentReporting() {
  const [downloading, setDownloading] = useState(null);

  const reports = [
    { id: 'rep-1', title: 'Monthly Air Quality Index (AQI) Executive Report', type: 'PDF Document', size: '4.2 MB', category: 'Environmental Compliance' },
    { id: 'rep-2', title: 'Marine & Mangrove Conservation Telemetry Audit', type: 'PDF Document', size: '6.8 MB', category: 'Biodiversity & Water' },
    { id: 'rep-3', title: 'Equipment Maintenance Lifecycle & SLA Summary', type: 'CSV Dataset', size: '1.4 MB', category: 'Operational Maintenance' },
    { id: 'rep-4', title: 'EPA Calibration Gas Standards Verification Log', type: 'PDF Document', size: '2.1 MB', category: 'Quality Assurance' }
  ];

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert('Report exported and generated successfully!');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>EPA Documents & Compliance Reports</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Export official environmental audits, SOP manuals, and station telemetry logs</p>
        </div>

        <div className="page-header-actions">
          <span className="badge badge-normal">Sharjah EPA Verified</span>
        </div>
      </div>

      <div className="card-grid-responsive">
        {reports.map((rep) => (
          <div key={rep.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-blue">{rep.category}</span>
                <span className="badge badge-info">{rep.type}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '6px' }}>{rep.title}</h3>
              <p style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '16px' }}>
                Official EPA regulatory compliance document generated according to UAE Federal Environmental Law standards.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>Size: {rep.size}</span>
              <button 
                onClick={() => handleDownload(rep.id)}
                className="btn btn-epa" 
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
              >
                <Download size={14} /> {downloading === rep.id ? 'Generating...' : 'Export File'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
