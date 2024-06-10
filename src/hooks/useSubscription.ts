/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { DocumentNode } from 'graphql';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function useSubscription<T>(query?: string | DocumentNode, variables?: any) {
  const { subscription } = useApiClient();
  const t = useTranslations();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const sub = subscription
      .request({
        query,
        variables
      })
      .subscribe({
        next: (result: any) => setData(result.data),
        error: (err: any) => {
          setError(err);
          getErrorMss(err, t('noti.createError'));
        }
      });

    return () => sub.unsubscribe();
  }, [query, subscription, t, variables]);

  return { data, error };
}
