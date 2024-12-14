import {
  Degree,
  EducationType,
  ResumeActivity,
  ResumeCertificate,
  ResumeEducation,
  ResumePersonalInfo,
  ResumeProject,
  ResumeSocial,
  ResumeTemplate,
  ResumeType,
  ResumeWorkExperience,
  SocialType,
  WorkPosition
} from '@/configs/graphql/generated';
import { data as testData, testDataFile } from '@/constants/test';
import { BackButton, Button, Steps, UploadItem } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { upload } from '@/utils/upload';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useResume } from '../providers/resume-providers';
import useProfile from '@/hooks/redux/profile/useProfile';
const PdfViewer = dynamic(() => import('@/libraries/common/pdf-viewer'), { ssr: false });

type CreateResumeArgs = {
  personalInfo: ResumePersonalInfo;
  workExperiences: ResumeWorkExperience[];
  projects: ResumeProject[];
  educations: ResumeEducation[];
  languageSkillIds: string[];
  skillIds: string[];
  skillContents: string[];
  certificates: ResumeCertificate[];
  socials: ResumeSocial[];
  activities?: ResumeActivity[];
};
export default function FinalTouches() {
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();

  // const formData = outputData; // DUMP
  const { apiClient } = useApiClient();
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const t = useTranslations();
  const { personal, workExperiences, projects, educations, moreInformation } = formData;
  const [pdfData, setPdfData] = useState<string | null>(null);
  const profile = useProfile();
  const personalInput = async () => {
    const avatar: UploadItem | undefined = personal?.avatar;
    const avatarId = avatar?.id;
    let avatarPublicId = avatar?.id;
    const file = avatar?.file;
    if (file) {
      const formData = upload.imgFormData(file);
      const res = await upload.uploadFile(file.name, formData);
      avatarPublicId = res.data.public_id;
    }

    return {
      addressDetail: personal?.addressDetail ?? '',
      avatarPublicId: avatarPublicId ?? '',
      avatarId: avatarId,
      cityId: Number(personal?.address?.value || 0),
      description: personal?.description ?? '',
      email: personal?.email ?? '',
      fullName: personal?.fullName ?? '',
      isSummary: personal?.descriptionType === ResumeType.Summary,
      jobTitleId: personal?.jobTitle?.label ?? '',
      name: personal?.name ?? '',
      phoneNumber: personal?.phoneNumber ?? ''
    };
  };

  const certificateInput = async () => {
    const data = Promise.all(
      (moreInformation?.certificates ?? []).map(async (item) => {
        const file: UploadItem | undefined = item?.file;
        const fileId = file?.id;
        let filePublicId = file?.id;
        const fileData = file?.file;
        if (fileData) {
          const formData = upload.imgFormData(fileData);
          const res = await upload.uploadFile(fileData.name, formData);
          filePublicId = res.data.public_id;
        }

        return {
          fileId,
          filePublicId,
          name: item.name
        };
      })
    );
    return data;
  };

  const projectInput = async () => {
    const data = Promise.all(
      (projects ?? []).map(async (item) => {
        const thumbnail: UploadItem | undefined | null = item?.thumbnail;
        const thumbnailId = thumbnail?.id;
        let thumbnailPublicId = thumbnail?.id;
        const thumbnailData = thumbnail?.file;
        if (thumbnailData) {
          const formData = upload.imgFormData(thumbnailData);
          const res = await upload.uploadFile(thumbnailData.name, formData);
          thumbnailPublicId = res.data.public_id;
        }

        const res: ResumeProject = {
          thumbnailId,
          thumbnailPublicId,
          companyId: item.company?.__isNew__ ? undefined : item.company?.value,
          companyName: item.company?.label as string,
          description: item.description,
          endAt: item.endAt,
          startAt: item.startAt,
          isFreelancer: item.isFreelancer && item.isFreelancer.length > 0,
          title: item.title,
          refeUrls: item.refeUrls,
          role: item.role.value as WorkPosition,
          teamSize: item.teamSize,
          techStackIds: item.techStacks.map((item) => item.value)
        };
        return res;
      })
    );
    return data;
  };

  const mappingData = async () => {
    const personalInfo = await personalInput();
    const certificates = await certificateInput();
    const projects = await projectInput();

    const result: CreateResumeArgs = {
      personalInfo,
      workExperiences: (workExperiences ?? []).map((item) => {
        if (!item.address || !item.company || !item.jobTitle) {
          console.log('item', item);
          console.error('Missing required fields in workExperience:', item);
          throw new Error('Missing required fields in workExperience');
        }
        return {
          cityId: Number(item.address?.value || 0) ?? 0,
          companyId: item.company?.__isNew__ ? undefined : item.company?.value,
          companyName: item.company?.label as string,
          description: item.description,
          endAt: item.endAt,
          startAt: item.startAt,
          isCurrentlyWorkHere: item.isCurrentlyWorkHere && item.isCurrentlyWorkHere.length > 0,
          isFreelancer: item.isFreelancer && item.isFreelancer.length > 0,
          jobTitleId: item.jobTitle.value
        };
      }),
      projects,
      educations: (educations ?? []).map((item) => {
        if (!item.degree || !item.major || !item.type) {
          console.error('Missing required fields in education:', item);
          throw new Error('Missing required fields in education');
        }
        return {
          awards: item.awards,
          degree: item.degree?.value as Degree,
          gpa: item.gpa,
          graduationAt: item.graduationAt,
          majorId: item.major?.value ?? '',
          relevantCourseWorks: item.relevantCourseWorks,
          type: item.type?.value as EducationType
        };
      }),
      languageSkillIds: (moreInformation?.languageSkills ?? []).map((item) => item.value),
      skillIds: (moreInformation?.skills ?? []).map((item) => item.value),
      skillContents: (moreInformation?.skills ?? []).map((item) => item.label),
      certificates,
      socials: (moreInformation?.socials ?? []).map((item) => {
        if (!item.type) {
          console.error('Missing required fields in social:', item);
          throw new Error('Missing required fields in social');
        }
        return {
          type: item?.type?.value as SocialType,
          url: item.url
        };
      })
    };

    return result;
  };

  const previewResume = async () => {
    try {
      if (loadingPreview) return;
      setLoadingPreview(true);
      const params = await mappingData();
      const res = await apiClient.previewResume({
        ...params,
        resumeTemplateName: ResumeTemplate.ResumeOne
      });

      const base64 = res.preview_resume.pdfBase64;
      const pdfBlob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], {
        type: 'application/pdf'
      });
      setPdfData(URL.createObjectURL(pdfBlob));
      setLoadingPreview(false);
    } catch (error) {
      setLoadingPreview(false);
      getErrorMss(error, t('noti.reportPostFailed'));
    }
  };

  const savedResumeResume = async () => {
    try {
      if (loadingSave) return;
      setLoadingSave(true);
      const params = await mappingData();
      const res = await apiClient.createResume({
        ...params,
        resumeTemplateName: ResumeTemplate.ResumeOne,
        userId: profile.profile.id
      });
      console.log('res====>', res);
      setLoadingSave(false);
    } catch (error) {
      setLoadingSave(false);
      getErrorMss(error, t('noti.reportPostFailed'));
    }
  };

  const downloadPDF = () => {
    if (!pdfData) return;
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = pdfData;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto pb-10 w-3/4"
    >
      <div className="mt-5">
        <Steps
          steps={totalStep}
          active={stepIndex}
          onChangeStep={(stepActive) => actions.changeStep(stepActive)}
        />
      </div>

      <div className="my-5">
        <BackButton onClick={() => actions.previousStep(formData)} />
      </div>
      <h1 className="text-3xl font-bold mt-4">Final Touches</h1>
      <div className="flex items-center gap-3 mb-5">
        <Button
          styleType="neon"
          onClick={previewResume}
          isLoading={loadingPreview}
          label="Preview"
        />
        <Button
          styleType="neon"
          onClick={savedResumeResume}
          isLoading={loadingSave}
          label="Saved"
        />

        {pdfData && (
          <Button styleType="neon" onClick={downloadPDF} isLoading={loadingSave} label="Download" />
        )}
      </div>
      <div className="w-96">{pdfData && <PdfViewer file={pdfData} />}</div>
    </motion.div>
  );
}

