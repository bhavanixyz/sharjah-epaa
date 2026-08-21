import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw } from 'lucide-react';

export default function CalibrationManagement() {
  const { calibrations } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Gas & Sensor Calibration Lifecycle</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Zero/span drift verification, span gas standard logs & EPA QA certificates</p>
        </div>
        
        <div className="page-header-actions">
          <button className="btn btn-epa">
            <RefreshCw size={16} /> New Drift Calibration
          </button>
        </div>
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
            {calibrations.map((cal) => (
              <tr key={cal.id}>
                <td style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                  {cal.certificateNo}
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

    </div>
  );
}
