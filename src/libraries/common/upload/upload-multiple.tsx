/* eslint-disable @typescript-eslint/no-explicit-any */
import { FILE_IMAGE } from '@/constants/common';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { ChangeEvent, Ref, forwardRef } from 'react';
import { FormGroup, UploadItem, UploadPreview } from '..';

type UploadProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size' | 'onChange' | 'value'
> & {
  label?: string;
  isLoading?: boolean;
  isRequired?: boolean;
  classNameWrap?: string;
  subPlaceholder?: string;
  values?: UploadItem[];

  error?: string;
  layout?: 'horizontal' | 'vertical';
  name?: string;
  onChange: (values?: UploadItem[]) => void;
  setError?: (mess: any) => void;
};

export const UploadMultiple = forwardRef(function UploadMultipleInput(
  props: UploadProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    className,
    classNameWrap,
    layout,
    // isLoading,
    isRequired,
    disabled,
    label,
    error,
    accept = FILE_IMAGE.accepts.join(', '),
    name,
    placeholder,
    values = [],
    subPlaceholder,
    setError,
    onChange,
    ...reset
  } = props;
  const isHaveError = error && error.length > 0;
  const { accepts, size } = FILE_IMAGE;

  const onHandleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files ?? [];
    if (!files || files.length <= 0) return showError('File invalid');

    const newValues: UploadItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;
      const fileSize = file.size;
      const fileId = `${new Date().toISOString()}-${file?.name}`;

      if (!accepts.includes(fileType)) return showError('File not in accepts');
      if (size < fileSize) return showError('File large');
      if (file) {
        const reader = new FileReader();
        await new Promise((resolve: any, reject) => {
          reader.onload = () => {
            newValues.push({
              id: fileId,
              url: reader.result as string,
              file: file
            });
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
    }
    onChange && onChange(newValues);
    resetInputFile();
  };

  const showError = (mess: string) => {
    const messError: any = {};
    messError[`${name}`] = mess;
    setError && setError(messError);
  };

  const onHandleRemove = (value: UploadItem) => {
    const newItem = [...values];
    const indexItemValid = newItem.findIndex((item) => item.id === value.id);
    if (indexItemValid !== -1) {
      newItem.splice(indexItemValid, 1);
    }
    onChange && onChange(newItem);
    resetInputFile();
  };

  const resetInputFile = () => {
    if (!document || !name) return;
    const inputFile = document.getElementById(name) as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
  };

  return (
    <FormGroup
      isShowError={false}
      layout={layout}
      label={label}
      name={name}
      isRequired={isRequired}>
      <label
        htmlFor={name}
        className={clsx(
          'box-border flex flex-col gap-2 w-fit min-w-[304px] items-center border border-dashed transition-all ease-linear hover:border-info cursor-pointer px-4 py-6 rounded-xl',
          {
            '!border-danger': isHaveError,
            'border-gray-100': !isHaveError,
            'cursor-not-allowed !bg-gray-100': disabled
          },
          classNameWrap
        )}>
        <RenderIcon name="image-icon" />
        <p className="text-sm text-dark">{placeholder}</p>
        <p className="text-sm text-text-secondary">{subPlaceholder}</p>

        {/* input file */}
        <input
          ref={ref}
          name={name}
          id={name}
          type="file"
          hidden
          accept={accept}
          onChange={onHandleChangeFile}
          disabled={disabled}
          multiple
          className={clsx(
            'w-full flex-1 border-none text-dark outline-none bg-transparent',
            { 'cursor-not-allowed bg-gray-100': disabled },
            className
          )}
          {...reset}
        />
      </label>
      {isHaveError && (
        <div
          className={clsx('mt-1', {
            'grid grid-cols-12 gap-2': layout === 'horizontal'
          })}>
          <div
            className={clsx({
              hidden: layout === 'vertical',
              'col-span-4': layout === 'horizontal'
            })}
          />
          <div className="col-span-8 w-full text-sm text-danger">{error}</div>
        </div>
      )}

      {values && values.length > 0 && <UploadPreview items={values} onRemove={onHandleRemove} />}
    </FormGroup>
  );
});
