'use client';
import { Button } from '@/libraries/common';
import React from 'react';
import { signOut } from 'next-auth/react';

export default function PortalEmployer() {
  return (
    <div>
      Portal employer
      <Button label="Sign out" onClick={() => signOut()} />
    </div>
  );
}
