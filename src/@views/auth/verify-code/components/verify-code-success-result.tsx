import { RouterPath } from '@/constants/router-path';
import { Button, SuccessResult } from '@/libraries/common';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useVerifyCode } from '../providers';
import { useRouter } from '@/utils/navigation';

export default function VerifySuccessResult() {
  const t = useTranslations();
  const router = useRouter();
  const {
    state: { formData }
  } = useVerifyCode();

  const onHandleLogin = async () => {
    // TODO: Handle error
    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    const errors = res?.error;
    if (errors) return;
    router.replace(RouterPath.PORTAL);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto h-full flex items-center justify-center pb-[30%]"
    >
      <SuccessResult
        title={t('common.registrationSuccessful')}
        subTitle={t('common.yourSignupHasBeenCompleted')}
        extra={
          <div className="mt-10 w-full">
            <Button
              onClick={onHandleLogin}
              minWidth="full"
              label={t('form.login')}
              styleType="info"
            />
          </div>
        }
      />
    </motion.div>
  );
}
