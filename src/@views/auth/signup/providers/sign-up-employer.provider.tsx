/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { UserOnly } from '@/configs/graphql/generated';
import { IOptItem, OptionItem } from '@/types';
import dynamic from 'next/dynamic';
import { Dispatch, ReactNode, createContext, createElement, useContext, useReducer } from 'react';
import { IPhoneCode, IStepItem } from '.';
const StepOne = dynamic(() => import('../components/sign-up-employer-step-one'), { ssr: false });
const StepTwo = dynamic(() => import('../components/sign-up-employer-step-two'), {
  ssr: false
});
const StepThree = dynamic(() => import('../components/sign-up-employer-step-three'), {
  ssr: false
});
const VerifyCodeStep = dynamic(() => import('../components/sign-up-employer-verify-code'), {
  ssr: false
});
const SuccessStep = dynamic(() => import('../components/sign-up-employer-success-result'), {
  ssr: false
});

export enum SignUpEmployerActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP',
  SET_USER_TEMP = 'SET_USER_TEMP'
}

const STEPS: IStepItem[] = [
  { title: 'step-one', component: createElement(StepOne) },
  { title: 'step-two', component: createElement(StepTwo) },
  { title: 'step-three', component: createElement(StepThree) },
  { title: 'verify-code', component: createElement(VerifyCodeStep) },
  { title: 'success-result', component: createElement(SuccessStep) }
];

type Action =
  | {
      type: SignUpEmployerActionType.NEXT_STEP;
      payload: { data?: IEmployerRegister };
    }
  | {
      type: SignUpEmployerActionType.PREVIOUS_STEP;
      payload: { data?: IEmployerRegister };
    }
  | {
      type: SignUpEmployerActionType.SET_FORM_DATA;
      payload: { data: IEmployerRegister };
    }
  | {
      type: SignUpEmployerActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    }
  | {
      type: SignUpEmployerActionType.SET_USER_TEMP;
      payload: { data?: UserOnly };
    };

export interface IEmployerRegister {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneCode?: IPhoneCode | null;
  phoneNumber?: string;
  confirmPassword?: string;
  verifyCode?: number;
  agreePolicy?: any;
  // Step 3
  workingPosition?: OptionItem | null;
  company?: IOptItem | null;
  industries?: IOptItem[];
  size?: IOptItem | null;
  type?: IOptItem | null;
  address?: IOptItem | null;
  addressDetail?: string | null;
}

type SignUpEmployerState = {
  formData: IEmployerRegister;
  steps: IStepItem[];
  stepIndex: number;
  userTemp?: UserOnly;
};

type SignUpEmployerProviderProps = {
  children: ReactNode;
};

const initContext: SignUpEmployerState = {
  formData: {
    email: '',
    firstName: '',
    lastName: '',
    phoneCode: null,
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    company: null,
    size: null,
    type: null,
    industries: [],
    address: null,
    addressDetail: ''
  },
  steps: STEPS,
  stepIndex: 0,
  userTemp: undefined
};

const SignUpEmployerContext = createContext({ state: initContext } as {
  state: SignUpEmployerState;
  dispatch: Dispatch<Action>;
});

export function SignUpEmployerProvider({ children }: SignUpEmployerProviderProps) {
  const handleNextStep = (state: SignUpEmployerState, data: any) => {
    const stepIndex = state.stepIndex;
    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };

    return state;
  };

  const handlePrevStep = (state: SignUpEmployerState, data: any) => {
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

  const handleChangeStep = (state: SignUpEmployerState, data: any) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (state: SignUpEmployerState, action: Action): SignUpEmployerState => {
    switch (action.type) {
      case SignUpEmployerActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case SignUpEmployerActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case SignUpEmployerActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case SignUpEmployerActionType.SET_FORM_DATA: {
        const formData = action?.payload?.data;

        return {
          ...state,
          formData
        };
      }
      case SignUpEmployerActionType.SET_USER_TEMP: {
        const userTemp = action?.payload?.data;
        return {
          ...state,
          userTemp
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initContext as SignUpEmployerState);

  return (
    <SignUpEmployerContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpEmployerContext.Provider>
  );
}

export const useSignUpEmployer = () => {
  const { state, dispatch } = useContext(SignUpEmployerContext);

  const changeStep = (stepActive: number) => {
    dispatch({ type: SignUpEmployerActionType.CHANGE_STEP, payload: { data: { stepActive } } });
  };

  const nextStep = (data: IEmployerRegister) => {
    dispatch({ type: SignUpEmployerActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: IEmployerRegister) => {
    dispatch({ type: SignUpEmployerActionType.PREVIOUS_STEP, payload: { data } });
  };

  const setUserTemp = (data?: UserOnly) => {
    dispatch({ type: SignUpEmployerActionType.SET_USER_TEMP, payload: { data } });
  };

  return {
    state,
    actions: {
      changeStep,
      nextStep,
      previousStep,
      setUserTemp
    }
  };
};
