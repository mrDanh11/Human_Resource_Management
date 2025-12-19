/**
 * ParticipantLimit - Participant limit input with unlimited option
 * Single Responsibility: Handle participant limit configuration
 */

import FormField from './FormField';

interface ParticipantLimitProps {
  isUnlimited: boolean;
  maxParticipants: number | null;
  error?: string;
  onUnlimitedChange: (unlimited: boolean) => void;
  onMaxChange: (value: number | null) => void;
  onBlur: () => void;
}

export default function ParticipantLimit({
  isUnlimited,
  maxParticipants,
  error,
  onUnlimitedChange,
  onMaxChange,
  onBlur,
}: ParticipantLimitProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-[#213547] font-['Open_Sans']">
        <input
          type="checkbox"
          checked={isUnlimited}
          onChange={(e) => onUnlimitedChange(e.target.checked)}
          className="rounded border-slate-300 text-[#535bf2] focus:ring-[#535bf2]"
        />
        Không giới hạn người tham gia
      </label>

      {!isUnlimited && (
        <FormField
          label="Giới hạn số lượng"
          required
          error={error}
          hint="5 - 1000 người"
        >
          <input
            type="number"
            value={maxParticipants || ''}
            onChange={(e) =>
              onMaxChange(e.target.value ? parseInt(e.target.value) : null)
            }
            onBlur={onBlur}
            min={5}
            max={1000}
            placeholder="Nhập số lượng (5-1000)"
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white font-['Open_Sans']"
          />
        </FormField>
      )}
    </div>
  );
}
