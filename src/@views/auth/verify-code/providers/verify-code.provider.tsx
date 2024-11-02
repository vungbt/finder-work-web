/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useSearchQuery } from '@/utils/navigation';
import dynamic from 'next/dynamic';
import {
  Dispatch,
  ReactElement,
  ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useReducer
} from 'react';
const VerifyCodeStep = dynamic(() => import('../components/verify-code'), {
  ssr: false
});
const SuccessStep = dynamic(() => import('../components/verify-code-success-result'), {
  ssr: false
});

export enum VerifyCodeActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP',
  SET_USER_TEMP = 'SET_USER_TEMP'
}

export interface IStepItem {
  title: string;
  component: ReactElement;
}

const STEPS: IStepItem[] = [
  { title: 'verify-code', component: createElement(VerifyCodeStep) },
  { title: 'success-result', component: createElement(SuccessStep) }
];

type Action =
  | {
      type: VerifyCodeActionType.NEXT_STEP;
      payload: { data?: IVerifyCode };
    }
  | {
      type: VerifyCodeActionType.PREVIOUS_STEP;
      payload: { data?: IVerifyCode };
    }
  | {
      type: VerifyCodeActionType.SET_FORM_DATA;
      payload: { data: IVerifyCode };
    }
  | {
      type: VerifyCodeActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    };

export interface IPhoneCode {
  label: string;
  value: string;
}

export interface IVerifyCode {
  email: string;
  password: string;
  id?: string;
}

type VerifyCodeState = {
  formData: IVerifyCode;
  steps: IStepItem[];
  stepIndex: number;
};

type VerifyCodeProviderProps = {
  children: ReactNode;
};

const initContext: VerifyCodeState = {
  formData: {
    email: '',
    password: '',
    id: ''
  },
  steps: STEPS,
  stepIndex: 0
};

const VerifyCodeContext = createContext({ state: initContext } as {
  state: VerifyCodeState;
  dispatch: Dispatch<Action>;
});

export function VerifyCodeProvider({ children }: VerifyCodeProviderProps) {
  const handleNextStep = (state: VerifyCodeState, data: any) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };

    return state;
  };

  const handlePrevStep = (state: VerifyCodeState, data: any) => {
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

  const handleChangeStep = (state: VerifyCodeState, data: any) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (state: VerifyCodeState, action: Action): VerifyCodeState => {
    switch (action.type) {
      case VerifyCodeActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case VerifyCodeActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case VerifyCodeActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case VerifyCodeActionType.SET_FORM_DATA: {
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

  const [state, dispatch] = useReducer(reducer, initContext as VerifyCodeState);

  return (
    <VerifyCodeContext.Provider value={{ state, dispatch }}>{children}</VerifyCodeContext.Provider>
  );
}

export const useVerifyCode = () => {
  const { state, dispatch } = useContext(VerifyCodeContext);
  const { searchQuery } = useSearchQuery<{ email: string; password: string; id: string }>();

  useEffect(() => {
    if (searchQuery && Object.keys(searchQuery).length > 0) {
      dispatch({ type: VerifyCodeActionType.SET_FORM_DATA, payload: { data: searchQuery } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const changeStep = (stepActive: number) => {
    dispatch({ type: VerifyCodeActionType.CHANGE_STEP, payload: { data: { stepActive } } });
  };

  const nextStep = (data: IVerifyCode) => {
    dispatch({ type: VerifyCodeActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: IVerifyCode) => {
    dispatch({ type: VerifyCodeActionType.PREVIOUS_STEP, payload: { data } });
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
