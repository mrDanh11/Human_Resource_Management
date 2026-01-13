import { RESULT_ICON_MAP } from '../../utils/resultIcon';

export const getIcon = (key: string) => {
  const Icon = RESULT_ICON_MAP[key];
  if (!Icon) return null;

  return <Icon size={16} className="text-blue-600" />;
};

export const formatValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">Chưa có</span>;
  }

  // Array (ví dụ: tasks_completed)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-gray-400 italic">Không có</span>;
    }

    return (
      <div className="flex flex-wrap gap-2 justify-end">
        {value.map((item, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700"
          >
            {String(item).replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    );
  }

  // Boolean
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-green-600 font-semibold">Có</span>
    ) : (
      <span className="text-red-500 font-semibold">Không</span>
    );
  }

  // Object (fallback)
  if (typeof value === 'object') {
    return (
      <span className="text-gray-500 italic">
        {JSON.stringify(value)}
      </span>
    );
  }

  // String / Number
  return <span>{String(value)}</span>;
};
