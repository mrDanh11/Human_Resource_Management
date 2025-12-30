import { useState, useCallback } from 'react';
import type { CampaignFormData, CampaignValidationErrors } from '../types/activity';

// Stub validation functions (validation logic removed)
const validateCampaignForm = (_data: CampaignFormData, _isUnlimited: boolean): CampaignValidationErrors => ({
  // stub validation: include required 'points' property to satisfy the type
  points: 0,
});
const hasValidationErrors = (errors: CampaignValidationErrors): boolean => Object.keys(errors).length > 0;

interface UseActivitiesFormReturn {
  formData: CampaignFormData;
  errors: CampaignValidationErrors;
  isUnlimited: boolean;
  touched: Set<string>;
  isSubmitting: boolean;
  isValid: boolean;
  updateField: (field: keyof CampaignFormData, value: string | number | null) => void;
  setUnlimited: (unlimited: boolean) => void;
  markTouched: (field: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  handleSubmit: (onSuccess: (data: CampaignFormData) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>;
}

const initialFormData: CampaignFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  maxParticipants: 50,
  imageUrl: '',
};

export function useActivitiesForm(): UseActivitiesFormReturn {
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<CampaignValidationErrors>({ points: 0 });
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update single field
  const updateField = useCallback(
    (field: keyof CampaignFormData, value: string | number | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Revalidate on change if field was touched
      if (touched.has(field)) {
        const newData = { ...formData, [field]: value };
        const newErrors = validateCampaignForm(newData, isUnlimited);
        setErrors(newErrors);
      }
    },
    [formData, isUnlimited, touched]
  );

  // Set unlimited participants
  const setUnlimited = useCallback((unlimited: boolean) => {
    setIsUnlimited(unlimited);
    if (unlimited) {
      setFormData((prev) => ({ ...prev, maxParticipants: null }));
      setErrors((prev) => {
        const { maxParticipants, ...rest } = prev;
        return rest;
      });
    } else {
      setFormData((prev) => ({ ...prev, maxParticipants: 50 }));
    }
  }, []);

  // Mark field as touched
  const markTouched = useCallback((field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors = validateCampaignForm(formData, isUnlimited);
    setErrors(newErrors);
    return !hasValidationErrors(newErrors);
  }, [formData, isUnlimited]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({ points: 0 });
    setIsUnlimited(false);
    setTouched(new Set());
    setIsSubmitting(false);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (onSuccess: (data: CampaignFormData) => void | Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allFields = Object.keys(formData);
        setTouched(new Set(allFields));

        // Validate
        if (!validateForm()) {
          return;
        }

        setIsSubmitting(true);
        try {
          await onSuccess(formData);
        } finally {
          setIsSubmitting(false);
        }
      },
    [formData, validateForm]
  );

  const isValid = !hasValidationErrors(errors);

  return {
    formData,
    errors,
    isUnlimited,
    touched,
    isSubmitting,
    isValid,
    updateField,
    setUnlimited,
    markTouched,
    validateForm,
    resetForm,
    handleSubmit,
  };
}
