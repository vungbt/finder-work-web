/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import dynamic from 'next/dynamic';
import { Dispatch, ReactNode, createContext, createElement, useContext, useReducer } from 'react';
import { IPhoneCode, IStepItem } from '.';
import { Country } from 'countries-and-timezones';

const ProfileInformationStep = dynamic(() => import('../components/job-step-one'), {
  ssr: false
});

const ResumeMain = dynamic(() => import('../components/job-main'), {
  ssr: false
});
const ExperienceInformationStep = dynamic(() => import('../components/job-step-two'), {
  ssr: false
});
const EducationInformationStep = dynamic(() => import('../components/job-step-three'), {
  ssr: false
});
const OtherInformationStep = dynamic(() => import('../components/job-step-four'), {
  ssr: false
});

export enum CreateResumeActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP',
  SET_PROFILE_TEMP = 'SET_PROFILE_TEMP',
  SET_WORK_EXPERIENCE = 'SET_WORK_EXPERIENCE',
  SET_EDUCATION = 'SET_EDUCATION',
  SET_OTHER_INFORMATION = 'SET_OTHER_INFORMATION'
}

const STEPS: IStepItem[] = [
  { title: 'resume-main', component: createElement(ResumeMain) },
  { title: 'profile-information-step', component: createElement(ProfileInformationStep) },
  { title: 'experience-information-Step', component: createElement(ExperienceInformationStep) },
  { title: 'education-information-step', component: createElement(EducationInformationStep) },
  { title: 'other-information-step', component: createElement(OtherInformationStep) }
];

type Action =
  | {
      type: CreateResumeActionType.NEXT_STEP;
      payload: { data?: ICreateResumeDataForm };
    }
  | {
      type: CreateResumeActionType.PREVIOUS_STEP;
      payload: { data?: ICreateResumeDataForm };
    }
  | {
      type: CreateResumeActionType.SET_FORM_DATA;
      payload: { data: ICreateResumeDataForm };
    }
  | {
      type: CreateResumeActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    }
  | {
      type: CreateResumeActionType.SET_PROFILE_TEMP;
      payload: { data?: IPersonalDetail };
    }
  | {
      type: CreateResumeActionType.SET_WORK_EXPERIENCE;
      payload: { data?: IWorkExperience[] };
    }
  | {
      type: CreateResumeActionType.SET_EDUCATION;
      payload: { data?: IEducation[] };
    }
  | {
      type: CreateResumeActionType.SET_OTHER_INFORMATION;
      payload: { data?: any };
    };

export interface IPersonalDetail {
  fullName: string;
  email: string;
  phoneCode: IPhoneCode | null;
  phoneNumber: string;
  address: Country | null;
  addressDetail: string;
  summary: string;
  jobTitle: string;
}

export interface IProject {
  projectName: string;
  description: string;
}

export interface ILanguage {
  language: string;
  proficiency: string;
}

export interface Social {
  website: string;
  linkedIn: string;
}

export interface IWorkExperience {
  jobTitle: string;
  companyName: string;
  location: Country | null;
  startDate: string;
  endDate: string;
  description: string;
  summary: string;
}

export interface IEducation {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  awards: string;
  relevantCoursework: string;
}

export interface ICreateResumeDataForm {
  personalDetail: IPersonalDetail;
  workExperiences: IWorkExperience[];
  educations: IEducation[];
  skills?: string[];
  projects?: IProject[];
  socials: Social;
  languages: ILanguage[];
}

type ProfileDetailState = {
  formData: ICreateResumeDataForm;
  steps: IStepItem[];
  stepIndex: number;
  profileTemp?: IPersonalDetail;
  workExperiences?: IWorkExperience[];
  educations?: IEducation[];
};

type CreateResumeProviderProps = {
  children: ReactNode;
};

