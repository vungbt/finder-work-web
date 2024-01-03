import Banner from '@/libraries/banner';
import { Switch } from '@/libraries/common';
import { Fragment } from 'react';

export default function EmployerPage() {
  return (
    <Fragment>
      <Banner type="employer" title="Recruit The Best Talent " />
      <Switch size="large" loading />
      <Switch size="middle" />
      <Switch size="small" />
      <Switch size="small" disabled />
    </Fragment>
  );
}
