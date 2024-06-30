import { apiClientInstance } from '@/configs/graphql';
import { toastError } from '@/configs/toast';
import axios from 'axios';

export type FileCloudinary = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  api_key: string;
};

const getUrl = async (name: string) => {
  const res = await apiClientInstance.uploadUrl({ name });
  if (res.upload_url && res?.upload_url.length > 0) return res.upload_url;
  return toastError('Get upload url failed.');
};

const getUrls = async (names: string[]) => {
  const res = await apiClientInstance.uploadUrls({ names });
  if (res.upload_urls && res?.upload_urls.length > 0) return res.upload_urls;
  return toastError('Get upload url failed.');
};

const uploadByUrl = (url: string, formData: FormData) => {
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const uploadFile = async (name: string, formData: FormData) => {
  const url = await getUrl(name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return axios.post<any, { data: FileCloudinary }>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const uploadFiles = async (files: (File | undefined)[]) => {
  if (!files || files.length <= 0) return [];
  const cleanFiles = files.filter((item): item is File => item !== undefined);
  const names = cleanFiles.map((item) => item?.name ?? '');
  const urls = (await getUrls(names)) as string[];

  const results = await Promise.all(
    urls.map((url, index) => {
      const formData = imgFormData(cleanFiles[index]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return axios.post<any, { data: FileCloudinary }>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    })
  );
  return results.map((item) => item.data);
};

const imgFormData = (file: File) => {
  const uploadData = new FormData();
  uploadData.append('image', file);
  uploadData.append('file', file, 'file');
  return uploadData;
};

export const upload = {
  getUrl,
  getUrls,
  imgFormData,
  uploadByUrl,
  uploadFile,
  uploadFiles
};
