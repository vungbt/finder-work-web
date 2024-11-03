/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { AdminGeneralDetailUtils } from '@/@handles/setting';
import { UserRole } from '@/configs/graphql/generated';
import { SettingKeys, SettingTypes, UserRoleOptions } from '@/constants/common';
import { RouterOptions } from '@/constants/router-path';
import useSessionClient from '@/hooks/redux/session/useSession';
import { Button, CodeSnippet, JSONEditor, SelectForm } from '@/libraries/common';
import { CodeSnippetPreview } from '@/libraries/common/code-snippet/preview';
import { iconOptions } from '@/libraries/icons';
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

  const exampleData = JSON.stringify(
    {
      menu: [
        {
          label: 'Favorites',
          items: [
            {
              label: 'Overview',
              href: '/admin',
              isFavorite: true
            }
          ]
        },
        {
          label: 'Pages',
          items: [
            {
              label: 'Setting',
              href: '/admin/setting',
              icon: 'setting',
              child: [
                {
                  label: 'Theme',
                  href: '/admin/setting/theme'
                },
                {
                  label: 'General',
                  href: '/admin/setting/general'
                }
              ]
            }
          ]
        }
      ]
    },
    null,
    2
  );

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

              {/*  submit */}
              <div className="w-full flex items-center justify-end">
                <Button
                  styleType="info"
                  isLoading={loading || loadingDetail}
                  type="submit"
                  label={t('submit')}
                  className="w-fit"
                />
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Example */}
      <div className="mt-2">
        <p className="mb-3 border border-b-dracula border-solid font-medium">
          {t('common.exampleForValue')}:
        </p>

        <div className="flex items-center gap-6 mb-6">
          <Formik initialValues={{ iconPreview: null, hrefPreview: null }} onSubmit={() => {}}>
            {({ values: previewValues }) => {
              const iconPreviewValue = (previewValues?.iconPreview as any)?.value;
              const iconHrefPreview = (previewValues?.hrefPreview as any)?.value;
              return (
                <Form className="w-full flex flex-col gap-3">
                  <div className="flex gap-6 items-center">
                    <Field
                      label={t('common.icon')}
                      name="iconPreview"
                      options={iconOptions}
                      component={SelectForm}
                      placeholder={t('common.icon')}
                    />

                    <Field
                      label={t('common.redirectPath')}
                      name="hrefPreview"
                      options={RouterOptions}
                      component={SelectForm}
                      placeholder={t('common.redirectPath')}
                    />
                  </div>

                  {/* preview */}
                  <div className="grid grid-cols-2 gap-6 items-center w-full">
                    {iconPreviewValue && (
                      <CodeSnippetPreview
                        className="col-span-1 w-full"
                        content={iconPreviewValue}
                      />
                    )}
                    {iconHrefPreview && (
                      <CodeSnippetPreview className="col-span-1 w-full" content={iconHrefPreview} />
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div></div>
        <CodeSnippet codeString={exampleData} />
      </div>
    </>
  );
}
