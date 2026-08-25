import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function ExportSuccessToast() {
  const { exportToast, closeExportToast } = useApp();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!exportToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const intervalTime = 40;
    const totalDuration = 4000;
    const decrement = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          closeExportToast();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [exportToast, closeExportToast]);

  if (!exportToast) return null;

  const { filename, format = 'CSV', count, title = 'Downloaded Successfully!' } = exportToast;

  const getFormatIcon = () => {
    switch (format.toUpperCase()) {
      case 'CSV':
      case 'EXCEL':
      case 'XLSX':
        return <FileSpreadsheet size={22} color="#00A878" />;
      case 'PDF':
      case 'DOC':
      case 'DOCS':
        return <FileText size={22} color="#EF4444" />;
      case 'PNG':
      case 'JPG':
      case 'SVG':
        return <ImageIcon size={22} color="#3B82F6" />;
      default:
        return <Download size={22} color="#00A878" />;
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '420px',
        width: 'calc(100vw - 48px)'
      }}
    >
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #A3E6D2',
          borderRadius: '14px',
          boxShadow: '0 20px 40px -15px rgba(0, 168, 120, 0.22), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Header Row */}
        <div style={{ padding: '16px 18px 12px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#E6F6F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid #A3E6D2'
            }}
          >
            <CheckCircle2 size={22} color="#00A878" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span 
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#008761',
                  background: '#E6F6F2',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {format} Exported
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>• Just now</span>
            </div>

            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {title}
            </h4>
          </div>

          <button
            onClick={closeExportToast}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>

        {/* File Information Card */}
        <div style={{ padding: '0 18px 14px 18px' }}>
          <div 
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {getFormatIcon()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div 
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={filename}
              >
                {filename}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {count !== undefined && count !== null && (
                  <span>{count} {count === 1 ? 'Record' : 'Records'}</span>
                )}
                <span>Saved to your local Downloads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ padding: '0 18px 14px 18px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={closeExportToast}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={13} color="#00A878" /> Done
          </button>
        </div>

        {/* Timed Progress Bar */}
        <div style={{ width: '100%', height: '3px', background: '#E2E8F0' }}>
          <div 
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00A878, #34D399)',
              transition: 'width 40ms linear'
            }}
          />
        </div>
      </div>
    </div>
  );
}
