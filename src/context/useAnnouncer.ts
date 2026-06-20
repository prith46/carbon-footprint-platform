import { useContext } from 'react';
import { AnnouncerContext, type AnnounceFn } from './announcerContextDef';

export function useAnnouncer(): AnnounceFn {
  const announce = useContext(AnnouncerContext);
  if (announce === null) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider');
  }
  return announce;
}
