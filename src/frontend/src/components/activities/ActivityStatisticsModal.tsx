import { X, Award, TrendingUp, Download, FileText, Table, Calendar, MapPin, Tag } from 'lucide-react';
import { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { CompletedActivityData } from '../../types/activity';

// Set up pdfMake fonts
pdfMake.vfs = pdfFonts.vfs;

interface ActivityStatisticsModalProps {
  activity: CompletedActivityData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityStatisticsModal({ activity, isOpen, onClose }: ActivityStatisticsModalProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Use real data if available, otherwise generate mock data
  const excellentEmployees = activity.excellentEmployeeList || Array.from({ length: activity.excellentEmployees }, (_, i) => ({
    id: i + 1,
    name: `Nhân viên ${i + 1}`,
    department: ['Công nghệ', 'Nhân sự', 'Kinh doanh', 'Marketing', 'Kế toán'][i % 5],
    email: `employee${i + 1}@company.com`
  }));

  if (!isOpen) return null;

  // Calculate statistics
  const registrationRate = ((activity.currentParticipants / activity.maxParticipants) * 100).toFixed(1);

  // Download as CSV
  const downloadCSV = () => {
    const excellentEmployeeList = excellentEmployees.map(emp => 
      `${emp.name} (${emp.department} - ${emp.email})`
    ).join('; ');

    const csvData = [
      ['Thống kê hoạt động', activity.name],
      [''],
      ['Chỉ số', 'Giá trị'],
      ['Tỷ lệ đăng ký', `${registrationRate}%`],
      ['Tổng đăng ký', `${activity.currentParticipants}/${activity.maxParticipants}`],
      ['Nhân viên xuất sắc', activity.excellentEmployees],
      ['Tỷ lệ xuất sắc', `${((activity.excellentEmployees / activity.currentParticipants) * 100).toFixed(1)}%`],
      [''],
      ['Danh sách nhân viên xuất sắc', excellentEmployeeList],
      [''],
      ['Thông tin hoạt động'],
      ['Thời gian', new Date(activity.startDate).toLocaleDateString('vi-VN')],
      ['Địa điểm', activity.location],
      ['Loại hoạt động', activity.activityType === 'sports' ? 'Thể thao' :
                         activity.activityType === 'charity' ? 'Từ thiện' :
                         activity.activityType === 'training' ? 'Đào tạo' :
                         activity.activityType === 'team-building' ? 'Team Building' : 'Tình nguyện']
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
    const typeLabel = activity.activityType === 'sports' ? 'Thể thao' :
                      activity.activityType === 'charity' ? 'Từ thiện' :
                      activity.activityType === 'training' ? 'Đào tạo' :
                      activity.activityType === 'team-building' ? 'Team Building' : 'Tình nguyện';

    const excellentRate = ((activity.excellentEmployees / activity.currentParticipants) * 100).toFixed(1);

    // Prepare excellent employees table
    const excellentEmployeesTable = excellentEmployees.length > 0 ? [
      {
        text: 'Danh sách nhân viên xuất sắc',
        style: 'sectionHeader',
        margin: [0, 10, 0, 10]
      },
      {
        table: {
          widths: ['10%', '30%', '30%', '30%'],
          body: [
            [
              { text: 'STT', style: 'tableLabel', fillColor: '#f9fafb', alignment: 'center' },
              { text: 'Họ tên', style: 'tableLabel', fillColor: '#f9fafb' },
              { text: 'Phòng ban', style: 'tableLabel', fillColor: '#f9fafb' },
              { text: 'Email', style: 'tableLabel', fillColor: '#f9fafb' }
            ],
            ...excellentEmployees.map((emp, index) => [
              { text: (index + 1).toString(), style: 'tableValue', alignment: 'center' },
              { text: emp.name, style: 'tableValue' },
              { text: emp.department, style: 'tableValue' },
              { text: emp.email, style: 'tableValue' }
            ])
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
        margin: [0, 0, 0, 20]
      }
    ] : [];

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

        // Activity Basic Info
        {
          table: {
            widths: ['25%', '25%', '50%'],
            body: [
              [
                {
                  stack: [
                    { text: 'Loại hoạt động', style: 'infoLabel', alignment: 'center' },
                    { text: typeLabel, style: 'infoValue', alignment: 'center' }
                  ],
                  fillColor: '#f0fdf4',
                  margin: [5, 8, 5, 8]
                },
                {
                  stack: [
                    { text: 'Thời gian', style: 'infoLabel', alignment: 'center' },
                    { 
                      text: new Date(activity.startDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }), 
                      style: 'infoValue', 
                      alignment: 'center' 
                    }
                  ],
                  fillColor: '#eff6ff',
                  margin: [5, 8, 5, 8]
                },
                {
                  stack: [
                    { text: 'Địa điểm', style: 'infoLabel', alignment: 'center' },
                    { text: activity.location, style: 'infoValue', alignment: 'center' }
                  ],
                  fillColor: '#fef3c7',
                  margin: [5, 8, 5, 8]
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
                    { text: 'Tỷ lệ đăng ký', style: 'label', alignment: 'center' },
                    { text: `${registrationRate}%`, style: 'bigNumber', color: '#1d4ed8', alignment: 'center' },
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

        // Excellent Employees List
        ...excellentEmployeesTable,

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
        infoLabel: {
          fontSize: 9,
          color: '#6b7280',
          bold: true,
          margin: [0, 0, 0, 3]
        },
        infoValue: {
          fontSize: 11,
          color: '#1f2937',
          bold: true
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
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl shrink-0">
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participation Rate Card */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tỷ lệ đăng ký</p>
                  <p className="text-3xl font-bold text-blue-700">{registrationRate}%</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{activity.currentParticipants}</span> / {activity.maxParticipants} người đăng ký
              </div>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-blue-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${registrationRate}%` }}
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

          {/* Excellent Employees List */}
          {excellentEmployees.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Danh sách nhân viên xuất sắc
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {excellentEmployees.map((employee) => (
                  <div 
                    key={employee.id}
                    className="flex items-center justify-between p-3 bg-linear-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {employee.id}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{employee.name}</p>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {employee.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin hoạt động</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
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
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-600">Địa điểm</p>
                  <p className="font-semibold text-gray-900">{activity.location || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-600">Loại hoạt động</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {activity.activityType === 'sports' ? 'Thể thao' :
                     activity.activityType === 'charity' ? 'Từ thiện' :
                     activity.activityType === 'training' ? 'Đào tạo' :
                     activity.activityType === 'team-building' ? 'Team Building' :
                     'Tình nguyện'}
                  </p>
                </div>
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
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20 min-w-55">
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
