import { createSharedPathnamesNavigation } from 'next-intl/navigation';
export * from './Link';
export * from './useRouter';
export * from './useSearchQuery';

export const locales = ['en', 'vi'] as const;

export const {
  Link: NextLink,
  redirect,
  usePathname,
  useRouter: useRouterOriginal
} = createSharedPathnamesNavigation({
  locales
});
