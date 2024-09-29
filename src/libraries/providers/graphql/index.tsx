'use client';
import {
  apiClientInstance,
  getApiClient,
  getSubscriptionClient,
  subscriptionClientInstance
} from '@/configs/graphql';
import useSessionClient from '@/hooks/redux/session/useSession';
import React, { ReactNode, useContext, useMemo } from 'react';

export const ApiClientContext = React.createContext({
  apiClient: apiClientInstance,
  subscription: subscriptionClientInstance
});

type ApiClientProviderProps = {
  children: JSX.Element | ReactNode;
};

export const ApiClientProvider = ({ children }: ApiClientProviderProps) => {
  const { session } = useSessionClient();

  const apiClient = useMemo(() => {
    const accessToken = session?.token?.accessToken;
    if (accessToken) {
      return getApiClient(accessToken);
    }
    return apiClientInstance;
  }, [session]);

  const subscription = useMemo(() => {
    const accessToken = session?.token?.accessToken;
    if (accessToken) {
      return getSubscriptionClient(accessToken);
    }
    return subscriptionClientInstance;
  }, [session]);

  return (
    <ApiClientContext.Provider
      value={{
        apiClient,
        subscription
      }}
    >
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = () => {
  return useContext(ApiClientContext);
};
