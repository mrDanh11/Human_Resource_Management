import { useEffect, useState } from 'react';
import { Award, TrendingUp, TrendingDown, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePointSummary } from '../../hooks/usePointSummary';
import { useRewardHistory } from '../../hooks/useRewardHistory';
import StatCard from '../../components/rewards/StatCard';
import FilterPanel from '../../components/rewards/FilterPanel';
import TransactionList from '../../components/rewards/TransactionList';
import { exportToPDF } from '../../utils/exportUtils';
import type { TransactionFilter } from '../../types/reward';

export default function RewardHistory() {
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>('');
  
  // Fetch employee ID and name from localStorage or auth context
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('name') || 'Nhân viên';
    if (id) {
      setEmployeeId(Number(id));
      setEmployeeName(name);
    }
  }, []);

  const { summary, loading: summaryLoading } = usePointSummary(employeeId);
  const { 
    transactions, 
    loading: transactionsLoading, 
    error, 
    filters,
    setFilters,
    refresh 
  } = useRewardHistory(employeeId);

  // Client-side filtering for status (since backend doesn't support it yet)
  const filteredTransactions = transactions.filter(t => {
    if (filters.status && t.status !== filters.status) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (filters: TransactionFilter) => {
    setFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    refresh();
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions, employeeName, summary || undefined);
  };

  if (!employeeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Vui lòng đăng nhập để xem lịch sử điểm thưởng</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">  
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-5 pointer-events-none" />
        
        <div className="flex-1 flex flex-col relative z-10">
          <div className="min-h-screen p-8">
            {/* Page Header */}
            <motion.header 
              className="mb-8 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-2xl p-8 bg-blue-600 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Award className="text-white" size={32} />
                      </div>
                      <h1 className="text-4xl font-bold text-white tracking-tight">
                        Lịch sử điểm thưởng
                      </h1>
                    </div>
                    
                    {/* Export PDF Button */}
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FileDown size={20} />
                      Xuất PDF
                    </button>
                  </div>
                  <p className="text-white/90 text-lg font-light">
                    Theo dõi toàn bộ lịch sử nhận và đổi điểm thưởng của bạn
                  </p>
                </div>
              </div>
            </motion.header>

            {/* Summary Cards */}
            {summaryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    className="bg-slate-200 rounded-xl h-32"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className="h-full w-full bg-linear-to-r from-slate-200 via-slate-300 to-slate-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : summary ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2)" }}
                >
                  <StatCard
                  title="Điểm hiện có"
                  value={summary.current}
                  variant="primary"
                  icon={<Award size={24} />}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)" }}
                >
                  <StatCard
                    title="Điểm nhận kỳ này"
                    value={`+${summary.earnedThisPeriod}`}
                    variant="success"
                    icon={<TrendingUp size={24} />}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.2)" }}
                >
                  <StatCard
                    title="Đã đổi thưởng kỳ này"
                    value={summary.redeemedThisPeriod > 0 ? `-${summary.redeemedThisPeriod}` : '0'}
                    variant="danger"
                    icon={<TrendingDown size={24} />}
                  />
                </motion.div>
              </motion.div>
            ) : null}

            {/* Main Content: Filter + Transaction List */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FilterPanel
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />

              <div className="lg:col-span-3">
                <TransactionList
                  transactions={filteredTransactions}
                  loading={transactionsLoading}
                  error={error}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
