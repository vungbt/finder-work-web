'use client';
import useInitBase from '@/hooks/useInitBase';
import React from 'react';

const AppInit = () => {
  useInitBase();
  return <></>;
};

function BaseInit() {
  return <AppInit />;
}

export default React.memo(BaseInit);
