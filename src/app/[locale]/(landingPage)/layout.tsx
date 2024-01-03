import { RouterPath } from '@/constants/router-path';
import { MainLayout } from '@/libraries/layouts/main';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export default function LandingPageLayout(props: { employee: ReactNode; employer: ReactNode }) {
  const t = useTranslations();

  // have fetching get config
  const header = {
    navigation: {
      employee: [
        { title: t('navigation.jobDiscovery'), url: RouterPath.Discoveries },
        { title: t('navigation.career'), url: RouterPath.Careers },
        { title: t('navigation.resumeBuilder'), url: RouterPath.ResumeBuilder },
        { title: t('navigation.aboutUs'), url: RouterPath.AboutUs },
        { title: '', url: '', isLine: true },
        { title: t('navigation.login'), url: RouterPath.Login, showInLg: true },
        { title: t('navigation.register'), url: RouterPath.SignUp, showInLg: true }
      ],
      employer: [
        { title: t('navigation.career'), url: RouterPath.Careers },
        { title: t('navigation.postAJob'), url: RouterPath.Posts },
        { title: t('navigation.pricing'), url: RouterPath.Pricing },
        { title: t('navigation.aboutUs'), url: RouterPath.AboutUs },
        { title: '', url: '', isLine: true },
        { title: t('navigation.login'), url: RouterPath.Login, showInLg: true },
        { title: t('navigation.register'), url: RouterPath.SignUp, showInLg: true }
      ]
    }
  };
  return <MainLayout {...props} header={header} />;
}