const initContext: ProfileDetailState = {
  formData: {
    personalDetail: {
      fullName: '',
      email: '',
      phoneCode: null,
      phoneNumber: '',
      address: null,
      addressDetail: '',
      summary: '',
      jobTitle: ''
    },
    workExperiences: [
      {
        jobTitle: '',
        companyName: '',
        location: null,
        startDate: '',
        endDate: '',
        description: '',
        summary: ''
      }
    ],
    educations: [
      {
        school: '',
        major: '',
        degree: '',
        startDate: '',
        endDate: '',
        gpa: '',
        awards: '',
        relevantCoursework: ''
      }
    ],
    socials: {
      website: '',
      linkedIn: ''
    },
    languages: [
      {
        language: '',
        proficiency: ''
      }
    ]
  },
  steps: STEPS,
  stepIndex: 0,
  profileTemp: undefined,
  workExperiences: []
};

const CreateResumeContext = createContext({ state: initContext } as {
  state: ProfileDetailState;
  dispatch: Dispatch<Action>;
});

export function JobCompanyProvider({ children }: CreateResumeProviderProps) {
  const handleNextStep = (state: ProfileDetailState, data: any) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };

    return state;
  };

  const handlePrevStep = (state: ProfileDetailState, data: any) => {
    const stepIndex = state.stepIndex;
    if (stepIndex > 0) {
      return {
        ...state,
        stepIndex: stepIndex - 1,
        formData: { ...state?.formData, ...data }
      };
    }

    return state;
  };

  const handleChangeStep = (state: ProfileDetailState, data: any) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (state: ProfileDetailState, action: Action): ProfileDetailState => {
    switch (action.type) {
      case CreateResumeActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case CreateResumeActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case CreateResumeActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case CreateResumeActionType.SET_FORM_DATA: {
        const formData = action?.payload?.data;

        return {
          ...state,
          formData
        };
      }
      case CreateResumeActionType.SET_PROFILE_TEMP: {
        const profileTemp = action?.payload?.data as IPersonalDetail;
        return {
          ...state,
          profileTemp,
          formData: {
            ...state.formData,
            personalDetail: profileTemp ?? state.formData.personalDetail
          }
        };
      }
      case CreateResumeActionType.SET_WORK_EXPERIENCE: {
        const workExperiences = action?.payload?.data as IWorkExperience[];
        return {
          ...state,
          workExperiences
        };
      }
      case CreateResumeActionType.SET_EDUCATION: {
        const educations = action?.payload?.data as IEducation[];
        return {
          ...state,
          educations
        };
      }
      case CreateResumeActionType.SET_OTHER_INFORMATION: {
        const otherInformation = action.payload?.data ?? {};
        const { skills, languages, socials, projects } = otherInformation;
        return {
          ...state,
          formData: {
            ...state.formData,
            skills: skills ?? state.formData.skills,
            languages: languages ?? state.formData.languages,
            socials: socials ?? state.formData.socials,
            projects: projects ?? state.formData.projects
          }
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initContext as ProfileDetailState);

  return (
    <CreateResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateResumeContext.Provider>
  );
}

export const CreateResume = () => {
  const { state, dispatch } = useContext(CreateResumeContext);

  const changeStep = (stepActive: number) => {
    dispatch({ type: CreateResumeActionType.CHANGE_STEP, payload: { data: { stepActive } } });
  };

  const nextStep = (data: ICreateResumeDataForm) => {
    dispatch({ type: CreateResumeActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: ICreateResumeDataForm) => {
    dispatch({ type: CreateResumeActionType.PREVIOUS_STEP, payload: { data } });
  };

  const setProfileTemp = (data?: IPersonalDetail) => {
    dispatch({ type: CreateResumeActionType.SET_PROFILE_TEMP, payload: { data } });
  };
  const setWorkExperiences = (data?: any) => {
    dispatch({ type: CreateResumeActionType.SET_WORK_EXPERIENCE, payload: { data } });
  };

  const setEducations = (data?: any) => {
    dispatch({ type: CreateResumeActionType.SET_EDUCATION, payload: { data } });
  };
  const setOtherInformation = (data?: any) => {
    dispatch({ type: CreateResumeActionType.SET_OTHER_INFORMATION, payload: { data } });
  };

  return {
    state,
    actions: {
      changeStep,
      nextStep,
      previousStep,
      setProfileTemp,
      setWorkExperiences,
      setEducations,
      setOtherInformation
    }
  };
};
