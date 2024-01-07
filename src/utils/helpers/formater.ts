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
