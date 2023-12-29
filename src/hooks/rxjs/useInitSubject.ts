'use client';
import { useEffect } from 'react';
import { Subject } from 'rxjs';

export enum ESubjectType {
  SET_SESSION = 'setSession',
  GET_SESSION = 'getSession',
  RESULT_SESSION = 'resultSession'
}

export type EventSubscribe = { type: ESubjectType; data?: never };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subject = new Subject<any>();

export default function useInitSubject() {
  useEffect(() => {
    const subscribe = subject.subscribe();
    return () => subscribe.unsubscribe();
  }, []);
}
