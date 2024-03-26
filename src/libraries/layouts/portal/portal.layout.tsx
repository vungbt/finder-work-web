import { ReactNode } from 'react';

export default function PortalLayout(props: { pageView: ReactNode }) {
  return <div>{props.pageView}</div>;
}
