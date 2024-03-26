import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '.';

export function GoogleLoginButton() {
  const t = useTranslations();

  const onLoginWithGoogle = async () => await signIn('google', { callbackUrl: '/' });

  return (
    <Button
      iconLeft="google"
      minWidth="full"
      label={t('form.loginWith', { label: t('form.google') })}
      onClick={() => onLoginWithGoogle()}
    />
  );
}
