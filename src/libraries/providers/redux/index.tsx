'use client';
import BaseInit from '@/libraries/base-init';
import store from '@/utils/redux-storage';
import { Provider } from 'react-redux';

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <BaseInit />
      {children}
    </Provider>
  );
}

export default ReduxProvider;
