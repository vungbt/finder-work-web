'use client';
import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type LeftContentSignAuthProps = {
  className?: string;
  thumbUrl: string;
  isEmployee?: boolean;
};
export function LeftContentSignAuth({
  className,
  isEmployee = false,
  thumbUrl = '/background/auth-employee.jpg'
}: LeftContentSignAuthProps) {
  const t = useTranslations();
  const images = [
    '/background/auth-employer.webp',
    '/background/auth-employer1.webp',
    '/background/auth-employer2.webp'
  ];

  const benefits: { label: string; icon: IconName }[] = [
    { label: t('aiPoweredJobDescription'), icon: 'ai' },
    { label: t('hotJobAds'), icon: 'rocket' },
    { label: t('topCompaniesBanner'), icon: 'certificate' },
    { label: t('incredibleValue'), icon: 'growth' },
    { label: t('socialMediaBoosts'), icon: 'social' }
  ];
  return (
    <div
      className={clsx(className, 'hidden bg-dark flex-1 relative overflow-hidden', {
        'hidden lg:flex flex-col justify-center items-center': !isEmployee,
        'hidden lg:block': isEmployee
      })}
    >
      <Image
        fill
        priority
        src="/background/caro.jpg"
        alt="bg-auth"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: 'spring',
            damping: 5,
            stiffness: 100,
            restDelta: 0.001
          }
        }}
        className={clsx('w-full flex justify-center items-center', {
          'h-full': isEmployee,
          'h-fit': !isEmployee
        })}
      >
        {/* show with employee */}
        <div
          className={clsx('relative w-4/5 min-h-[514px] aspect-1', {
            hidden: !isEmployee
          })}
        >
          <Image
            priority
            fill
            src={thumbUrl}
            alt="image-thumb"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* show with employer */}
        {!isEmployee && (
          <Swiper
            autoplay={{
              delay: 2500,
              disableOnInteraction: false
            }}
            pagination={true}
            modules={[Autoplay, Pagination]}
          >
            {images.map((item) => {
              return (
                <SwiperSlide key={item}>
                  <div className="relative w-4/5 mx-auto h-fit min-h-96 rounded-lg border-4 border-info border-solid overflow-hidden">
                    <Image
                      src={item}
                      priority
                      fill
                      alt="image-thumb"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-md"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
            <div className="flex items-center transition-all ease-linear bg-info text-white rounded-3xl px-4 py-2 text-xl font-bold justify-center gap-2 z-10 absolute w-fit bottom-0 left-1/2 -translate-x-1/2 capitalize">
              {t('employersBenefits')}
            </div>
          </Swiper>
        )}
      </motion.div>

      {/* benefits */}
      <div
        className={clsx('flex items-center justify-center mt-10 gap-6 flex-wrap', {
          hidden: isEmployee
        })}
      >
        {benefits.map((item) => {
          return (
            <div
              key={item.icon}
              className="flex flex-col items-center justify-center text-white font-bold text-lg"
            >
              <RenderIcon name={item.icon} className="text-white !w-16 !h-16" />
              <p className="capitalize">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
