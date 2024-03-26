/* eslint-disable @typescript-eslint/no-explicit-any */
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
const MainStep = dynamic(() => import('../components/sign-up-employee-main'), { ssr: false });
const BasicInfoStep = dynamic(() => import('../components/sign-up-employee-step-one'), {
  ssr: false
});
const VerifyCodeStep = dynamic(() => import('../components/sign-up-verify-code'), {
  ssr: false
});
const SuccessStep = dynamic(() => import('../components/sign-up-success-result'), {
  ssr: false
});

export enum SignUpEmployeeActionType {
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
  { title: 'main-step', component: createElement(MainStep) },
  { title: 'basic-info-step', component: createElement(BasicInfoStep) },
  { title: 'verify-code', component: createElement(VerifyCodeStep) },
  { title: 'success-result', component: createElement(SuccessStep) }
];

type Action =
  | {
      type: SignUpEmployeeActionType.NEXT_STEP;
      payload: { data?: IEmployeeRegister };
    }
  | {
      type: SignUpEmployeeActionType.PREVIOUS_STEP;
      payload: { data?: IEmployeeRegister };
    }
  | {
      type: SignUpEmployeeActionType.SET_FORM_DATA;
      payload: { data: IEmployeeRegister };
    }
  | {
      type: SignUpEmployeeActionType.CHANGE_STEP;
      payload: { data: { stepActive: number } };
    };

export interface IPhoneCode {
  label: string;
  value: string;
}

export interface IEmployeeRegister {
  email: string;
  firstName: string;
  lastName: string;
  phoneCode: IPhoneCode | null;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  verifyCode?: number;
  agreePolicy?: any;
}

type SignUpEmployeeState = {
  formData: IEmployeeRegister;
  steps: IStepItem[];
  stepIndex: number;
};

type SignUpEmployeeProviderProps = {
  children: ReactNode;
};

const initContext: SignUpEmployeeState = {
  formData: {
    email: '',
    firstName: '',
    lastName: '',
    phoneCode: null,
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  },
  steps: STEPS,
  stepIndex: 0
};

const SignUpEmployeeContext = createContext({ state: initContext } as {
  state: SignUpEmployeeState;
  dispatch: Dispatch<Action>;
});

export function SignUpEmployeeProvider({ children }: SignUpEmployeeProviderProps) {
  const handleNextStep = (state: SignUpEmployeeState, data: any) => {
    const stepIndex = state.stepIndex;

    if (stepIndex < STEPS.length - 1)
      return {
        ...state,
        stepIndex: stepIndex + 1,
        formData: { ...state?.formData, ...data }
      };

    // TODO: Call api register
    // createCampaignDispatch({
    //   type: CampaignActionType.SAVE_CAMPAIGN,
    //   payload: { data: { ...state.formData, ...data } }
    // });

    return state;
  };

  const handlePrevStep = (state: SignUpEmployeeState, data: any) => {
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

  const handleChangeStep = (state: SignUpEmployeeState, data: any) => {
    const stepIndex = state.stepIndex;
    const stepActive = data?.stepActive;
    if (stepActive > stepIndex) return state;
    return {
      ...state,
      stepIndex: stepActive
    };
  };

  const reducer = (state: SignUpEmployeeState, action: Action): SignUpEmployeeState => {
    switch (action.type) {
      case SignUpEmployeeActionType.NEXT_STEP: {
        const nextPayload = action.payload;
        return handleNextStep(state, nextPayload.data);
      }
      case SignUpEmployeeActionType.PREVIOUS_STEP: {
        const prePayload = action.payload;

        return handlePrevStep(state, prePayload.data);
      }
      case SignUpEmployeeActionType.CHANGE_STEP: {
        const changeStepDate = action.payload;

        return handleChangeStep(state, changeStepDate.data);
      }
      case SignUpEmployeeActionType.SET_FORM_DATA: {
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

  const [state, dispatch] = useReducer(reducer, initContext as SignUpEmployeeState);

  return (
    <SignUpEmployeeContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpEmployeeContext.Provider>
  );
}

export const useSignUpEmployee = () => {
  const { state, dispatch } = useContext(SignUpEmployeeContext);

  const changeStep = (stepActive: number) => {
    dispatch({ type: SignUpEmployeeActionType.CHANGE_STEP, payload: { data: { stepActive } } });
  };

  const nextStep = (data: IEmployeeRegister) => {
    dispatch({ type: SignUpEmployeeActionType.NEXT_STEP, payload: { data } });
  };

  const previousStep = (data: IEmployeeRegister) => {
    dispatch({ type: SignUpEmployeeActionType.PREVIOUS_STEP, payload: { data } });
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
