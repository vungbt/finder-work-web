'use client';
import { Button } from '@/libraries/common';
import React from 'react';
import { onSignOut } from '@/@handles/auth';

export default function PortalEmployee() {
  return (
    <div>
      Portal employee
      <Button label="Sign out" onClick={onSignOut} />
    </div>
  );
}
