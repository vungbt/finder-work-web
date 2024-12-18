import {
  Job,
  MyResumeQueryVariables,
  PaginationInput,
  Resume,
  SortOrder
} from '@/configs/graphql/generated';
import { toastError, toastSuccess } from '@/configs/toast';
import useProfile from '@/hooks/redux/profile/useProfile';
import { UploadItem } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type ResumeUtilsResult = {
  data: Resume[];
  loading: boolean;
  isOpenUpload: boolean;
  isOpenApplyModal: boolean;
  openApplyModal: () => void;
  onCloseApplyModal: () => void;
  openUpload: () => void;
  oncloseUpload: () => void;
  onSubmitResumeFile: (values: UploadItem) => void;
  setSearchValue: (value: string) => void;
  setSortActives: (value: Record<string, SortOrder>[]) => void;
  setPagination: (value: PaginationInput) => void;
  onApplyJob: (resume: Resume, job: Job) => void;
  loadingApply: boolean;
  confirmApplyJob: () => void;
  resumeApply?: Resume;
  onCloseConfirmApply: () => void;
};

export function ResumeUtils(): ResumeUtilsResult {
  const [data, setData] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApply, setLoadingApply] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const { apiClient } = useApiClient();
  const [resumeApply, setResumeApply] = useState<Resume>();
  const [jobApply, setJobApply] = useState<Job>();

  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const [isOpenApplyModal, setIsOpenApplyModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });
  const profile = useProfile();
  const t = useTranslations();
  useEffect(() => {
    fetchResume({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);
  const fetchResume = async (variables: MyResumeQueryVariables) => {
    profile;
    setLoading(true);
    const param = {
      ...variables,
      userId: profile.profile.id
    };
    const res = await apiClient.myResume(param);
    setLoading(false);
    const result = res.my_resume;
    setData(result.data as Resume[]);
  };

  const openUpload = () => {
    setIsOpenUpload(true);
  };
  const oncloseUpload = () => {
    setIsOpenUpload(false);
  };

  const openApplyModal = () => {
    setIsOpenApplyModal(true);
  };
  const onCloseApplyModal = () => {
    setIsOpenApplyModal(false);
  };
  const onSubmitResumeFile = (values: UploadItem) => {
    console.log(values);
  };

  const onApplyJob = async (resume: Resume, job: Job) => {
    setJobApply(job);
    setResumeApply(resume);
  };

  const confirmApplyJob = async () => {
    try {
      setLoadingApply(true);
      if (!jobApply || !resumeApply) {
        return;
      }
      const res = await apiClient.createJobResume({
        where: { id: jobApply.id },
        data: { resumes: { connect: [{ id: resumeApply.id }] } }
      });
      if (res && res.resume_job) {
        setLoadingApply(false);
        toastSuccess(t('noti.applySuccess'));
        setIsOpenApplyModal(false);
        setResumeApply(undefined);
      }
    } catch (e) {
      setLoadingApply(false);
      toastError(e as string);
    }
  };
  const onCloseConfirmApply = () => {
    setResumeApply(undefined);
  };

  return {
    data,
    loading,
    isOpenUpload,
    openUpload,
    oncloseUpload,
    onSubmitResumeFile,
    setSearchValue,
    setSortActives,
    setPagination,
    isOpenApplyModal,
    openApplyModal,
    onCloseApplyModal,
    onApplyJob,
    loadingApply,
    confirmApplyJob,
    resumeApply,
    onCloseConfirmApply
  };
}
