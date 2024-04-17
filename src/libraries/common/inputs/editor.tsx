/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import dynamic from 'next/dynamic';
import { forwardRef, Ref, useMemo } from 'react';
import { ReactQuillType } from '../../../configs/quill';
import { FormGroup } from '../form';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('../../../configs/quill');
    // eslint-disable-next-line react/display-name
    return ({ ...props }: any) => <RQ {...props} />;
  },
  {
    ssr: false
  }
);

type EditorProps = {
  field?: FieldInputProps<never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: FormikProps<any>;
  label?: string;
  layout?: 'horizontal' | 'vertical';
  isRequired?: boolean;
  disabled?: boolean;
  onChange: (content: string) => void;

  expandOnFocus?: boolean;
  placeholder?: string;
  showLimit?: number;
};

export const EditorForm = forwardRef(function QuillEditor(
  props: EditorProps,
  ref: Ref<ReactQuillType>
) {
  // const editorRef = useRef<any>(null);
  const { field, form, label, layout, isRequired, disabled = false, onChange, ...reset } = props;
  const name = field?.name;
  const fieldValue = cloneDeep(field?.value);
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const imageHandler = () => {};
  const videoHandler = () => {};

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'video', 'link']
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler
        }
      }
    }),
    []
  );

  const formats = ['bold', 'italic', 'underline', 'align', 'list', 'image', 'video', 'link'];

  const onChangeContent = (text: string) => {
    const value = text === '<p><br></p>' ? '' : text;
    setValueForFormField(value);
    setTouchForFormField(value);
    onChange && onChange(value);
  };

  const onHandleBlur = () => {
    setTouchForFormField(fieldValue);
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
    field.onBlur(name);
  };

  const setTouchForFormField = (value: any) => {
    const newTouched: any = { ...form?.touched };
    if (!value || value.length <= 0) {
      newTouched[`${name}`] = true;
    } else {
      newTouched[`${name}`] = false;
    }
    form?.setTouched({ ...form.touched, ...newTouched });
  };

  return (
    <FormGroup layout={layout} label={label} name={name} isRequired={isRequired}>
      <label
        htmlFor={name}
        className={clsx(
          'custom-quill box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info rounded-3xl',
          {
            // 'min-h-10 gap-3 rounded-3xl px-4 text-base': size === 'large',
            // 'min-h-8 gap-2 rounded-2xl px-4 text-sm': size === 'middle',
            // 'min-h-6 gap-1 rounded-xl px-2 text-sm': size === 'small',

            '!border-danger custom-quill-error': isHaveError,
            'border-gray-100': !isHaveError
            // 'cursor-not-allowed !bg-gray-100': disabled
          }
        )}>
        <ReactQuill
          readOnly={disabled}
          ref={ref}
          modules={modules}
          formats={formats}
          value={field?.value}
          onChange={onChangeContent}
          onBlur={() => onHandleBlur()}
          {...reset}
        />
      </label>
    </FormGroup>
  );
});
