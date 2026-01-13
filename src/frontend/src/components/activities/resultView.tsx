import { RESULT_LABEL_MAP } from '../../utils/result';
import { fallbackLabel } from '../../utils/resultFormat';
import { parseResult } from '../../utils/result';
import { getIcon, formatValue } from './resultDisplay';

export const ResultView = ({ result }: { result: any }) => {
  const data = parseResult(result);

  if (Object.keys(data).length === 0) {
    return (
      <p className="mt-2 text-sm italic text-gray-500">
        Chưa có kết quả
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="divide-y">
        {Object.entries(data).map(([key, value]) => {
          const label = RESULT_LABEL_MAP[key] || fallbackLabel(key);

          return (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2 text-gray-700">
                {getIcon(key)}
                <span className="font-medium">{label}</span>
              </div>

              <div className="text-gray-900 font-semibold">
                {formatValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
