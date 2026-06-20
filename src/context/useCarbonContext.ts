import { useContext } from 'react';
import { CarbonContext, type CarbonContextValue } from './carbonContextDef';

export function useCarbonContext(): CarbonContextValue {
  const context = useContext(CarbonContext);
  if (context === null) {
    throw new Error('useCarbonContext must be used within a CarbonProvider');
  }
  return context;
}
