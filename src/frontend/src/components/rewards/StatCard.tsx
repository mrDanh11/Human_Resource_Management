/**
 * StatCard - Reusable statistic card component
 * Single Responsibility: Display a single stat metric
 * Open/Closed: Can add variants without modifying component
 */

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'success' | 'danger';
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl border-2 border-white hover:scale-105',
  success: 'bg-white border-2 border-green-200 text-gray-800 shadow-lg hover:shadow-xl hover:border-green-300',
  danger: 'bg-white border-2 border-red-200 text-gray-800 shadow-lg hover:shadow-xl hover:border-red-300',
};

export default function StatCard({
  title,
  value,
  subtitle,
  variant = 'primary',
  icon,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isPrimary = variant === 'primary';
  const titleColor = isPrimary ? 'text-white/80' : 'text-slate-500';
  const valueSize = isPrimary ? 'text-5xl' : 'text-4xl';
  const padding = isPrimary ? 'p-8' : 'p-6';

  return (
    <div className={`rounded-2xl ${padding} ${styles} font-['Open_Sans'] transition-all duration-300 overflow-hidden relative`}>
      {isPrimary && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        </>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className={`text-xs font-bold uppercase tracking-wider ${titleColor}`}>
            {title}
          </p>
          {icon && (
            <div className={`${isPrimary ? 'bg-white/20 p-2 rounded-lg' : 'text-gray-600'}`}>
              {icon}
            </div>
          )}
        </div>
        
        <p className={`${valueSize} font-bold leading-none mt-4 mb-3`}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
        
        {subtitle && (
          <p className={`text-sm mt-3 font-semibold ${isPrimary ? 'text-white/90' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
