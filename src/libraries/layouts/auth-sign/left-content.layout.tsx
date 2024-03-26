'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { motion } from 'framer-motion';

type LeftContentSignAuthProps = {
  className?: string;
  thumbUrl: string;
};
export function LeftContentSignAuth({
  className,
  thumbUrl = '/background/auth-employee.jpg'
}: LeftContentSignAuthProps) {
  return (
    <div className={clsx(className, 'hidden bg-dark flex-1 lg:block relative overflow-hidden')}>
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
        className="w-full h-full flex justify-center items-center">
        <div className="relative w-4/5 min-h-[514px] aspect-1">
          <Image
            priority
            fill
            src={thumbUrl}
            alt="image-thumb"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </motion.div>
    </div>
  );
}
