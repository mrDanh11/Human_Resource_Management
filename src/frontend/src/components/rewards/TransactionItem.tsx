/**
 * TransactionItem - Display a single transaction record
 * Single Responsibility: Render transaction details
 */

import type { TransactionRecord } from '../../types/reward';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface TransactionItemProps {
  transaction: TransactionRecord;
}

const typeIcons = {
  earn: TrendingUp,
  redeem: TrendingDown,
  adjust: RefreshCw,
};

const typeColors = {
  earn: 'text-emerald-600',
  redeem: 'text-orange-600',
  adjust: 'text-blue-600',
};

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const IconComponent = typeIcons[transaction.type as keyof typeof typeIcons] || RefreshCw;
  const isPositive = transaction.amount > 0;

  return (
    <div 
      className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/50 transition-colors group font-['Open_Sans']"
      title={`${transaction.typeDisplay} - ${transaction.statusDisplay}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
          <IconComponent size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <p className="font-semibold text-[#213547] text-[15px] leading-snug">
              {transaction.description}
            </p>
            <span className={`text-lg font-bold tabular-nums flex-shrink-0 ${isPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
              {isPositive ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <span className="text-[#535bf2] font-medium">{transaction.typeDisplay}</span>
            <span className="text-slate-300">•</span>
            <span>{new Date(transaction.date).toLocaleDateString('vi-VN')}</span>
            {transaction.actor && (
              <>
                <span className="text-slate-300">•</span>
                <span title={`Người thực hiện: ${transaction.actor}`}>bởi {transaction.actor}</span>
              </>
            )}
            {transaction.statusDisplay !== 'Thành công' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600 font-medium">{transaction.statusDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
