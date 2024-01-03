import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { RenderIcon } from '../icons';

export function HydrateWrapper({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center">
        <RenderIcon name="loading" />
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
}
