import { useQuery } from '@tanstack/react-query';
export interface ServiceStatus {
  authEmail: boolean;
  emailReminders: boolean;
  googleLogin: boolean;
}
const unavailable: ServiceStatus = {
  authEmail: false,
  emailReminders: false,
  googleLogin: false,
};
export function useServiceStatus() {
  return useQuery({
    queryKey: ['service-status'],
    queryFn: async () => {
      const response = await fetch('/.netlify/functions/service-status');
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
        return unavailable;
      return response.json() as Promise<ServiceStatus>;
    },
    staleTime: 60000,
    retry: false,
  });
}
