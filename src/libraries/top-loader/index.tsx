'use client';
import { onComplete } from '@/utils/router-events';
import { usePathname, useSearchParams } from 'next/navigation';
import * as NProgress from 'nprogress';
import React, { Suspense, useEffect } from 'react';

function Innards() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => onComplete(), [pathname, searchParams]);
  return null;
}

type TopLoaderProps = {
  startPosition?: number;
  options?: Partial<NProgress.NProgressOptions>;
};

const TopLoader = ({ startPosition = 0.3, options }: TopLoaderProps) => {
  useEffect(() => {
    if (options) {
      NProgress.configure(options);
      NProgress.set(startPosition);
    }
  }, [options, startPosition]);

  return (
    <Suspense fallback={null}>
      <Innards />
    </Suspense>
  );
};

export default React.memo(TopLoader);
