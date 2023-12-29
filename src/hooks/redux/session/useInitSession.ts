import { ESubjectType, subject } from '@/hooks/rxjs/useInitSubject';
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeSession } from './reducer';
import useSession from './useSession';

export default function useInitSession() {
  const { session, getSession } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = subject.subscribe((event) => {
      const { type, data } = event;
      if (type === ESubjectType.SET_SESSION) {
        if (!isEqual(data, session)) {
          dispatch(changeSession(data));
        }
      }
    });
    return () => subscribe.unsubscribe();
  }, [dispatch, session]);

  useEffect(() => {
    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
