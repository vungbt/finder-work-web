import baseReducer from '@/hooks/redux/reducer';
import { configureStore } from '@reduxjs/toolkit';
import { initMessageListener } from 'redux-state-sync';
import session from '@/hooks/redux/session/reducer';

const rootReducer = {
  ...baseReducer,
  session
};

const store = configureStore({
  reducer: rootReducer
  // middleware: [
  //   createStateSyncMiddleware({o
  //     whitelist: ['locale/changeLocale']
  //   })
  // ]
});
initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export default store;
