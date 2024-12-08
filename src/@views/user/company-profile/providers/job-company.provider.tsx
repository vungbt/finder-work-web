/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { IOptItem } from '@/types';
import dynamic from 'next/dynamic';
import { Dispatch, ReactNode, createContext, createElement, useContext, useReducer } from 'react';
import { IStepItem } from '.';

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

export enum JobActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP'
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
      type: JobActionType.NEXT_STEP;
      payload: { data?: IJobType };
    }
  | {
      type: JobActionType.PREVIOUS_STEP;
      payload: { data?: IJobType };
    }
  | {
      type: JobActionType.SET_FORM_DATA;
      payload: { data: IJobType };
    }
  | {
      type: JobActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    };

type JobState = {
  formData: IJobType;
  totalStep: number;
  steps: IStepItem[];
  stepIndex: number;
};

export interface IJobInformation {
  jobTitleOpt?: IOptItem;
  type?: IOptItem;
  applicationDeadline?: string;
  level?: IOptItem;
  salary?: IOptItem;
  currencyUnit?: IOptItem;
  fromStartRange?: string;
  toEndRange?: string;
  address?: IOptItem;
  jobCategory?: IOptItem;
  addressDetail?: string;
}

export interface IDescriptionSkill {
  description: string;
  skill: IOptItem[];
  tags: IOptItem[];
  numberOfRecruits: number;
}

export interface IJobType {
  jobInformation?: IJobInformation;
  descriptionSkill?: IDescriptionSkill;
  company?: IOptItem;
}
type JobProviderProps = {
  children: ReactNode;
};

const initContext: JobState = {
  formData: {
    jobInformation: undefined,
    descriptionSkill: undefined,
    company: undefined
  },
  steps: STEPS,
  stepIndex: 0,
  totalStep: STEPS.length
};

const JobContext = createContext({ state: initContext } as {
  state: JobState;
  dispatch: Dispatch<Action>;
});

export function JobProvider({ children }: JobProviderProps) {
  const handleNextStep = (state: JobState, data?: IJobType) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };
    return state;
  };
  const handleChangeStep = (state: JobState, data: { stepActive: number }) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const handlePrevStep = (state: JobState, data?: IJobType) => {
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

  const reducer = (state: JobState, action: Action): JobState => {
    switch (action.type) {
      case JobActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case JobActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case JobActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case JobActionType.SET_FORM_DATA: {
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

  const [state, dispatch] = useReducer(reducer, initContext as JobState);

  return <JobContext.Provider value={{ state, dispatch }}>{children}</JobContext.Provider>;
}

export const useJob = () => {
  const { state, dispatch } = useContext(JobContext);

  const changeStep = (stepActive: number) => {
    dispatch({
      type: JobActionType.CHANGE_STEP,
      payload: { data: { stepActive } }
    });
  };

  const nextStep = (data: IJobType) => {
    dispatch({ type: JobActionType.NEXT_STEP, payload: { data } });
  };
  const previousStep = (data: IJobType) => {
    dispatch({ type: JobActionType.PREVIOUS_STEP, payload: { data } });
  };

  const resetFormData = () => {
    state.formData = initContext.formData;
  };

  return {
    state,
    actions: {
      changeStep,
      nextStep,
      previousStep,
      resetFormData
    }
  };
};
