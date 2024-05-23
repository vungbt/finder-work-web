/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type SearchQuery = {
  [key: string]: string;
};

type UseSearchQueryResult<T> = {
  searchQuery?: T;
  add: (values: SearchQuery) => void;
};

export function useSearchQuery<T extends Record<string, string>>(
  initialState?: T
): UseSearchQueryResult<T> {
  const [searchQuery, setSearchQuery] = useState<T | undefined>(initialState);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Update the searchQuery state when searchParams change
    const params = new URLSearchParams(searchParams);
    const updatedQuery: any = initialState ? { ...initialState } : {};
    params.forEach((value, key) => {
      updatedQuery[key] = value;
    });
    setSearchQuery(updatedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const add = (updatedQuery: any) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key]) {
        params.set(key, updatedQuery[key]);
      } else {
        params.delete(key);
      }
    });
    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(updatedPath);
  };

  return {
    searchQuery,
    add
  };
}
