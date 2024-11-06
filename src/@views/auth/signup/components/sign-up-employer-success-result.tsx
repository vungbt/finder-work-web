import { StatusCodes } from '@/constants/common';
import { RouterPath } from '@/constants/router-path';
import { Button, SuccessResult } from '@/libraries/common';
import { useRouter } from '@/utils/navigation';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSignUpEmployer } from '../providers';

export default function SignUpEmployerSuccessResult() {
  const t = useTranslations();
  const {
    state: { formData }
  } = useSignUpEmployer();
  const router = useRouter();

  const onHandleLogin = async () => {
    // TODO: Handle error and success
    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    const errors = res?.error;
    if (!errors && res?.status === StatusCodes.OK) {
      router.replace(RouterPath.PORTAL);
    }
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
