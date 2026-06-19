import { useState } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../context/ToastContext.jsx';
import { formatTime } from '../lib/utils';

export default function DataExport({ habits, logs }) {
  // Temporary state to let the user test both Free and Pro modes
  const [isPro, setIsPro] = useState(false);
  const showToast = useToast();

  // Helper to flatten the data into rows
  const getExportData = () => {
    const rows = [];
    Object.keys(logs).sort().forEach(date => {
      const dayLogs = logs[date];
      Object.keys(dayLogs).forEach(habitId => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          rows.push({
            Date: date,
            Habit: habit.name,
            Category: habit.category,
            Time: formatTime(habit.time)
          });
        }
      });
    });
    return rows;
  };

  const handleExportCSV = () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('No habits logged yet!', '❌');
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Habitly_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported Successfully!', '✅');
  };

  const handleExportPDF = () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('No habits logged yet!', '❌');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Habitly Journey Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = data.map(row => [row.Date, row.Habit, row.Category, row.Time]);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Habit', 'Category', 'Time']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`Habitly_Journey_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF Exported Successfully!', '✅');
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Data Export <span style={{ padding: '2px 8px', background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', borderRadius: '12px', verticalAlign: 'middle', marginLeft: '8px' }}>PRO</span></h2>
        
        {/* Developer Mode Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={isPro} onChange={(e) => setIsPro(e.target.checked)} />
          Toggle Pro Mode (Dev)
        </label>
      </div>

      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        
        {/* The Action UI (Always rendered, but sometimes blurred) */}
        <div style={{ padding: '24px', background: 'var(--bg-raised)', filter: isPro ? 'none' : 'blur(6px)', transition: 'filter 0.3s ease', display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Download your complete habit history. Analyze your consistency in Excel, or print a beautiful PDF report of your journey.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={handleExportCSV} 
              disabled={!isPro}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Export to CSV
            </button>
            <button 
              type="button"
              className="btn btn-primary" 
              onClick={handleExportPDF} 
              disabled={!isPro}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
              Export as PDF
            </button>
          </div>
        </div>

        {/* The Lock Overlay */}
        {!isPro && (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.2)', zIndex: 10
          }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px 32px', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--border)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Unlock Data Export</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '250px' }}>
                Upgrade to Pro to download your full habit history in beautifully formatted PDF and CSV formats.
              </p>
              <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
