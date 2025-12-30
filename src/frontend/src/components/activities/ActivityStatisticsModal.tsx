import { X, Users, Award, UserX, TrendingUp, Download, FileText, Table } from 'lucide-react';
import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { CompletedActivityData } from '../../data/completedActivityData';

// Set up pdfMake fonts
pdfMake.vfs = pdfFonts.vfs;

interface ActivityStatisticsModalProps {
  activity: CompletedActivityData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityStatisticsModal({ activity, isOpen, onClose }: ActivityStatisticsModalProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate statistics
  const participationRate = ((activity.currentParticipants / activity.maxParticipants) * 100).toFixed(1);
  const absenteeRate = ((activity.absentees / activity.currentParticipants) * 100).toFixed(1);
  const attendanceRate = (100 - parseFloat(absenteeRate)).toFixed(1);

  // Download as CSV
  const downloadCSV = () => {
    const csvData = [
      ['Thống kê hoạt động', activity.name],
      [''],
      ['Chỉ số', 'Giá trị'],
      ['Tỷ lệ tham gia', `${participationRate}%`],
      ['Người đăng ký', `${activity.currentParticipants}/${activity.maxParticipants}`],
      ['Nhân viên xuất sắc', activity.excellentEmployees],
      ['Tỷ lệ xuất sắc', `${((activity.excellentEmployees / activity.currentParticipants) * 100).toFixed(1)}%`],
      ['Tổng đăng ký', activity.currentParticipants],
      ['Có mặt', activity.currentParticipants - activity.absentees],
      ['Vắng mặt', activity.absentees],
      ['Tỷ lệ tham dự', `${attendanceRate}%`],
      ['Tỷ lệ vắng mặt', `${absenteeRate}%`],
      [''],
      ['Thông tin hoạt động'],
      ['Thời gian', new Date(activity.startDate).toLocaleDateString('vi-VN')],
      ['Địa điểm', activity.location],
      ['Tổ chức', activity.organizer],
      ['Loại hoạt động', activity.type === 'sports' ? 'Thể thao' :
                         activity.type === 'charity' ? 'Từ thiện' :
                         activity.type === 'training' ? 'Đào tạo' :
                         activity.type === 'team-building' ? 'Team Building' : 'Tình nguyện']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `thong-ke-${activity.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  // Download as PDF
  const downloadPDF = () => {
    const typeLabel = activity.type === 'sports' ? 'Thể thao' :
                      activity.type === 'charity' ? 'Từ thiện' :
                      activity.type === 'training' ? 'Đào tạo' :
                      activity.type === 'team-building' ? 'Team Building' : 'Tình nguyện';

    const excellentRate = ((activity.excellentEmployees / activity.currentParticipants) * 100).toFixed(1);

    const docDefinition: any = {
      pageMargins: [40, 60, 40, 60],
      content: [
        // Header with background
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    { text: 'THỐNG KÊ HOẠT ĐỘNG', style: 'header', alignment: 'center' },
                    { text: activity.name, style: 'subheader', alignment: 'center', margin: [0, 5, 0, 0] }
                  ],
                  fillColor: '#dbeafe',
                  margin: [10, 15, 10, 15]
                }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20]
        },
        
        // Overview Section with boxes
        {
          text: 'Tổng quan',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  stack: [
                    { text: 'Tỷ lệ tham gia', style: 'label', alignment: 'center' },
                    { text: `${participationRate}%`, style: 'bigNumber', color: '#1d4ed8', alignment: 'center' },
                    { text: `${activity.currentParticipants}/${activity.maxParticipants} người đăng ký`, style: 'detail', alignment: 'center' }
                  ],
                  fillColor: '#eff6ff',
                  margin: [5, 10, 5, 10]
                },
                {
                  stack: [
                    { text: 'Nhân viên xuất sắc', style: 'label', alignment: 'center' },
                    { text: `${activity.excellentEmployees}`, style: 'bigNumber', color: '#ca8a04', alignment: 'center' },
                    { text: `${excellentRate}% nhân viên tham gia`, style: 'detail', alignment: 'center' }
                  ],
                  fillColor: '#fef9e7',
                  margin: [5, 10, 5, 10]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb'
          },
          margin: [0, 0, 0, 20]
        },

        // Attendance Statistics Section with table
        {
          text: 'Thống kê tham dự',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                {
                  stack: [
                    { text: 'Tổng đăng ký', style: 'label', alignment: 'center' },
                    { text: `${activity.currentParticipants}`, style: 'mediumNumber', alignment: 'center' }
                  ],
                  margin: [5, 10, 5, 10]
                },
                {
                  stack: [
                    { text: 'Có mặt', style: 'label', alignment: 'center' },
                    { text: `${activity.currentParticipants - activity.absentees}`, style: 'mediumNumber', color: '#059669', alignment: 'center' },
                    { text: `${attendanceRate}%`, style: 'detail', alignment: 'center' }
                  ],
                  fillColor: '#f0fdf4',
                  margin: [5, 10, 5, 10]
                },
                {
                  stack: [
                    { text: 'Vắng mặt', style: 'label', alignment: 'center' },
                    { text: `${activity.absentees}`, style: 'mediumNumber', color: '#dc2626', alignment: 'center' },
                    { text: `${absenteeRate}%`, style: 'detail', alignment: 'center' }
                  ],
                  fillColor: '#fef2f2',
                  margin: [5, 10, 5, 10]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb'
          },
          margin: [0, 0, 0, 20]
        },

        // Activity Info Section with table
        {
          text: 'Thông tin hoạt động',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              [
                { text: 'Thời gian', style: 'tableLabel', fillColor: '#f9fafb' },
                { 
                  text: new Date(activity.startDate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }), 
                  style: 'tableValue' 
                }
              ],
              [
                { text: 'Địa điểm', style: 'tableLabel', fillColor: '#f9fafb' },
                { text: activity.location, style: 'tableValue' }
              ],
              [
                { text: 'Đơn vị tổ chức', style: 'tableLabel', fillColor: '#f9fafb' },
                { text: activity.organizer, style: 'tableValue' }
              ],
              [
                { text: 'Loại hoạt động', style: 'tableLabel', fillColor: '#f9fafb' },
                { text: typeLabel, style: 'tableValue' }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6
          },
          margin: [0, 0, 0, 30]
        },

        // Footer with line
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: '#e5e7eb'
            }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: `Báo cáo được tạo tự động vào ${new Date().toLocaleString('vi-VN')}`,
          style: 'footer',
          alignment: 'center'
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#1e40af'
        },
        subheader: {
          fontSize: 14,
          color: '#64748b'
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#1e40af',
          fillColor: '#f3f4f6',
          margin: [0, 5, 0, 5]
        },
        label: {
          fontSize: 10,
          color: '#6b7280',
          margin: [0, 0, 0, 5]
        },
        bigNumber: {
          fontSize: 28,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        mediumNumber: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 3]
        },
        detail: {
          fontSize: 9,
          color: '#6b7280'
        },
        tableLabel: {
          fontSize: 10,
          color: '#6b7280',
          bold: true
        },
        tableValue: {
          fontSize: 11,
          color: '#1f2937'
        },
        footer: {
          fontSize: 9,
          color: '#9ca3af',
          italics: true
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    pdfMake.createPdf(docDefinition).download(`thong-ke-${activity.id}.pdf`);
    setShowDownloadMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
       <div
            className="fixed inset-0 backdrop-brightness-60 transition-all"
            onClick={onClose}
        ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Thống kê hoạt động</h2>
              <p className="text-blue-100">{activity.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Statistics Content */}
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participation Rate Card */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tỷ lệ tham gia</p>
                  <p className="text-3xl font-bold text-blue-700">{participationRate}%</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{activity.currentParticipants}</span> / {activity.maxParticipants} người đăng ký
              </div>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-blue-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${participationRate}%` }}
                />
              </div>
            </div>

            {/* Excellent Employees Card */}
            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Nhân viên xuất sắc</p>
                  <p className="text-3xl font-bold text-yellow-700">{activity.excellentEmployees}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Tổng số nhân viên được khen thưởng
              </div>
              {/* Badge */}
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold">
                {((activity.excellentEmployees / activity.currentParticipants) * 100).toFixed(1)}% nhân viên tham gia
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-700" />
              Thống kê tham dự
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Total Participants */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{activity.currentParticipants}</p>
                <p className="text-sm text-gray-600">Tổng đăng ký</p>
              </div>

              {/* Attendance */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {activity.currentParticipants - activity.absentees}
                </p>
                <p className="text-sm text-gray-600">Có mặt ({attendanceRate}%)</p>
              </div>

              {/* Absentees */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <UserX className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">{activity.absentees}</p>
                <p className="text-sm text-gray-600">Vắng mặt ({absenteeRate}%)</p>
              </div>
            </div>

            {/* Attendance Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tỷ lệ tham dự</span>
                <span className="font-semibold text-gray-900">{attendanceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin hoạt động</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Thời gian</p>
                <p className="font-semibold text-gray-900">
                  {new Date(activity.startDate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Địa điểm</p>
                <p className="font-semibold text-gray-900">{activity.location}</p>
              </div>
              <div>
                <p className="text-gray-600">Tổ chức</p>
                <p className="font-semibold text-gray-900">{activity.organizer}</p>
              </div>
              <div>
                <p className="text-gray-600">Loại hoạt động</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {activity.type === 'sports' ? 'Thể thao' :
                   activity.type === 'charity' ? 'Từ thiện' :
                   activity.type === 'training' ? 'Đào tạo' :
                   activity.type === 'team-building' ? 'Team Building' :
                   'Tình nguyện'}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-between items-center pt-4 border-t">
            {/* Download Button with Menu */}
            <div className="relative">
              {/* Backdrop for closing menu */}
              {showDownloadMenu && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowDownloadMenu(false)}
                />
              )}
              
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all relative z-10"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(22, 163, 74, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Download className="w-5 h-5" />
                <span>Tải về</span>
              </button>

              {/* Download Menu */}
              {showDownloadMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20 min-w-[220px]">
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors w-full text-left border-b border-gray-100"
                    style={{ borderRadius: '0' }}
                  >
                    <Table className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Tải CSV</p>
                      <p className="text-xs text-gray-500">Định dạng bảng tính</p>
                    </div>
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors w-full text-left border-b border-gray-100"
                    style={{ borderRadius: '0' }}
                  >
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Tải PDF</p>
                      <p className="text-xs text-gray-500">Định dạng tài liệu</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(75, 85, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
