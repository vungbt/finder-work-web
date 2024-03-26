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

const uploadByUrl = (url: string, formData: FormData) => {
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const uploadFile = async (name: string, formData: FormData) => {
  const url = await getUrl(name);
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const imgFormData = (file: File) => {
  const uploadData = new FormData();
  uploadData.append('image', file);
  uploadData.append('file', file, 'file');
  return uploadData;
};

export const upload = {
  getUrl,
  imgFormData,
  uploadByUrl,
  uploadFile
};
