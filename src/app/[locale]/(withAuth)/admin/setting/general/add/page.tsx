'use client';
import { AdminGeneralDetailUtils } from '@/@handles/setting';
import { UserRole } from '@/configs/graphql/generated';
import { SettingKeys, SettingTypes, UserRoleOptions } from '@/constants/common';
import useSessionClient from '@/hooks/redux/session/useSession';
import { Button, SelectForm, JSONEditor } from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';

export default function GeneralDetailPage() {
  const { session } = useSessionClient();
  const { loading, loadingDetail, form, onSubmitSetting } = AdminGeneralDetailUtils();
  const t = useTranslations();

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      key: Yup.object().shape({
        value: Yup.string().required(
          t('validation.required', { label: t('form.settingKey').toLowerCase() })
        ),
        label: Yup.string().required(
          t('validation.required', { label: t('form.settingKey').toLowerCase() })
        )
      }),
      type: Yup.object().shape({
        value: Yup.string().required(
          t('validation.required', { label: t('form.settingKey').toLowerCase() })
        ),
        label: Yup.string().required(
          t('validation.required', { label: t('form.settingKey').toLowerCase() })
        )
      }),
      value: Yup.string().required(
        t('validation.required', { label: t('form.settingValue').toLowerCase() })
      ),
      showWith: Yup.array(
        Yup.object().shape({
          value: Yup.string().required(
            t('validation.required', { label: t('form.showWith').toLowerCase() })
          ),
          label: Yup.string().required(
            t('validation.required', { label: t('form.showWith').toLowerCase() })
          )
        })
      ).min(1, t('validation.required', { label: t('form.showWith').toLowerCase() }))
    };
    if (session && session.userRole === UserRole.SuperAdmin) {
      delete schema?.showWith;
    }
    return Yup.object(schema);
  }, [session, t]);

  const typeOptions = useMemo(
    () => SettingTypes.map((item) => ({ ...item, label: t(`${item.label}`) })),
    [t]
  );
  const showWithOptions = useMemo(
    () => UserRoleOptions.map((item) => ({ ...item, label: t(`${item.label}`) })),
    [t]
  );
  const keyOptions = useMemo(
    () => SettingKeys.map((item) => ({ ...item, label: t(`${item.label}`) })),
    [t]
  );

  const initialValues = {
    showWith: [],
    key: keyOptions[0],
    type: typeOptions[0],
    value: ''
  };

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        innerRef={form}
        onSubmit={onSubmitSetting}
      >
        {() => {
          return (
            <Form className="flex flex-col gap-6">
              <div className="grid grid-cols-12 items-start gap-6">
                <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
                  <Field
                    label={t('form.showWith')}
                    isRequired={session && session.userRole !== UserRole.SuperAdmin}
                    name="showWith"
                    options={showWithOptions}
                    component={SelectForm}
                    isMulti={true}
                    placeholder={t('form.showWith')}
                    loading={loading || loadingDetail}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
                  <Field
                    label={t('form.settingKey')}
                    isRequired
                    name="key"
                    options={keyOptions}
                    component={SelectForm}
                    placeholder={t('form.settingKey')}
                    loading={loading || loadingDetail}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
                  <Field
                    label={t('form.settingType')}
                    isRequired
                    name="type"
                    options={typeOptions}
                    component={SelectForm}
                    placeholder={t('form.settingType')}
                    loading={loading || loadingDetail}
                  />
                </div>
              </div>
              <Field
                label={t('form.settingValue')}
                isRequired
                name="value"
                component={JSONEditor}
                isLoading={loading || loadingDetail}
              />
              <div className="w-full flex items-center justify-end">
                <Button
                  styleType="info"
                  isLoading={loading || loadingDetail}
                  type="submit"
                  label={t('common.submit')}
                  className="w-fit"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
