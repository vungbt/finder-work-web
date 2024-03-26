import { ReactNode } from 'react';

export function PortalLayout(props: { pageView: ReactNode }) {
  return <div>{props.pageView}</div>;
}
