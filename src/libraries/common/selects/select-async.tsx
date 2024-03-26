/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName, RenderIcon } from '@/libraries/icons';
import { IOptItem } from '@/types';
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import { cloneDeep, debounce } from 'lodash';
import { Ref, forwardRef } from 'react';
import {
  ActionMeta,
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  OnChangeValue,
  Props as SelectProps,
  components
} from 'react-select';
import Select from 'react-select/async';
import { Tag } from '..';
import { FormGroup } from '../form';

type SelectAsyncProps = Omit<SelectProps, 'isClearable'> & {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;
  label?: string;
  isRequired?: boolean;

  error?: string;
  loading?: boolean;
  icon?: IconName;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
  delay?: number;
  filterOptions?: (searchValue?: string) => IOptItem[];
};

export const SelectAsync = forwardRef(function SelectAsync(
  props: SelectAsyncProps,
  ref: Ref<never>
) {
  const {
    className,
    size = 'large',
    field,
    form,
    layout,
    isRequired,
    label,
    delay = 600,
    onChange,
    filterOptions,
    ...reset
  } = props;
  const name = field?.name;
  const fieldValues = cloneDeep(field?.value);
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const DropdownIndicator = (
    props: DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>
  ) => {
    const menuIsOpen = props.selectProps.menuIsOpen;
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator
          {...props}
          className={clsx({
            '!pr-4': size === 'large' || size === 'middle',
            '!pr-2': size === 'small'
          })}>
          <RenderIcon
            name="chevron-down"
            className={clsx('text-dark transition-all ease-linear', {
              'rotate-180 text-info': menuIsOpen,

              // icon resize
              '!h-5 !w-5': size === 'large',
              '!h-4.5 !w-4.5': size === 'middle',
              '!h-4 !w-4': size === 'small'
            })}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const ClearIndicator = (
    props: ClearIndicatorProps<unknown, boolean, GroupBase<unknown>> & { onClearAll?: () => void }
  ) => {
    return (
      components.ClearIndicator && (
        <components.ClearIndicator {...props}>
          <button onClick={props.onClearAll}>
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
        </components.ClearIndicator>
      )
    );
  };

  const onHandleChange = (values: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => {
    if (onChange) {
      onChange(values, actionMeta);
    }
    if (!field) return;
    onHandleTouched(values);
    setValueForFormField(values);
  };

  const onHandleCloseTag = (itemRemove: IOptItem) => {
    if (!fieldValues) return;
    const isArray = fieldValues ? Array.isArray(fieldValues) : false;
    if (!isArray) return;
    const newValues = (fieldValues as IOptItem[]).filter((item) => item.value !== itemRemove.value);

    onHandleTouched(newValues);
    setValueForFormField(newValues);
  };

  const setValueForFormField = (value: any) => {
    if (!field) return;
    const changeEvent = {
      target: {
        name,
        value: value
      }
    };
    field.onChange(changeEvent);
  };

  const onHandleTouched = (values: IOptItem | IOptItem[]) => {
    if (!form) return;
    const isArray = values ? Array.isArray(values) : false;
    if (isArray) {
      const newTouched: any = { ...form.touched };
      if (!values || (values as IOptItem[]).length <= 0) {
        newTouched[`${name}`] = true;
      } else {
        newTouched[`${name}`] = false;
      }
      form?.setTouched({ ...form.touched, ...newTouched });
    } else {
      const newTouched: any = { ...form.touched };
      if (!values || Object.keys(values).length <= 0) {
        newTouched[`${name}`] = true;
      } else {
        newTouched[`${name}`] = false;
      }
      form?.setTouched({ ...form.touched, ...newTouched });
    }
  };

  const onHandleClearAll = () => {
    if (!fieldValues) return;
    onHandleTouched(fieldValues);
    setValueForFormField(fieldValues);
  };

  const debouncedFetch = debounce((searchTerm, callback) => {
    if (filterOptions) {
      callback(filterOptions(searchTerm));
    }
  }, delay);

  return (
    <FormGroup layout={layout} label={label} name={name} isRequired={isRequired}>
      <Select
        ref={ref}
        id={name}
        name={name}
        value={fieldValues}
        components={{
          DropdownIndicator,
          ClearIndicator: (props) => <ClearIndicator {...props} onClearAll={onHandleClearAll} />
        }}
        className={clsx('select-custom', className)}
        classNames={{
          control: (state) => {
            const isFocused = state.isFocused;
            return clsx('select-custom__control transition-all ease-linear', {
              // control with size
              'select-custom__control__large': size === 'large',
              'select-custom__control__middle': size === 'middle',
              'select-custom__control__small': size === 'small',

              // control with focused
              'select-custom__control__focused__large': isFocused && size === 'large',
              'select-custom__control__focused__middle': isFocused && size === 'middle',
              'select-custom__control__focused__small': isFocused && size === 'small',

              // control with focused
              'select-custom__control__error select-custom__control__focused__error': isHaveError
            });
          },
          valueContainer: () => {
            return clsx('select-custom__valueContainer', {
              // valueContainer with size
              'select-custom__valueContainer__large': size === 'large',
              'select-custom__valueContainer__middle': size === 'middle',
              'select-custom__valueContainer__small': size === 'small',

              // valueContainer with size
              'select-custom__valueContainer__error': isHaveError
            });
          },
          input: () => {
            return clsx('select-custom__input', {
              // input with size
              'select-custom__input__large': size === 'large',
              'select-custom__input__middle': size === 'middle',
              'select-custom__input__small': size === 'small',

              // input with size
              'select-custom__input__error': isHaveError
            });
          },
          menu: () => {
            return clsx('select-custom__menu', {
              // menu with size
              'select-custom__menu__large': size === 'large',
              'select-custom__menu__middle': size === 'middle',
              'select-custom__menu__small': size === 'small',

              // menu with size
              'select-custom__menu__error': isHaveError
            });
          },
          menuList: () => {
            return clsx('select-custom__menuList', {
              // menuList with size
              'select-custom__menuList__large': size === 'large',
              'select-custom__menuList__middle': size === 'middle',
              'select-custom__menuList__small': size === 'small',

              // menuList with size
              'select-custom__menuList__error': isHaveError
            });
          },
          option: (state) => {
            const isSelected = state.isSelected;
            const isFocused = state.isFocused;

            return clsx('select-custom__menuOption', {
              // option with size
              'select-custom__menuOption__large': size === 'large',
              'select-custom__menuOption__middle': size === 'middle',
              'select-custom__menuOption__small': size === 'small',

              // option with selected
              'select-custom__menuOption__selected': isSelected,
              'select-custom__menuOption__focused': isFocused,

              // option with error
              'select-custom__menuOption__error': isHaveError
            });
          },
          multiValue: () => {
            return clsx('select-custom__multiValue', {
              // multiValue with size
              'select-custom__multiValue__large': size === 'large',
              'select-custom__multiValue__middle': size === 'middle',
              'select-custom__multiValue__small': size === 'small',

              // multiValue with error
              'select-custom__multiValue__error': isHaveError
            });
          },
          placeholder: () => {
            return clsx('select-custom__placeholder', {
              // placeholder with size
              'select-custom__placeholder__large': size === 'large',
              'select-custom__placeholder__middle': size === 'middle',
              'select-custom__placeholder__small': size === 'small',

              // placeholder with error
              'select-custom__placeholder__error': isHaveError
            });
          }
        }}
        loadOptions={debouncedFetch}
        onChange={onHandleChange}
        onBlur={field?.onBlur}
        {...reset}
      />
      {fieldValues && Array.isArray(fieldValues) && (
        <div
          className={clsx('mt-2 flex flex-wrap gap-2', {
            hidden: (fieldValues as IOptItem[]).length <= 0
          })}>
          {(fieldValues as IOptItem[]).map((item) => (
            <Tag
              key={item.value}
              content={item.label}
              icon="loading"
              onClose={() => onHandleCloseTag(item)}
            />
          ))}
        </div>
      )}
    </FormGroup>
  );
});
