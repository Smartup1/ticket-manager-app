import { getApiClient } from '@/services/api-client/api';
import { createContext, useContext, useMemo } from 'react';

const ApiContext = createContext<ReturnType<typeof getApiClient> | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useMemo(() => getApiClient(), []);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export const useApi = () => {
  const api = useContext(ApiContext);
  if (!api) throw new Error('useApi must be used within an ApiProvider');

  return api;
}