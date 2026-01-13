import { useEffect, useState } from 'react';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { usePointSummary } from '../../hooks/usePointSummary';
import { useRewardHistory } from '../../hooks/useRewardHistory';
import StatCard from '../../components/rewards/StatCard';
import FilterPanel from '../../components/rewards/FilterPanel';
import TransactionList from '../../components/rewards/TransactionList';
import type { TransactionFilter } from '../../types/reward';

export default function RewardHistory() {
  const [employeeId, setEmployeeId] = useState<number>(0);
  
  // Fetch employee ID from localStorage or auth context
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setEmployeeId(Number(id));
    }
  }, []);

  const { summary, loading: summaryLoading } = usePointSummary(employeeId);
  const { 
    transactions, 
    loading: transactionsLoading, 
    error, 
    setFilters,
    refresh 
  } = useRewardHistory(employeeId);

  const handleFilterChange = (filters: TransactionFilter) => {
    setFilters(filters);
    // TODO: Implement backend filtering when API supports it
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    refresh();
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
      <div className="flex bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">       
        <div className="flex-1 flex flex-col">
          <div className="min-h-screen p-8">
            {/* Page Header */}
            <header className="mb-8 relative">
              <div className="relative rounded-2xl p-8 bg-blue-600 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Award className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                      Lịch sử điểm thưởng
                    </h1>
                  </div>
                  <p className="text-white/90 text-lg font-light">
                    Theo dõi toàn bộ lịch sử nhận và đổi điểm thưởng của bạn
                  </p>
                </div>
              </div>
            </header>

            {/* Summary Cards */}
            {summaryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-200 rounded-xl h-32 animate-pulse" />
                ))}
              </div>
            ) : summary ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Điểm hiện có"
                  value={summary.current}
                  subtitle={`≈ ${(summary.current * summary.conversionRate).toLocaleString('vi-VN')} VND`}
                  variant="primary"
                  icon={<Award size={24} />}
                />
                <StatCard
                  title="Điểm nhận kỳ này"
                  value={`+${summary.earnedThisPeriod}`}
                  variant="success"
                  icon={<TrendingUp size={24} />}
                />
                <StatCard
                  title="Đã đổi thưởng kỳ này"
                  value={summary.redeemedThisPeriod > 0 ? `-${summary.redeemedThisPeriod}` : '0'}
                  variant="danger"
                  icon={<TrendingDown size={24} />}
                />
              </div>
            ) : null}

            {/* Main Content: Filter + Transaction List */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <FilterPanel
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />

              <div className="lg:col-span-3">
                <TransactionList
                  transactions={transactions}
                  loading={transactionsLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
