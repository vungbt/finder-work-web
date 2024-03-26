import { ESubjectType, subject } from '@/hooks/rxjs/useInitSubject';
import { RootState } from '@/utils/redux-storage';
import { setSession } from '@/utils/session';
import isEqual from 'lodash/isEqual';
import { Session } from 'next-auth';
import { getSession as getSessionNextAuth } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSession } from './reducer';

export default function useSessionClient() {
  const dispatch = useDispatch();
  const session = useSelector((appState: RootState) => appState.session ?? null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscribe = subject.subscribe((event: any) => {
      const { type, data } = event;
      if (type === ESubjectType.SET_SESSION) {
        if (!isEqual(data, session)) {
          dispatch(changeSession(data));
        }
      }
    });
    return () => subscribe.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSession = async () => {
    const sessionSS = await getSessionNextAuth();
    let newData: Session | null = null;
    if (sessionSS?.token) {
      newData = { ...sessionSS };
    }
    if (!isEqual(session, newData)) {
      setSession(newData);
    }
    return newData;
  };

  return { session, setSession, getSession };
}
