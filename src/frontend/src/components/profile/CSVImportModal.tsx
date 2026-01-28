import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { useAppDispatch } from '../../store/hooks';
import { createEmployee } from '../../store/employeeSlice';
import { useNavigate } from 'react-router-dom';

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CSVImportModal = ({ isOpen, onClose }: CSVImportModalProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'hr';
    
    const [csvData, setCsvData] = useState<any[]>([]);
    const [validRows, setValidRows] = useState<any[]>([]);
    const [invalidRows, setInvalidRows] = useState<any[]>([]);
    const [csvErrors, setCsvErrors] = useState<string[]>([]);
    const [invalidCells, setInvalidCells] = useState<Map<number, Set<string>>>(new Map());
    const [importLoading, setImportLoading] = useState(false);

    const validateCsvRow = (row: any, index: number): { errors: string[], invalidFields: Set<string> } => {
        const errors: string[] = [];
        const invalidFields = new Set<string>();
        const requiredFields = ['fullname', 'birthday', 'phone', 'cccd', 'address', 'joinDate', 'gender', 'departmentId', 'roleId', 'bankAccount'];
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!row[field] || row[field].toString().trim() === '') {
                errors.push(`Dòng ${index + 2}: Thiếu trường "${field}"`);
                invalidFields.add(field);
            }
        });

        // Validate formats (luôn validate nếu field có giá trị)
        const phone = row.phone?.toString().trim() || '';
        if (phone && !/^[0-9]{10}$/.test(phone)) {
            errors.push(`Dòng ${index + 2}: Số điện thoại không hợp lệ (phải 10 chữ số)`);
            invalidFields.add('phone');
        }

        const cccd = row.cccd?.toString().trim() || '';
        if (cccd && !/^[0-9]{12}$/.test(cccd)) {
            errors.push(`Dòng ${index + 2}: Số CCCD không hợp lệ (phải 12 chữ số)`);
            invalidFields.add('cccd');
        }

        const taxCode = row.taxCode?.toString().trim() || '';
        if (taxCode && !/^[0-9]{10}$/.test(taxCode)) {
            errors.push(`Dòng ${index + 2}: Mã số thuế không hợp lệ (phải 10 chữ số)`);
            invalidFields.add('taxCode');
        }

        const bankAccount = row.bankAccount?.toString().trim() || '';
        if (bankAccount && !/^[0-9]{8,15}$/.test(bankAccount)) {
            errors.push(`Dòng ${index + 2}: Số tài khoản không hợp lệ (8-15 chữ số)`);
            invalidFields.add('bankAccount');
        }

        const email = row.email?.toString().trim() || '';
        if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/.test(email)) {
            errors.push(`Dòng ${index + 2}: Email không hợp lệ`);
            invalidFields.add('email');
        }

        // Validate gender
        const gender = row.gender?.toString().trim().toLowerCase() || '';
        if (gender && !['male', 'female', 'other', 'nam', 'nữ', 'nu'].includes(gender)) {
            errors.push(`Dòng ${index + 2}: Giới tính không hợp lệ (phải là male, female, hoặc other)`);
            invalidFields.add('gender');
        }

        // Validate departmentId và roleId phải là số
        const departmentId = row.departmentId?.toString().trim() || '';
        if (departmentId && (isNaN(Number(departmentId)) || Number(departmentId) <= 0)) {
            errors.push(`Dòng ${index + 2}: ID Phòng ban không hợp lệ (phải là số dương)`);
            invalidFields.add('departmentId');
        }

        const roleId = row.roleId?.toString().trim() || '';
        if (roleId && (isNaN(Number(roleId)) || Number(roleId) <= 0)) {
            errors.push(`Dòng ${index + 2}: ID Vai trò không hợp lệ (phải là số dương)`);
            invalidFields.add('roleId');
        }

        return { errors, invalidFields };
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy',
            complete: (results) => {
                const allErrors: string[] = [];
                const cellErrors = new Map<number, Set<string>>();
                const valid: any[] = [];
                const invalid: any[] = [];
                
                results.data.forEach((row: any, index) => {
                    const { errors, invalidFields } = validateCsvRow(row, index);
                    if (errors.length > 0) {
                        allErrors.push(...errors);
                        cellErrors.set(index, invalidFields);
                        invalid.push({ ...row, _rowIndex: index, _invalidFields: invalidFields });
                    } else {
                        valid.push(row);
                    }
                });

                setCsvErrors(allErrors);
                setInvalidCells(cellErrors);
                setCsvData(results.data);
                setValidRows(valid);
                setInvalidRows(invalid);
            },
            error: (error) => {
                alert('Lỗi khi đọc file CSV: ' + error.message);
            }
        });

        e.target.value = '';
    };

    const handleImportCsv = async () => {
        if (validRows.length === 0) return;

        setImportLoading(true);
        try {
            let successCount = 0;
            let failCount = 0;
            const errors: string[] = [];

            for (let i = 0; i < validRows.length; i++) {
                const row = validRows[i];
                try {
                    await dispatch(createEmployee({
                        fullname: row.fullname,
                        birthday: row.birthday,
                        phone: row.phone,
                        cccd: row.cccd,
                        taxCode: row.taxCode || null,
                        address: row.address,
                        email: row.email,
                        joinDate: row.joinDate,
                        gender: row.gender,
                        departmentId: parseInt(row.departmentId),
                        roleId: parseInt(row.roleId),
                        bankAccount: row.bankAccount,
                    })).unwrap();
                    successCount++;
                } catch (error: any) {
                    failCount++;
                    errors.push(`Dòng ${i + 2} (${row.fullname}): ${error.message || 'Lỗi không xác định'}`);
                }
            }

            if (failCount === 0) {
                alert(`Tạo thành công ${successCount} nhân viên!`);
                onClose();
                navigate(`/${role}/employee/list`);
            } else {
                const message = `Tạo thành công ${successCount}/${validRows.length} nhân viên hợp lệ.\n\nLỗi (${failCount}):\n${errors.join('\n')}`;
                alert(message);
                if (successCount > 0) {
                    onClose();
                    navigate(`/${role}/employee/list`);
                }
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi import dữ liệu!');
        } finally {
            setImportLoading(false);
        }
    };

    const handleClose = () => {
        if (!importLoading) {
            setCsvData([]);
            setValidRows([]);
            setInvalidRows([]);
            setCsvErrors([]);
            setInvalidCells(new Map());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Import Nhân viên từ CSV</h2>
                                </div>
                                <motion.button
                                    onClick={handleClose}
                                    disabled={importLoading}
                                    className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="space-y-4">
                                {/* File Upload */}
                                <div>
                                    <label className="block mb-2">
                                        <div className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer bg-blue-50/50">
                                            <div className="text-center">
                                                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Chọn file CSV để import
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    File phải có các cột: fullname, birthday, phone, cccd, address, email, joinDate, gender, departmentId, roleId, bankAccount
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            disabled={importLoading}
                                        />
                                    </label>
                                </div>

                                {/* CSV Error Review */}
                                <AnimatePresence>
                                    {csvErrors.length > 0 && (
                                        <motion.div
                                            className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-red-800 mb-2">
                                                        Danh sách {invalidCells.size} dòng có lỗi trong file CSV
                                                    </h3>
                                                    <p className="text-sm text-red-700 mb-3">
                                                        Tìm thấy {validRows.length} dòng hợp lệ và {invalidCells.size} dòng lỗi. Chỉ {validRows.length} dòng hợp lệ sẽ được import.
                                                    </p>
                                                    <div className="max-h-60 overflow-y-auto space-y-3">
                                                        {Array.from(invalidCells.entries()).map(([rowIndex, fields]) => {
                                                            const row = csvData[rowIndex];
                                                            const rowNumber = rowIndex + 2;
                                                            const errorList = csvErrors.filter(err => err.startsWith(`Dòng ${rowNumber}:`));
                                                            
                                                            return (
                                                                <div key={rowIndex} className="bg-white rounded-lg p-3 border border-red-200">
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="font-semibold text-red-700">Dòng {rowNumber}</span>
                                                                                <span className="text-gray-600">•</span>
                                                                                <span className="text-gray-800 font-medium">
                                                                                    {row.fullname || <span className="text-red-500 italic">Chưa có tên</span>}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-xs text-gray-600 mb-2">
                                                                                Các trường lỗi: <span className="font-semibold text-red-600">
                                                                                    {Array.from(fields).join(', ')}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1 text-sm">
                                                                        {errorList.map((error, idx) => (
                                                                            <p key={idx} className="text-red-700 pl-2 border-l-2 border-red-300">
                                                                                • {error.replace(`Dòng ${rowNumber}: `, '')}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Invalid Rows Table */}
                                <AnimatePresence>
                                    {invalidRows.length > 0 && (
                                        <motion.div
                                            className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <div className="flex items-start gap-3 mb-4">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1 text-red-800">
                                                        Bảng {invalidRows.length} dòng không hợp lệ
                                                    </h3>
                                                    <p className="text-sm text-red-700">
                                                        Các ô màu đỏ là dữ liệu không hợp lệ hoặc thiếu:
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto max-h-96 overflow-y-auto border border-red-200 rounded-lg">
                                                <table className="min-w-full divide-y divide-red-200 text-sm">
                                                    <thead className="bg-red-100 sticky top-0">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">STT</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">Họ tên</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">Ngày sinh</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">SĐT</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">CCCD</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">Email</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">Phòng ban</th>
                                                            <th className="px-3 py-2 text-left font-medium text-red-800">Tài khoản</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-red-100">
                                                        {invalidRows.map((row: any, idx: number) => {
                                                            const fields = row._invalidFields as Set<string>;
                                                            return (
                                                                <tr key={idx} className="bg-red-50/30">
                                                                    <td className="px-3 py-2">{row._rowIndex + 2}</td>
                                                                    <td className={`px-3 py-2 ${fields?.has('fullname') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.fullname || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('birthday') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.birthday || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('phone') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.phone || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('cccd') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.cccd || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('email') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.email || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('departmentId') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.departmentId || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                    <td className={`px-3 py-2 ${fields?.has('bankAccount') ? 'text-red-600 font-semibold bg-red-100' : ''}`}>
                                                                        {row.bankAccount || <span className="text-red-500 italic">Thiếu</span>}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* CSV Preview */}
                                <AnimatePresence>
                                    {csvData.length > 0 && (
                                        <motion.div
                                            className={`border-2 rounded-xl p-4 ${csvErrors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <div className="flex items-start gap-3 mb-4">
                                                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${csvErrors.length > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold mb-1 ${csvErrors.length > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                                                        {csvErrors.length > 0 ? `${validRows.length} dòng hợp lệ sẽ được import` : 'File CSV hợp lệ'}
                                                    </h3>
                                                    <p className={`text-sm ${csvErrors.length > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                                                        {csvErrors.length > 0 ? `Xem trước ${validRows.length} nhân viên hợp lệ bên dưới (${invalidCells.size} dòng lỗi đã bị loại bỏ):` : `Tìm thấy ${validRows.length} nhân viên hợp lệ:`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto max-h-96 overflow-y-auto border border-green-200 rounded-lg">
                                                <table className="min-w-full divide-y divide-green-200 text-sm">
                                                    <thead className="bg-green-100 sticky top-0">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">STT</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">Họ tên</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">Ngày sinh</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">SĐT</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">CCCD</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">Email</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">Phòng ban</th>
                                                            <th className="px-3 py-2 text-left font-medium text-green-800">Tài khoản</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-green-100">
                                                        {validRows.map((row: any, idx: number) => (
                                                            <tr key={idx} className="hover:bg-green-50">
                                                                <td className="px-3 py-2">{idx + 1}</td>
                                                                <td className="px-3 py-2">{row.fullname}</td>
                                                                <td className="px-3 py-2">{row.birthday}</td>
                                                                <td className="px-3 py-2">{row.phone}</td>
                                                                <td className="px-3 py-2">{row.cccd}</td>
                                                                <td className="px-3 py-2">{row.email}</td>
                                                                <td className="px-3 py-2">{row.departmentId}</td>
                                                                <td className="px-3 py-2">{row.bankAccount}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-6 bg-gray-50">
                            <div className="flex justify-end gap-4">
                                <motion.button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={importLoading}
                                    className="px-6 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                                    whileHover={{ scale: importLoading ? 1 : 1.02, y: importLoading ? 0 : -2 }}
                                    whileTap={{ scale: importLoading ? 1 : 0.98 }}
                                >
                                    <X className="w-4 h-4" />
                                    Hủy
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={handleImportCsv}
                                    disabled={importLoading || validRows.length === 0}
                                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                                    whileHover={{ scale: (importLoading || validRows.length === 0) ? 1 : 1.02, y: (importLoading || validRows.length === 0) ? 0 : -2 }}
                                    whileTap={{ scale: (importLoading || validRows.length === 0) ? 1 : 0.98 }}
                                >
                                    {importLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Đang import...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Import {validRows.length > 0 ? validRows.length : ''} nhân viên hợp lệ
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CSVImportModal;
