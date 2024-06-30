import { apiClientServer } from '@/configs/graphql';
import { Setting, UserRole } from '@/configs/graphql/generated';
import { ESettingType } from '@/types';
import { Session } from 'next-auth';

const defaultMenus = [
  {
    label: 'Dashboards',
    items: [{ label: 'Overview', href: '/admin', icon: 'graph' }]
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
          }
        ]
      }
    ]
  }
];
export const getPortalLayoutSetting = async (isInit?: boolean) => {
  const apiClient = await apiClientServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (apiClient as any).session as Session;
  const res = await apiClient.allSettingPortal({
    where: { key: { contains: session.userRole } },
    isInit
  });
  const result = res?.setting_portal?.data ?? [];
  const menus =
    getValueBy(ESettingType.Menu, result as Setting[], session.userRole) ?? defaultMenus;
  const footers = getValueBy(ESettingType.Footer, result as Setting[], session.userRole);
  const headers = getValueBy(ESettingType.Header, result as Setting[], session.userRole);
  return {
    menus,
    footers,
    headers
  };
};

const getValueBy = (type: ESettingType, data: Setting[], role?: UserRole) => {
  const valueTemp = data.find((item) => item.type === type && item.key === role)?.value;
  if (!valueTemp) return null;
  return JSON.parse(valueTemp)[`${type}`];
};
