import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Award } from 'lucide-react';

export default function CalibrationManagement() {
  const { calibrations, setCalibrations } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [assetName, setAssetName] = useState('');
  const [siteName, setSiteName] = useState('Al Majaz Urban Station');
  const [calibrationType, setCalibrationType] = useState('Zero & Span Gas Standard');
  const [performedBy, setPerformedBy] = useState('Eng. Humaid Al-Suwaidi');
  const [resultStatus, setResultStatus] = useState('Passed (0.02% Drift)');

  const handleCreateCalibration = (e) => {
    e.preventDefault();
    const newCal = {
      id: `cal-${Date.now()}`,
      certificateNo: `EPA-CAL-2026-0${calibrations.length + 1}`,
      assetName: assetName || 'Horiba APNA-370 NOx Analyzer',
      siteName,
      calibrationType,
      performedBy,
      result: resultStatus,
      dueDate: '2026-11-15',
      status: 'Valid'
    };
    setCalibrations([newCal, ...calibrations]);
    setIsModalOpen(false);
    setAssetName('');
  };

  const filteredCalibrations = filterStatus === 'ALL'
    ? calibrations
    : calibrations.filter(c => {
        if (filterStatus === 'Passed') return c.result.includes('Passed');
        if (filterStatus === 'Failed') return c.result.includes('Failed');
        if (filterStatus === 'Overdue') return c.status !== 'Valid';
        return true;
      });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Gas & Sensor Calibration Lifecycle</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Zero/span drift verification, span gas standard logs & EPA QA certificates</p>
        </div>
        
        <div className="page-header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-epa">
            <Plus size={16} /> Schedule Drift Calibration
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginRight: '6px' }}>Filter Status:</span>
        {['ALL', 'Passed', 'Failed', 'Overdue'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: filterStatus === st ? '#00A878' : '#F1F5F9',
              color: filterStatus === st ? '#FFFFFF' : '#475569'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Calibrations Table */}
      <div className="glass-panel table-responsive">
        <table className="epa-table">
          <thead>
            <tr>
              <th>Certificate No</th>
              <th>Target Sensor / Analyzer</th>
              <th>Station Location</th>
              <th>Calibration Standard</th>
              <th>Performed By</th>
              <th>Drift Check Result</th>
              <th>Next Expiry</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalibrations.map((cal) => (
              <tr key={cal.id}>
                <td style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="#00A878" /> {cal.certificateNo}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#1F2937' }}>{cal.assetName}</div>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                  {cal.siteName}
                </td>
                <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  {cal.calibrationType}
                </td>
                <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                  {cal.performedBy}
                </td>
                <td>
                  <span className={`badge ${cal.result.includes('Passed') ? 'badge-passed' : 'badge-failed'}`}>
                    {cal.result}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: cal.status === 'Valid' ? '#00A878' : '#DC2626', fontWeight: 700 }}>
                  {cal.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Calibration Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>Schedule Drift Calibration</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateCalibration} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>TARGET SENSOR / ANALYZER</label>
                <input type="text" required placeholder="e.g. Horiba APNA-370 Ambient NOx Analyzer" className="input-field" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>STATION SITE</label>
                  <select className="input-field" value={siteName} onChange={(e) => setSiteName(e.target.value)}>
                    <option value="Al Majaz Urban Station">Al Majaz Urban Station</option>
                    <option value="Wasit Wetland Reserve">Wasit Wetland Reserve</option>
                    <option value="Khor Kalba Marine Station">Khor Kalba Marine Station</option>
                    <option value="Saja Industrial Zone">Saja Industrial Zone</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CALIBRATION STANDARD</label>
                  <select className="input-field" value={calibrationType} onChange={(e) => setCalibrationType(e.target.value)}>
                    <option value="Zero & Span Gas Standard">Zero & Span Gas Standard</option>
                    <option value="Multi-point Permeation Tube">Multi-point Permeation Tube</option>
                    <option value="Gravimetric Flow Calibrator">Gravimetric Flow Calibrator</option>
                    <option value="NIST Traceable Gas Standard">NIST Traceable Gas Standard</option>
                  </select>
                </div>
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>PERFORMED BY</label>
                  <input type="text" className="input-field" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>VERIFICATION RESULT</label>
                  <select className="input-field" value={resultStatus} onChange={(e) => setResultStatus(e.target.value)}>
                    <option value="Passed (0.02% Drift)">Passed (0.02% Drift)</option>
                    <option value="Passed (0.05% Drift)">Passed (0.05% Drift)</option>
                    <option value="Failed (Drift Limit Exceeded)">Failed (Drift Limit Exceeded)</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Log Calibration Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
