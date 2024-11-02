import { VerifyCodeView } from '@/@views/auth/verify-code';
import { VerifyCodeProvider } from '@/@views/auth/verify-code/providers';
import React from 'react';

export default function VerifyCodePage() {
  return (
    <VerifyCodeProvider>
      <VerifyCodeView />
    </VerifyCodeProvider>
  );
}
