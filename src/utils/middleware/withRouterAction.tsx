import { RouterAction } from '@/constants/common';
import { ERouterAction } from '@/types';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withActionRouter = (Component: React.ComponentType<any>) => {
  return function withActionRouter(props: { params: { action: string } }) {
    const action = props.params?.action;
    if (!action || !RouterAction.includes(action)) return notFound();

    return (
      <Component
        {...props}
        action={action}
        isEdit={action === ERouterAction.Edit}
        isAdd={action === ERouterAction.Add}
      />
    );
  };
};
