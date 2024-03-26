'use client';
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
const SendToEmail = dynamic(() => import('../components/forgot-password-step-one'), {
  ssr: false
});
const ResetPassword = dynamic(() => import('../components/forgot-password-reset-password'), {
  ssr: false
});
const SuccessStep = dynamic(() => import('../components/forgot-password-success-result'), {
  ssr: false
});

export enum ForgotPasswordEmployeeActionType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  SET_FORM_DATA = 'SET_FORM_DATA',
  CHANGE_STEP = 'CHANGE_STEP'
}

export interface IStepItem {
  title: string;
  component: ReactElement;
}

const STEPS: IStepItem[] = [
  { title: 'send-to-mail', component: createElement(SendToEmail) },
  { title: 'reset-password', component: createElement(ResetPassword) },
  { title: 'success-result', component: createElement(SuccessStep) }
];

type Action =
  | {
      type: ForgotPasswordEmployeeActionType.NEXT_STEP;
      payload: { data?: IEmployeeForgotPassword };
    }
  | {
      type: ForgotPasswordEmployeeActionType.PREVIOUS_STEP;
      payload: { data?: IEmployeeForgotPassword };
    }
  | {
      type: ForgotPasswordEmployeeActionType.SET_FORM_DATA;
      payload: { data: IEmployeeForgotPassword };
    }
  | {
      type: ForgotPasswordEmployeeActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    };

export interface IPhoneCode {
  label: string;
  value: string;
}

export interface IEmployeeForgotPassword {
  email: string;
  password: string;
  confirmPassword: string;
  verifyCode?: number;
}

type ForgotPasswordEmployeeState = {
  formData: IEmployeeForgotPassword;
  steps: IStepItem[];
  stepIndex: number;
};

type ForgotPasswordEmployeeProviderProps = {
  children: ReactNode;
};

const initContext: ForgotPasswordEmployeeState = {
  formData: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  steps: STEPS,
  stepIndex: 0
};

const ForgotPasswordEmployeeContext = createContext({ state: initContext } as {
  state: ForgotPasswordEmployeeState;
  dispatch: Dispatch<Action>;
});

export function ForgotPasswordEmployeeProvider({ children }: ForgotPasswordEmployeeProviderProps) {
  const handleNextStep = (state: ForgotPasswordEmployeeState, data?: IEmployeeForgotPassword) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };
    return state;
  };

  const handlePrevStep = (state: ForgotPasswordEmployeeState, data?: IEmployeeForgotPassword) => {
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

  const handleChangeStep = (state: ForgotPasswordEmployeeState, data: { stepActive: number }) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (
    state: ForgotPasswordEmployeeState,
    action: Action
  ): ForgotPasswordEmployeeState => {
    switch (action.type) {
      case ForgotPasswordEmployeeActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case ForgotPasswordEmployeeActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case ForgotPasswordEmployeeActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case ForgotPasswordEmployeeActionType.SET_FORM_DATA: {
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

  const [state, dispatch] = useReducer(reducer, initContext as ForgotPasswordEmployeeState);

  return (
    <ForgotPasswordEmployeeContext.Provider value={{ state, dispatch }}>
      {children}
    </ForgotPasswordEmployeeContext.Provider>
  );
}

export const useForgotPasswordEmployee = () => {
  const { state, dispatch } = useContext(ForgotPasswordEmployeeContext);

  const changeStep = (stepActive: number) => {
    dispatch({
      type: ForgotPasswordEmployeeActionType.CHANGE_STEP,
      payload: { data: { stepActive } }
    });
  };

  const nextStep = (data: IEmployeeForgotPassword) => {
    dispatch({ type: ForgotPasswordEmployeeActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: IEmployeeForgotPassword) => {
    dispatch({ type: ForgotPasswordEmployeeActionType.PREVIOUS_STEP, payload: { data } });
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
