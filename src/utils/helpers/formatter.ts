import { toastError } from '@/configs/toast';
import { format, formatDistance } from 'date-fns';

export enum EDateFormat {
  MM_dd_yyyy = 'MM/dd/yyyy',
  MMMM_yyyy = 'MMMM yyyy'
}

export const formatDate = (date?: Date | string | number, fm?: EDateFormat) => {
  const dateNeedFormat = date ? new Date(date) : new Date();
  return format(dateNeedFormat, fm ?? EDateFormat.MM_dd_yyyy);
};

export const getTimeLeft = (date?: Date | string | number) => {
  const currentDate = date ? new Date(date) : new Date();
  return formatDistance(currentDate, new Date(), { addSuffix: true });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMss = (error: any, defaultMess?: string) => {
  const errResponse = error?.response;
  if (!errResponse || Object.keys(errResponse).length <= 0) return;
  const errors = errResponse?.errors ?? [];
  if (!errors || errors.length <= 0) return;
  const message = errors[0]?.message ?? '';

  const newMessError = message ?? defaultMess;
  if (!newMessError || newMessError.length <= 0) return;

  toastError(newMessError);
};
