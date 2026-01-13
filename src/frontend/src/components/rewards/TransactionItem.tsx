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
      className="flex items-center justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group font-['Open_Sans'] border-l-4 border-transparent hover:border-blue-500"
      title={`${transaction.typeDisplay} - ${transaction.statusDisplay}`}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${isPositive ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4 mb-2">
            <p className="font-bold text-gray-800 text-base leading-snug">
              {transaction.description}
            </p>
            <span className={`text-2xl font-bold tabular-nums flex-shrink-0 ${isPositive ? 'text-green-600' : 'text-orange-600'}`}>
              {isPositive ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">{transaction.typeDisplay}</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium">{new Date(transaction.date).toLocaleDateString('vi-VN')}</span>
            {transaction.actor && (
              <>
                <span className="text-gray-300">•</span>
                <span title={`Người thực hiện: ${transaction.actor}`} className="text-gray-500">bởi <span className="font-semibold">{transaction.actor}</span></span>
              </>
            )}
            {transaction.statusDisplay !== 'Thành công' && (
              <>
                <span className="text-gray-300">•</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold text-xs">{transaction.statusDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
