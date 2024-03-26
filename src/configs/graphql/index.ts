import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated';

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

export const apiClientInstance = getApiClient();
