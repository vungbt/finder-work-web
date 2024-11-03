'use client';
import { onSignOut } from '@/@handles/auth';
import { Button } from '@/libraries/common';
import React from 'react';

export default function PortalEmployer() {
  return (
    <div>
      Portal employer
      <Button label="Sign out" onClick={onSignOut} />
    </div>
  );
}
