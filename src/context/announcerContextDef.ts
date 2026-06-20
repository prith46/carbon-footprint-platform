import { createContext } from 'react';

export type AnnounceFn = (message: string) => void;

export const AnnouncerContext = createContext<AnnounceFn | null>(null);
