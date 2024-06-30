import { RouterPath } from '@/constants/router-path';
import { Button, SuccessResult } from '@/libraries/common';
import { useRouter } from '@/utils/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useForgotPasswordEmployee } from '../providers';

export default function ForgotPasswordSuccessResult() {
  const t = useTranslations();
  const {
    state: { formData }
  } = useForgotPasswordEmployee();
  const router = useRouter();

  const onHandleLogin = () => {
    // TODO: CALL API LOGIN
    console.log('formData====>', formData);
    router.push(RouterPath.Home);
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
        title={t('common.passwordResetSuccessfully')}
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
