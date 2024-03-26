import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { ESubjectType, subject } from '@/hooks/rxjs/useInitSubject';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import localStorageHelper, { EKeyStorage } from './helpers/local-storage';

export const setSession = (session: Session | null) => {
  localStorageHelper.setObject(EKeyStorage.SESSION, session);
  subject.next({
    type: ESubjectType.SET_SESSION,
    data: session
  });
};

// only client
export const getSession = async () => {
  try {
    const session = localStorageHelper.getObject(EKeyStorage.SESSION, null);
    if (session) {
      // if (moment(session?.expires) > moment().add(1, 'minute')) {
      //   const result = await refreshToken();
      //   if (result) {
      //     const newSession: Session = merge(session, result);
      //     setSession(newSession);
      //     return newSession;
      //   }
      // }
      return session as Session;
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}
  // setSession(null);
  return null;
};

export const getSessionSS = async () => {
  const sessionSS = await getServerSession(authOptions);
  let newData: Session | null = null;
  if (sessionSS?.token) {
    newData = { ...sessionSS };
  }
  return newData;
};
