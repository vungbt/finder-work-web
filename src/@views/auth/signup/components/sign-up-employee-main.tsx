import { RouterPath } from '@/constants/router-path';
import { Button, GoogleLoginButton, LineText, Logo } from '@/libraries/common';
import { Link } from '@/utils/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSignUpEmployee } from '../providers';

function SignUpEmployeeMain() {
  const t = useTranslations();
  const {
    actions,
    state: { formData }
  } = useSignUpEmployee();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto"
    >
      <Link href={RouterPath.Home}>
        <Logo />
      </Link>
      <h1 className="text-3xl font-bold mt-4">
        {t('common.registerAs', { role: t('jobSeeker') })}
      </h1>
      <p className="mt-4 mb-10 text-text-secondary">{t('banner.stepIntoSuccess')}</p>

      <Button
        className="mt-10"
        minWidth="full"
        styleType="info"
        label={t('common.registerWithEmail')}
        onClick={() => actions.nextStep(formData)}
      />

      <LineText label={t('common.or')} classNameLabel="lowercase" classNameWrap="my-6" />
      <GoogleLoginButton />
      <div className="flex items-center justify-center gap-2 mt-6">
        <p>{t('common.alreadyHaveAnAccount')}</p>
        <Link href={RouterPath.Login} className="text-sm font-semibold">
          {t('form.loginHere')}
        </Link>
      </div>
    </motion.div>
  );
}

export default SignUpEmployeeMain;
