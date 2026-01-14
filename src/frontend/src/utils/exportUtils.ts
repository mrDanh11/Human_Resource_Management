/**
 * exportUtils.ts - Utility functions for exporting data to PDF and Excel
 */

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import type { TransactionRecord } from '../types/reward';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = pdfFonts;

/**
 * Format date to Vietnamese format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format currency to Vietnamese format
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Export transactions to PDF
 */
export function exportToPDF(
  transactions: TransactionRecord[],
  employeeName: string,
  summary?: { current: number; earnedThisPeriod: number; redeemedThisPeriod: number }
): void {
  const docDefinition: any = {
    content: [
      // Header
      {
        text: 'LỊCH SỬ GIAO DỊCH ĐIỂM THƯỞNG',
        style: 'header',
        alignment: 'center',
      },
      {
        text: `Nhân viên: ${employeeName}`,
        style: 'subheader',
        margin: [0, 10, 0, 5],
      },
      {
        text: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        style: 'subheader',
        margin: [0, 0, 0, 20],
      },
      
      // Summary section if provided
      ...(summary ? [
        {
          text: 'TỔNG KẾT',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: `Điểm hiện có: ${formatCurrency(summary.current)}`, style: 'summary' },
            { text: `Điểm nhận kỳ này: +${formatCurrency(summary.earnedThisPeriod)}`, style: 'summary' },
            { text: `Đã đổi kỳ này: ${summary.redeemedThisPeriod > 0 ? '-' : ''}${formatCurrency(summary.redeemedThisPeriod)}`, style: 'summary' },
          ],
          margin: [0, 0, 0, 20],
        },
      ] : []),

      // Transactions table
      {
        text: 'CHI TIẾT GIAO DỊCH',
        style: 'sectionHeader',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 'auto'],
          body: [
            // Header row
            [
              { text: 'Ngày', style: 'tableHeader' },
              { text: 'Loại', style: 'tableHeader' },
              { text: 'Mô tả', style: 'tableHeader' },
              { text: 'Điểm', style: 'tableHeader' },
              { text: 'Trạng thái', style: 'tableHeader' },
            ],
            // Data rows
            ...transactions.map((t) => [
              { text: formatDate(t.date), style: 'tableCell' },
              { text: t.typeDisplay, style: 'tableCell' },
              { text: t.description || '', style: 'tableCell' },
              { 
                text: t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount),
                style: t.amount > 0 ? 'tableCellPositive' : 'tableCellNegative',
              },
              { text: t.statusDisplay, style: 'tableCell' },
            ]),
          ],
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex === 0 ? '#3B82F6' : rowIndex % 2 === 0 ? '#F3F4F6' : null;
          },
        },
      },
      
      // Footer
      {
        text: `Tổng số giao dịch: ${transactions.length}`,
        style: 'footer',
        margin: [0, 20, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#1F2937',
      },
      subheader: {
        fontSize: 12,
        color: '#6B7280',
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: '#1F2937',
      },
      summary: {
        fontSize: 11,
        color: '#4B5563',
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
      },
      tableCell: {
        fontSize: 10,
        color: '#374151',
      },
      tableCellPositive: {
        fontSize: 10,
        color: '#059669',
        bold: true,
      },
      tableCellNegative: {
        fontSize: 10,
        color: '#DC2626',
        bold: true,
      },
      footer: {
        fontSize: 11,
        italics: true,
        color: '#6B7280',
      },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  pdfMake.createPdf(docDefinition).download(`Lich_su_giao_dich_${new Date().getTime()}.pdf`);
}

/**
 * Export transactions to Excel
 */
export function exportToExcel(
  transactions: TransactionRecord[],
  employeeName: string,
  summary?: { current: number; earnedThisPeriod: number; redeemedThisPeriod: number }
): void {
  // Prepare data for Excel
  const worksheetData: any[] = [
    // Header section
    ['LỊCH SỬ GIAO DỊCH ĐIỂM THƯỞNG'],
    [`Nhân viên: ${employeeName}`],
    [`Ngày xuất: ${new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })}`],
    [], // Empty row
  ];

  // Summary section
  if (summary) {
    worksheetData.push(
      ['TỔNG KẾT'],
      ['Điểm hiện có', summary.current],
      ['Điểm nhận kỳ này', summary.earnedThisPeriod],
      ['Đã đổi kỳ này', summary.redeemedThisPeriod],
      [], // Empty row
    );
  }

  // Transaction table header
  worksheetData.push(
    ['CHI TIẾT GIAO DỊCH'],
    ['Ngày', 'Loại', 'Mô tả', 'Điểm', 'Trạng thái', 'Người thực hiện']
  );

  // Transaction data
  transactions.forEach((t) => {
    worksheetData.push([
      formatDate(t.date),
      t.typeDisplay,
      t.description || '',
      t.amount,
      t.statusDisplay,
      t.actor || '',
    ]);
  });

  // Footer
  worksheetData.push(
    [], // Empty row
    [`Tổng số giao dịch: ${transactions.length}`]
  );

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths (wch = width in characters) - make them even wider
  ws['!cols'] = [
    { wch: 25 }, // Ngày
    { wch: 20 }, // Loại  
    { wch: 80 }, // Mô tả - very wide for long descriptions
    { wch: 15 }, // Điểm
    { wch: 18 }, // Trạng thái
    { wch: 25 }, // Người thực hiện
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử giao dịch');

  // Download file
  XLSX.writeFile(wb, `Lich_su_giao_dich_${new Date().getTime()}.xlsx`);
}
