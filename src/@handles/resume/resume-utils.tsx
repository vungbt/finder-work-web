// import { ICreateResumeDataForm } from '@/@views/user/resume/providers';
// import { SeekerProfile } from '@/configs/graphql/generated';
// import { useApiClient } from '@/libraries/providers/graphql';
// import { useState } from 'react';

// type ResumeUtilsResult = {
//   isOpenSelectTemplate: boolean;
//   handleOpenSelectTemplate: () => void;
//   handleCloseSelectTemplate: () => void;
//   handlePreview: (formData: ICreateResumeDataForm, templateName: string, isPDF: boolean) => void;
//   isOpenPreview: boolean;
//   loading: boolean;
//   previewUrl: string;
//   templateName: string;
//   PDFUrl: string;
// };

// export const useResumeUtils = (): ResumeUtilsResult => {
//   const { apiClient } = useApiClient();

//   const [isOpenSelectTemplate, setIsOpenSelectTemplate] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [PDFUrl, setPDFUrl] = useState('');
//   const [isOpenPreview, setIsOpenPreview] = useState(false);
//   const [templateName, setTemplateName] = useState('');
//   const handleOpenSelectTemplate = () => {
//     setIsOpenSelectTemplate(true);
//   };

//   const handleCloseSelectTemplate = () => {
//     setIsOpenSelectTemplate(false);
//     setIsOpenPreview(false);
//     setTemplateName('');
//   };

//   const handlePreview = async (
//     formData: ICreateResumeDataForm,
//     templateName: string,
//     isPDF: boolean
//   ) => {
//     try {
//       setLoading(true);
//       setTemplateName(templateName);
//       if (formData.personalDetail.phoneCode) {
//         formData.personalDetail.phoneCode = null;
//       }
//       if (formData.personalDetail.phoneCode) {
//         formData.personalDetail.phoneCode = null;
//       }
//       const res = await apiClient.createPreviewResume({
//         data: { templateName, seekerProfile: formData as unknown as SeekerProfile, isPDF }
//       });
//       if (isPDF) {
//         setPDFUrl(res.create_preview_resume.fileURl ?? '');
//         window.open(PDFUrl, '_blank');
//       }

//       setPreviewUrl(res.create_preview_resume.fileURl ?? '');
//       setLoading(false);
//       setIsOpenSelectTemplate(false);
//       setIsOpenPreview(true);
//     } catch (error) {
//       console.log('error', error);
//     }
//   };
//   // call api get list template here

//   return {
//     isOpenSelectTemplate,
//     handleOpenSelectTemplate,
//     handleCloseSelectTemplate,
//     handlePreview,
//     isOpenPreview,
//     loading,
//     previewUrl,
//     templateName,
//     PDFUrl
//   };
// };
