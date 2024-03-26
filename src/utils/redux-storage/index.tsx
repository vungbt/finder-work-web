import baseReducer from '@/hooks/redux/reducer';
import { configureStore } from '@reduxjs/toolkit';
import { initMessageListener } from 'redux-state-sync';

const rootReducer = {
  ...baseReducer
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
