/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName, RenderIcon } from '@/libraries/icons';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import { Ref, forwardRef } from 'react';
import ReactDatePicker, {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps
} from 'react-datepicker';
import { FormGroup, IconViewSize } from '..';

type DatePickerProps = Omit<ReactDatePickerProps, 'onChange' | 'placeholderText'> & {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;
  className?: string;

  label?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;
  isRequired?: boolean;
  placeholder?: string;

  error?: string;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
  onChange?: (value: Date | null) => void;
  onClear?: () => void;
};

export const DatePicker = forwardRef(function DatePicker(props: DatePickerProps, ref: Ref<any>) {
  const {
    className,
    size = 'large',
    field,
    form,
    iconLeft,
    iconRight = 'date-icon',
    layout,
    isLoading,
    isRequired,
    label,
    selected,
    dateFormat,
    isClearable,
    placeholder,
    onChange,
    onClear,
    ...reset
  } = props;

  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const onHandleChange = (value: Date | null) => {
    if (onChange) {
      onChange(value);
    }
    if (!field) return;
    const changeEvent = {
      target: {
        name,
        value: value
      }
    };
    field.onChange(changeEvent);
  };

  const onHandleClear = () => {
    if (onClear) {
      onClear();
    }
    if (!field) return;
    const changeEvent = {
      target: {
        name,
        value: null
      }
    };
    field.onChange(changeEvent);
  };

  return (
    <FormGroup layout={layout} label={label} name={name} isRequired={isRequired}>
      <label
        htmlFor={name}
        className={clsx(
          'datepicker-custom box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info',
          {
            'min-h-10 gap-3 rounded-3xl px-4 text-base': size === 'large',
            'min-h-8 gap-2 rounded-2xl px-4 text-sm': size === 'middle',
            'min-h-6 gap-1 rounded-xl px-2 text-sm': size === 'small',

            '!border-danger': isHaveError,
            'border-gray-100': !isHaveError
          },
          className
        )}
      >
        {iconLeft && (
          <IconViewSize className="icon-left" name={iconLeft} isLoading={isLoading} size={size} />
        )}
        <ReactDatePicker
          ref={ref}
          className="w-full flex-1 bg-transparent outline-none"
          onChange={onHandleChange}
          selected={field?.value ?? selected}
          dateFormat={dateFormat ?? EDateFormat.MM_dd_yyyy}
          renderCustomHeader={CustomHeader}
          placeholderText={placeholder}
          {...reset}
        />
        {isClearable && <ClearIndicator size={size} onClear={onHandleClear} />}
        {(iconRight || isLoading) && (
          <IconViewSize className="icon-right" name={iconRight} isLoading={isLoading} size={size} />
        )}
      </label>
    </FormGroup>
  );
});

const CustomHeader = (params: ReactDatePickerCustomHeaderProps) => {
  const { date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled } =
    params;
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="px-2 text-gray-100 transition-all ease-linear hover:text-white"
      >
        <RenderIcon name="chevron-left" strokeWidth={3} className="!h-4 !w-4" />
      </button>
      <span className="w-full flex-1 text-sm font-medium text-white">
        {formatDate(date, EDateFormat.MMMM_yyyy)}
      </span>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="px-2 text-gray-100 transition-all ease-linear hover:text-white"
      >
        <RenderIcon name="chevron-right" strokeWidth={3} className="!h-4 !w-4" />
      </button>
    </div>
  );
};

const ClearIndicator = ({
  onClear,
  size
}: {
  onClear?: () => void;
  size?: 'large' | 'middle' | 'small';
}) => {
  return (
    <button type="button" onClick={onClear}>
      <RenderIcon
        name="close-circle-bold"
        className={clsx(
          'cursor-pointer text-gray-100 transition-all ease-linear hover:text-danger',
          {
            // icon resize
            '!h-5 !w-5': size === 'large',
            '!h-4.5 !w-4.5': size === 'middle',
            '!h-4 !w-4': size === 'small'
          }
        )}
      />
    </button>
  );
};