export const outputData = {
  personal: {
    name: 'Tuấn',
    avatar: {
      id: '2024-12-01T03:09:20.406Z-photo_2024-11-23_16-20-28.jpg',
      url: testData,
      file: testDataFile
    },
    fullName: 'Bùi',
    email: 'bycar280@gmail.com',
    phoneNumber: '0383007243',
    address: {
      label: 'El Tarter - Canillo - Andorra',
      value: '4'
    },
    addressDetail: 'Xom 10, Yen Nghia',
    descriptionType: 'summary',
    description: 'Description',
    jobTitle: {
      label: '21 Dealer',
      value: '9e9cbfdd-df48-4cfc-beb9-941a9e3c453b'
    }
  },
  workExperiences: [
    {
      jobTitle: {
        label: '1st Grade Teacher',
        value: 'a2640eb9-a333-4e79-bd04-cfebe96fc1c2'
      },
      company: {
        label: 'FPT SmartCloud',
        value: '8748e987-ae1e-4f3b-91d5-f5d6cf36be88',
        __isNew__: false
      },
      isFreelancer: ['isFreelancer'],
      address: {
        label: 'Canillo - Canillo - Andorra',
        value: '3'
      },
      startAt: '2024-12-08T17:00:00.000Z',
      endAt: null,
      description: '<p>Description</p>',
      isCurrentlyWorkHere: ['isCurrentlyWorkHere']
    },
    {
      jobTitle: {
        label: '8th Grade Mathematics Teacher',
        value: '1f467bb2-0589-438a-b3b1-5d803101a456'
      },
      company: {
        label: 'Xpon Digital',
        value: 'c0e88d06-839b-4bdb-a139-d79175cdffae',
        __isNew__: false
      },
      isFreelancer: [],
      address: {
        label: 'Sant Julià de Lòria - Sant Julià de Lòria - Andorra',
        value: '8'
      },
      startAt: '2024-12-09T17:00:00.000Z',
      endAt: '2024-12-11T17:00:00.000Z',
      description: '<p>Description</p>',
      isCurrentlyWorkHere: []
    }
  ],
  projects: [
    {
      title: 'Project 1',
      description: '<p>Description</p>',
      teamSize: 3,
      role: {
        label: 'Team leader',
        value: 'team_leader'
      },
      techStacks: [
        {
          label: 'Z-Wave',
          value: '2ecce58a-f287-4225-9a15-db440b43e6c0'
        },
        {
          label: 'Zoning',
          value: '97aae9da-24ec-4e6e-9033-93ae6d12574f'
        },
        {
          label: 'Zymography',
          value: '56fff55a-e46e-443c-afa5-1a935c6ed02a'
        }
      ],
      startAt: '2024-12-09T17:00:00.000Z',
      endAt: '2024-12-09T17:00:00.000Z',
      company: {
        label: 'Xpon Digital',
        value: 'c0e88d06-839b-4bdb-a139-d79175cdffae'
      },
      refeUrls: [],
      isFreelancer: [],
      thumbnail: {
        id: '2024-12-01T03:11:48.636Z-photo_2024-11-23_16-20-28.jpg',
        url: testData,
        file: testDataFile
      }
    },
    {
      title: 'Project 2',
      description: '<p>Description</p>',
      teamSize: 4,
      role: {
        label: 'Vice director',
        value: 'vice_director'
      },
      techStacks: [
        {
          label: 'ZURB',
          value: '7506cae6-f9b1-4b94-a090-02809c51d421'
        },
        {
          label: 'Zope',
          value: '5d41ac20-133c-406f-85ba-481b237d4373'
        },
        {
          label: 'Zinc',
          value: '46df3a2f-1091-44a2-b762-ea131302f8b5'
        }
      ],
      startAt: '2024-11-30T17:00:00.000Z',
      endAt: '2024-12-21T17:00:00.000Z',
      company: {
        label: 'FPT SmartCloud',
        value: '8748e987-ae1e-4f3b-91d5-f5d6cf36be88'
      },
      refeUrls: [],
      isFreelancer: ['isFreelancer'],
      thumbnail: {
        id: '2024-12-01T03:12:38.209Z-photo_2024-11-17_11-10-04.jpg',
        url: testData,
        file: testDataFile
      }
    }
  ],
  educations: [
    {
      type: {
        label: 'School',
        value: 'school'
      },
      major: {
        label: 'Zymography',
        value: '56fff55a-e46e-443c-afa5-1a935c6ed02a'
      },
      degree: {
        label: 'High School Diploma or Equivalent',
        value: 'high_school_diploma'
      },
      graduationAt: '2024-12-09T17:00:00.000Z',
      gpa: 3,
      awards: ['Award 1', 'Award 2'],
      relevantCourseWorks: ['Relevant course work 1']
    },
    {
      type: {
        label: 'School',
        value: 'school'
      },
      major: {
        label: 'Zymography',
        value: '56fff55a-e46e-443c-afa5-1a935c6ed02a'
      },
      degree: {
        label: 'Technical Training',
        value: 'technical_training'
      },
      graduationAt: '2024-12-10T17:00:00.000Z',
      gpa: 1,
      awards: [],
      relevantCourseWorks: []
    }
  ],
  moreInformation: {
    languageSkills: [
      {
        label: 'Afar - native',
        value: 'aa83a88f-f44e-4ad9-ab60-0309b4d3746a'
      },
      {
        label: 'Abkhazian - fluent',
        value: '74502640-aafd-498e-bea4-a45cfe51d6b7'
      },
      {
        label: 'Abkhazian - beginner',
        value: '9ddf70ef-3e5f-4076-a020-9bc1dcdd3992'
      }
    ],
    skills: [
      {
        label: 'Z-Wave',
        value: '2ecce58a-f287-4225-9a15-db440b43e6c0'
      },
      {
        label: 'Zoology',
        value: 'f268f7ff-1edc-4fea-ae8a-7c5ad5f9081b'
      },
      {
        label: 'Zoho',
        value: '96d725d9-c3ae-477e-8d57-82407bb7b24f'
      }
    ],
    certificates: [
      {
        name: 'https://finder.vung.dev/',
        file: {
          id: '2024-12-01T03:13:41.757Z-photo_2024-11-23_16-20-28.jpg',
          url: testData,
          file: testDataFile
        }
      },
      {
        name: 'https://www.youtube.com/watch?v=J32NWyUh2Uc&ab_channel=Hi%E1%BB%81nH%E1%BB%93Official',
        file: {
          id: '2024-12-01T03:13:55.199Z-photo_2024-11-17_11-10-04.jpg',
          url: testData,
          file: testDataFile
        }
      }
    ],
    socials: [
      {
        type: {
          label: 'Behance',
          value: 'behance'
        },
        url: 'https://finder.vung.dev/'
      },
      {
        type: {
          label: 'Github',
          value: 'github'
        },
        url: 'https://finder.vung.dev/'
      }
    ],
    activities: [
      {
        name: 'Activity name 1',
        startAt: '2024-12-08T17:00:00.000Z',
        endAt: '2024-12-25T17:00:00.000Z',
        description: 'Description'
      },
      {
        name: 'Activity name 2',
        startAt: '2024-12-19T17:00:00.000Z',
        endAt: '2024-12-19T17:00:00.000Z',
        description: 'Description'
      }
    ]
  }
};
