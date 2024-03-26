import { useRouterOriginal } from '.';
import { onStart, shouldTriggerStartEvent } from '../router-events';

export function useRouter(): ReturnType<typeof useRouterOriginal> {
  const router = useRouterOriginal();
  return {
    ...router,
    push: (href, options) => {
      if (shouldTriggerStartEvent(href)) onStart();
      router.push(href, options);
    },
    replace: (href, options) => {
      if (shouldTriggerStartEvent(href)) onStart();
      router.replace(href, options);
    }
  };
}
