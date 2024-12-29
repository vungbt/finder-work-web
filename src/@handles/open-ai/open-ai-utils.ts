import { IResumePersonalDetail } from '@/@views/user/resume/providers';
import { ResumeType } from '@/configs/graphql/generated';
import { toastError } from '@/configs/toast';
import { useApiClient } from '@/libraries/providers/graphql';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { resumeDescriptionForm } from '.';
import { IJDDescription } from '@/libraries/common/modal/modal-ai-job-description';
import { IDescriptionSkill, IJobInformation } from '@/@views/user/company-profile/providers';

type OpenAIUtilsResult = {
  //resume
  resumeKeyWords: string[];
  keywordGenerate: (values: IResumePersonalDetail) => void;
  loadingResumeKeyword: boolean;
  onCloseResumeKeyword: () => void;
  resumeDescription: string;
  resumeDescriptionGenerate: (values: IResumePersonalDetail, keywords: string) => void;
  formikRef: React.RefObject<FormikProps<resumeDescriptionForm>>;
  approveDescription: () => void;
  formikRefPersonalDetails: React.RefObject<FormikProps<IResumePersonalDetail>>;
  formikReJobDetails: React.RefObject<FormikProps<IDescriptionSkill>>;
  formikRefJD: React.RefObject<FormikProps<IJDDescription>>;
  onCloseJDModal: () => void;
  loadingJD: boolean;

  //job
  isOpenJDModal: boolean;
  openJDModal: () => void;
  jobDescriptionGenerate: (values: IJDDescription, formData?: IJobInformation) => void;
};

export function OpenAIUtils(): OpenAIUtilsResult {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  //resume
  const [resumeKeyWords, setResumeKeyWord] = useState<string[]>([]);
  const [resumeDescription, setResumeDescription] = useState<string>('');
  const [loadingResumeKeyword, setLoadingResumeKeyWord] = useState<boolean>(false);
  const [loadingJD, setLoadingJD] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<{ description: string }>>(null);
  const formikRefPersonalDetails = useRef<FormikProps<IResumePersonalDetail>>(null);
  const formikReJobDetails = useRef<FormikProps<IDescriptionSkill>>(null);
  //job
  const [isOpenJDModal, setIsOpenJDModal] = useState<boolean>(false);
  const formikRefJD = useRef<FormikProps<IJDDescription>>(null);
  const keywordGenerate = async (values: IResumePersonalDetail) => {
    setLoadingResumeKeyWord(true);
    const type: ResumeType = values.descriptionType;
    const jobTitle: string = values.jobTitle?.label;
    const language: string = values.language?.label;
    if (!type || !jobTitle || !language) {
      setLoadingResumeKeyWord(false);
      return toastError(t('noti.resumeAiRequired'));
    }
    const res = await apiClient.resumeKeywordPrompt({
      args: {
        type,
        jobTitle,
        language
      }
    });
    if (res.openai_resume_keyword.data) {
      setResumeKeyWord(res?.openai_resume_keyword.data.split(','));
      setLoadingResumeKeyWord(false);
    } else {
      setLoadingResumeKeyWord(false);
      return toastError(t('noti.errorResumeAi'));
    }
  };

  const resumeDescriptionGenerate = async (values: IResumePersonalDetail, keywords: string) => {
    console.log('resumeDescriptionGenerate', values, keywords);
    const type: ResumeType = values.descriptionType;
    const jobTitle: string = values.jobTitle?.label;
    const language: string = values.language?.label;
    if (!type || !jobTitle || !language) {
      return toastError(t('noti.resumeAiRequired'));
    }
    const res = await apiClient.ResumeDescriptionPrompt({
      args: {
        type,
        jobTitle,
        language,
        keywords
      }
    });
    if (res.openai_resume_description.data) {
      const description = res.openai_resume_description.data;
      setResumeDescription(description);
      const form = formikRef.current;
      form?.setFieldValue('description', description);
    } else {
      setLoadingResumeKeyWord(false);
    }
  };

  const onCloseResumeKeyword = () => {
    const form = formikRef.current;
    setResumeKeyWord([]);
    form?.resetForm();
  };

  const approveDescription = () => {
    const form = formikRef.current;
    formikRefPersonalDetails.current?.setFieldValue('description', form?.values.description);
    setResumeKeyWord([]);
    form?.resetForm();
  };
  const openJDModal = () => {
    setIsOpenJDModal(true);
  };
  const onCloseJDModal = () => {
    setIsOpenJDModal(false);
  };
  const jobDescriptionGenerate = async (values: IJDDescription, formData?: IJobInformation) => {
    if (!values) return;
    setLoadingJD(true);
    const res = await apiClient.JobDescriptionPrompt({
      args: {
        platform: values.platform,
        language: values.language.label as string,
        role: values.role,
        responsibility: values.responsibility,
        qualification: values.qualification,
        benefit: values.benefit,
        tone: values.tone,
        category: formData?.jobCategory?.label as string,
        level: formData?.level?.label as string,
        type: formData?.type?.label as string
      }
    });
    if (res.openai_job_description.data) {
      setLoadingJD(false);
      formikRefJD.current?.resetForm();
      setIsOpenJDModal(false);
      const description = res.openai_job_description.data;
      setResumeDescription(description);
      const form = formikReJobDetails.current;
      form?.setFieldValue('description', description);
    } else {
      setLoadingJD(false);
    }
  };

  return {
    resumeKeyWords,
    keywordGenerate,
    loadingResumeKeyword,
    onCloseResumeKeyword,
    resumeDescriptionGenerate,
    resumeDescription,
    formikRef,
    approveDescription,
    formikRefPersonalDetails,
    //job
    isOpenJDModal,
    openJDModal,
    jobDescriptionGenerate,
    formikRefJD,
    formikReJobDetails,
    onCloseJDModal,
    loadingJD
  };
}
