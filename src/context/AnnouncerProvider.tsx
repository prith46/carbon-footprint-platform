import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { AnnouncerContext } from './announcerContextDef';

const CLEAR_DELAY_MS = 4000;

export function AnnouncerProvider({ children }: { children: ReactNode }): ReactNode {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((text: string): void => {
    setMessage(text);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setMessage(''), CLEAR_DELAY_MS);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div aria-live="polite" role="status" className="sr-live-region">
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}
