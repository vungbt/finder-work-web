'use client';
import { Button } from '@/libraries/common';
import React from 'react';
import { signOut } from 'next-auth/react';

export default function PortalEmployee() {
  return (
    <div>
      Portal employee
      <Button label="Sign out" onClick={() => signOut()} />
    </div>
  );
}
