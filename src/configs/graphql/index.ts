import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated';
import { getSessionSS } from '@/utils/session';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const defaultHeaders = {};
const getHeaders = (accessToken: string | null = null) => {
  const newHeaders: Record<string, string> = { ...defaultHeaders };
  if (accessToken) {
    newHeaders['Authorization'] = `Bearer ${accessToken}`;
  }
  return newHeaders;
};

export const getApiClient = (accessToken: string | null = null) => {
  return getSdk(
    new GraphQLClient(String(process.env.GRAPHQL_API_URL), {
      headers: getHeaders(accessToken)
    })
  );
};

export const getSubscriptionClient = (accessToken: string | null = null) => {
  return new SubscriptionClient(String(String(process.env.GRAPHQL_API_WS_URL)), {
    reconnect: true,
    connectionParams: {
      headers: getHeaders(accessToken)
    }
  });
};

export const apiClientInstance = getApiClient();
export const subscriptionClientInstance = getSubscriptionClient();

export const apiClientServer = async () => {
  const session = await getSessionSS();
  if (!session || !session.token?.accessToken) return apiClientInstance;
  return { ...getApiClient(session.token?.accessToken), session };
};

export const subscriptionServer = async () => {
  const session = await getSessionSS();
  if (!session || !session.token?.accessToken) return subscriptionClientInstance;
  return { ...getSubscriptionClient(session.token?.accessToken), session };
};
