import { useTranslations } from 'next-intl';
import { RenderIcon } from '../icons';
import clsx from 'clsx';

type LogoProps = {
  type?: 'default' | 'square';
  layout?: 'vertical' | 'horizontal';
  size?: 'xl' | 'lg' | 'md' | 'sm';
};

export function Logo({ type = 'default', layout = 'horizontal', size = 'md' }: LogoProps) {
  const t = useTranslations();
  return (
    <div
      className={clsx('flex rounded-lg bg-dark', {
        'w-fit flex-row items-center justify-center': layout === 'horizontal',
        'w-fit flex-col items-center justify-center': layout === 'vertical',

        'px-3 py-2': size === 'md'
      })}>
      <RenderIcon
        name="logo"
        className={clsx({
          '!h-7 !w-6': size === 'md'
        })}
      />
      <h5
        className={clsx('text-white', {
          'inline-block': type === 'default',
          hidden: type === 'square',

          'ml-3': size === 'md'
        })}>
        {t('webName')}
      </h5>
    </div>
  );
}
