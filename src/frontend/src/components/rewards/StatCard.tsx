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
  primary: 'bg-[#1e3a8a] text-white shadow-md border border-[#1e40af]',
  success: 'bg-white border border-slate-400 text-[#213547] shadow-sm',
  danger: 'bg-white border border-slate-400 text-[#213547] shadow-sm',
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
  const titleColor = isPrimary ? 'text-blue-100' : 'text-slate-500';
  const valueSize = isPrimary ? 'text-5xl' : 'text-3xl';
  const padding = isPrimary ? 'p-8' : 'p-6';

  return (
    <div className={`rounded-lg ${padding} ${styles} font-['Open_Sans']`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${titleColor}`}>
          {title}
        </p>
        {icon && <div className={titleColor}>{icon}</div>}
      </div>
      
      <p className={`${valueSize} font-bold leading-none mt-4 mb-2`}>
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </p>
      
      {subtitle && (
        <p className={`text-sm mt-3 font-medium ${isPrimary ? 'text-blue-200' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
