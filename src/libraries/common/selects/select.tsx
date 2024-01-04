import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { Ref, forwardRef } from 'react';
import Select, {
  DropdownIndicatorProps,
  ClearIndicatorProps,
  GroupBase,
  Props as SelectProps,
  components
} from 'react-select';

type SelectFormProps = SelectProps & {
  errorMes?: string;
  loading?: boolean;
  size?: 'large' | 'middle' | 'small';
};

export const SelectForm = forwardRef(function SelectForm(props: SelectFormProps, ref: Ref<never>) {
  const { className, size = 'large', ...reset } = props;

  const DropdownIndicator = (
    props: DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>
  ) => {
    const menuIsOpen = props.selectProps.menuIsOpen;
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
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

  const ClearIndicator = (props: ClearIndicatorProps<unknown, boolean, GroupBase<unknown>>) => {
    return (
      components.ClearIndicator && (
        <components.ClearIndicator {...props}>
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
        </components.ClearIndicator>
      )
    );
  };

  return (
    <Select
      ref={ref}
      components={{ DropdownIndicator, ClearIndicator }}
      className={clsx('select-custom', className)}
      classNames={{
        control: (state) => {
          const isFocused = state.isFocused;
          return clsx('select-custom__control', {
            // control with size
            'select-custom__control__large': size === 'large',
            'select-custom__control__middle': size === 'middle',
            'select-custom__control__small': size === 'small',

            // control with focused
            'select-custom__control__focused__large': isFocused && size === 'large',
            'select-custom__control__focused__middle': isFocused && size === 'middle',
            'select-custom__control__focused__small': isFocused && size === 'small'
          });
        },
        valueContainer: () => {
          return clsx('select-custom__valueContainer', {
            // control with size
            'select-custom__valueContainer__large': size === 'large',
            'select-custom__valueContainer__middle': size === 'middle',
            'select-custom__valueContainer__small': size === 'small'
          });
        },
        input: () => {
          return clsx('select-custom__input', {
            // control with size
            'select-custom__input__large': size === 'large',
            'select-custom__input__middle': size === 'middle',
            'select-custom__input__small': size === 'small'
          });
        },
        menu: () => {
          return clsx('select-custom__menu', {
            // control with size
            'select-custom__menu__large': size === 'large',
            'select-custom__menu__middle': size === 'middle',
            'select-custom__menu__small': size === 'small'
          });
        },
        menuList: () => {
          return clsx('select-custom__menuList', {
            // control with size
            'select-custom__menuList__large': size === 'large',
            'select-custom__menuList__middle': size === 'middle',
            'select-custom__menuList__small': size === 'small'
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
            'select-custom__menuOption__focused': isFocused
          });
        },
        multiValue: () => {
          return clsx('select-custom__multiValue', {
            // option with size
            'select-custom__multiValue__large': size === 'large',
            'select-custom__multiValue__middle': size === 'middle',
            'select-custom__multiValue__small': size === 'small'
          });
        }
      }}
      {...reset}
    />
  );
});
