'use client';
import React, { ReactNode } from 'react';

type CareersViewProps = {
  children: ReactNode;
};

export function CareersView({ children }: CareersViewProps) {
  return <div>{children}</div>;
}
