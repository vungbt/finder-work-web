import { UploadItem } from '@/libraries/common';
import { IOptItem } from './common';

export interface CompanyFormValues {
  id?: string;
  name: string;
  addressDetail: string;
  description: string;
  avatar: UploadItem | null;
  type: IOptItem | null;
  size: IOptItem | null;
  photos: UploadItem[];
  address: IOptItem | null;
  industries: IOptItem[];
}
