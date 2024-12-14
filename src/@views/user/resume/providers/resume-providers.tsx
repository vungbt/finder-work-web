'use client';
import { ResumeType } from '@/configs/graphql/generated';
import { UploadItem } from '@/libraries/common';
import { IOptItem, OptionItem } from '@/types';
import dynamic from 'next/dynamic';
import {
  Dispatch,
  ReactElement,
  ReactNode,
  createContext,
  createElement,
  useContext,
  useReducer
} from 'react';

const ResumeMain = dynamic(() => import('../components/resume-main'), {
  ssr: false
});

const PersonalDetail = dynamic(() => import('../components/personal-detail'), {
  ssr: false
});
const WorkExperiences = dynamic(() => import('../components/work-experience'), {
  ssr: false
});
const ProjectDetail = dynamic(() => import('../components/project-detail'), {
  ssr: false
});
const EducationDetail = dynamic(() => import('../components/education-detail'), {
  ssr: false
});
const MoreInformation = dynamic(() => import('../components/more-information'), {
  ssr: false
});
const FinalTouch = dynamic(() => import('../components/final-touches'), {
  ssr: false
});

export enum ResumeActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP'
}

export interface IResumeStepItem {
  title: string;
  component: ReactElement;
}

const STEPS: IResumeStepItem[] = [
  { title: 'resume-main', component: createElement(ResumeMain) }, // main
  { title: 'personal-detail', component: createElement(PersonalDetail) }, // step 1
  { title: 'work-experience', component: createElement(WorkExperiences) }, // step 2
  { title: 'project-detail', component: createElement(ProjectDetail) }, // step 3
  { title: 'education-detail', component: createElement(EducationDetail) }, // step 4
  { title: 'more-information', component: createElement(MoreInformation) }, // step 5
  { title: 'final-touches', component: createElement(FinalTouch) } // step 6
];

type Action =
  | {
      type: ResumeActionType.NEXT_STEP;
      payload: { data?: IResumeType };
    }
  | {
      type: ResumeActionType.PREVIOUS_STEP;
      payload: { data?: IResumeType };
    }
  | {
      type: ResumeActionType.SET_FORM_DATA;
      payload: { data: IResumeType };
    }
  | {
      type: ResumeActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    };

export interface IResumePersonalDetail {
  name: string;
  avatar?: UploadItem;
  thumbnail?: UploadItem;
  pdf?: UploadItem;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: OptionItem;
  addressDetail: string;
  descriptionType: ResumeType;
  description: string;
  jobTitle?: OptionItem;
}

export interface IResumeWorkExperience {
  jobTitle?: OptionItem;
  company?: IOptItem | null;
  isFreelancer?: string[];
  address?: OptionItem | null;
  startAt?: Date | null;
  endAt?: Date | null;
  description: string;
  isCurrentlyWorkHere?: string[];
}

export interface IResumeProjectDetail {
  title: string;
  description: string;
  teamSize: number;
  role: OptionItem;
  techStacks: OptionItem[]; // skills
  startAt: Date | null;
  endAt: Date | null;
  company?: IOptItem | null;
  refeUrls: string[];
  isFreelancer?: string[];
  thumbnail?: UploadItem | null;
}

export interface IResumeEducation {
  type: OptionItem | null;
  major: OptionItem | null; // skill
  degree: OptionItem | null;
  graduationAt: Date | null;
  gpa: number;
  awards: string[];
  relevantCourseWorks: string[];
}

export interface IResumeMoreInformation {
  languageSkills: OptionItem[];
  skills: OptionItem[]; // skill
  certificates?: {
    name: string;
    file: UploadItem;
  }[];
  socials?: {
    type: OptionItem;
    url: string;
  }[];
  activities?: {
    name: string;
    startAt: Date;
    endAt: Date;
    description: string;
  }[];
}

export interface IResumeType {
  personal?: IResumePersonalDetail;
  workExperiences?: IResumeWorkExperience[];
  projects?: IResumeProjectDetail[];
  educations?: IResumeEducation[];
  moreInformation?: IResumeMoreInformation;
}

type ResumeState = {
  formData: IResumeType;
  totalStep: number;
  steps: IResumeStepItem[];
  stepIndex: number;
};

type ResumeProviderProps = {
  children: ReactNode;
};

const initContext: ResumeState = {
  formData: {
    personal: undefined,
    workExperiences: [],
    projects: [],
    educations: [],
    moreInformation: undefined
  },
  steps: STEPS,
  stepIndex: 0,
  totalStep: STEPS.length
};

const ResumeContext = createContext({ state: initContext } as {
  state: ResumeState;
  dispatch: Dispatch<Action>;
});

export function ResumeProvider({ children }: ResumeProviderProps) {
  const handleNextStep = (state: ResumeState, data?: IResumeType) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };
    return state;
  };

  const handlePrevStep = (state: ResumeState, data?: IResumeType) => {
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

  const handleChangeStep = (state: ResumeState, data: { stepActive: number }) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (state: ResumeState, action: Action): ResumeState => {
    switch (action.type) {
      case ResumeActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case ResumeActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case ResumeActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case ResumeActionType.SET_FORM_DATA: {
        const formData = action?.payload?.data;

        return {
          ...state,
          formData
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initContext as ResumeState);

  return <ResumeContext.Provider value={{ state, dispatch }}>{children}</ResumeContext.Provider>;
}

export const useResume = (): {
  state: ResumeState;
  actions: {
    changeStep: (stepActive: number) => void;
    nextStep: (data: IResumeType) => void;
    previousStep: (data: IResumeType) => void;
  };
} => {
  const { state, dispatch } = useContext(ResumeContext) as {
    state: ResumeState;
    dispatch: Dispatch<Action>;
  };

  const changeStep = (stepActive: number) => {
    dispatch({
      type: ResumeActionType.CHANGE_STEP,
      payload: { data: { stepActive } }
    });
  };

  const nextStep = (data: IResumeType) => {
    console.log('data===>', data);

    dispatch({ type: ResumeActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: IResumeType) => {
    dispatch({ type: ResumeActionType.PREVIOUS_STEP, payload: { data } });
  };

  return {
    state,
    actions: {
      changeStep,
      nextStep,
      previousStep
    }
  };
};
