/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastError } from '@/configs/toast';
import { FILE_IMAGE, FILE_VIDEO } from '@/constants/common';
import { LoadingCenter, LoadingOverlay } from '@/libraries/loading';
import { upload } from '@/utils/upload';
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { forwardRef, Ref, useMemo, useRef, useState } from 'react';
import { ReactQuillType } from '../../../configs/quill';
import { FormGroup } from '../form';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('../../../configs/quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => <LoadingCenter />
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
  imageAccept?: string;
  videoAccept?: string;
  imageMaxSize?: number;
  videoMaxSize?: number;
  onChange: (content: string) => void;
  onChangeFile?: (type: 'image' | 'video', file: File) => void;
  setError?: (mess: any) => void;

  expandOnFocus?: boolean;
  placeholder?: string;
  showLimit?: number;
};

export const EditorForm = forwardRef(function QuillEditor(
  props: EditorProps,
  ref: Ref<ReactQuillType>
) {
  const t = useTranslations();
  const {
    field,
    form,
    label,
    layout,
    isRequired,
    disabled = false,
    setError,
    imageAccept = FILE_IMAGE.accepts.join(', '),
    imageMaxSize = FILE_IMAGE.size,
    videoAccept = FILE_VIDEO.accepts.join(', '),
    videoMaxSize = FILE_VIDEO.size,
    onChange,
    onChangeFile,
    ...reset
  } = props;
  const name = field?.name;
  const fieldValue = cloneDeep(field?.value);
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const editorRef = useRef<ReactQuillType | null>(null);

  const quillRef = (quillEditor: ReactQuillType | null, currentRef: any, refCustom?: any) => {
    if (quillEditor) {
      if (currentRef) {
        currentRef.current = quillEditor;
      }
      if (refCustom) {
        (refCustom as React.MutableRefObject<ReactQuillType | null>).current = editorRef.current;
      }
    }
  };

  const imageHandler = () => {
    const input: any = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', imageAccept);
    input.click();

    input.onchange = async () => {
      const files: FileList | never[] = input?.files;
      if (!files || files.length <= 0) return showError('validation.fileInvalid');

      const file = files[0];
      const fileType = file.type;
      const fileSize = file.size;
      const acceptsList = imageAccept.split(',').map((item) => item.trim());
      if (!acceptsList.includes(fileType))
        return showError(t('validation.fileNotInAccepts', { types: imageAccept }));
      if (imageMaxSize < fileSize)
        return showError(t('validation.fileLarge', { max: imageMaxSize }));

      if (file) {
        if (onChangeFile) {
          const reader = new FileReader();
          reader.onload = () => {
            onChangeFile('image', file);
          };
          reader.readAsDataURL(file);
        } else {
          uploadFileToServer('image', file);
        }
      }
    };
  };
  const videoHandler = () => {
    const input: any = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', videoAccept);
    input.click();

    input.onchange = async () => {
      const files: FileList | never[] = input?.files;
      if (!files || files.length <= 0) return showError('validation.fileInvalid');

      const file = files[0];
      const fileType = file.type;
      const fileSize = file.size;
      const acceptsList = videoAccept.split(',').map((item) => item.trim());
      if (!acceptsList.includes(fileType))
        return showError(t('validation.fileNotInAccepts', { types: videoAccept }));
      if (videoMaxSize < fileSize)
        return showError(t('validation.fileLarge', { max: videoMaxSize }));

      if (file) {
        if (onChangeFile) {
          const reader = new FileReader();
          reader.onload = () => {
            onChangeFile('video', file);
          };
          reader.readAsDataURL(file);
        } else {
          uploadFileToServer('image', file);
        }
      }
    };
  };

  const uploadFileToServer = async (type: 'image' | 'video', file: File) => {
    try {
      setLoadingUpload(true);
      const formData = upload.imgFormData(file);
      const quillEditor = editorRef.current as any;
      if (quillEditor) {
        const cursorPosition = quillEditor?.selection?.index ?? 0;
        const res = await upload.uploadFile(file.name, formData);
        if (res.data) {
          quillEditor?.getEditor()?.insertEmbed(cursorPosition, type, res.data.url);
        }
      }
      setLoadingUpload(false);
    } catch (error: any) {
      setLoadingUpload(false);
      toastError(error?.message);
    }
    // try {
    //   setLoadingUpload(true);
    //   const url = await uploadFile(
    //     file,
    //     type === 'image'
    //       ? BucketFolder.ADMIN_CAREER_POST_IMAGES
    //       : BucketFolder.ADMIN_CAREER_POST_VIDEOS,
    //     bucketFolderKey
    //   );
    //   setLoadingUpload(false);
    //   const cursorPosition = editorRef.current?.selection?.index ?? 0;
    //   if (url) {
    //     editorRef.current.getEditor().insertEmbed(cursorPosition, type, getFileUrl(url));
    //   }
    // } catch (error: any) {
    //   setLoadingUpload(false);
    //   notify.error(error?.message);
    // }
  };

  const showError = (mess: string) => {
    const messError: any = {};
    messError[`${name}`] = mess;
    setError && setError(messError);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          'custom-quill box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info rounded-3xl relative',
          {
            // 'min-h-10 gap-3 rounded-3xl px-4 text-base': size === 'large',
            // 'min-h-8 gap-2 rounded-2xl px-4 text-sm': size === 'middle',
            // 'min-h-6 gap-1 rounded-xl px-2 text-sm': size === 'small',

            '!border-danger custom-quill-error': isHaveError,
            'border-gray-100': !isHaveError
            // 'cursor-not-allowed !bg-gray-100': disabled
          }
        )}
      >
        <ReactQuill
          readOnly={disabled}
          forwardedRef={(quill: ReactQuillType | null) => quillRef(quill, editorRef, ref)}
          modules={modules}
          formats={formats}
          value={field?.value}
          onChange={onChangeContent}
          onBlur={() => onHandleBlur()}
          {...reset}
        />
        {loadingUpload && <LoadingOverlay />}
      </label>
    </FormGroup>
  );
});
