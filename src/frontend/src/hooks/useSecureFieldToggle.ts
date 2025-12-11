import { useState, useCallback } from "react";

/**
 * Hook for managing secure field visibility toggles
 */
export function useSecureFieldToggle() {
  const [show, setShow] = useState<Record<string, boolean>>({});

  const toggle = useCallback((fieldName: string) => {
    setShow((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  }, []);

  const isVisible = useCallback((fieldName: string) => {
    return !!show[fieldName];
  }, [show]);

  return { toggle, isVisible };
}
