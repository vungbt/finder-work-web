'use client';
import { FallbackImage } from '@/constants/common';
import useProfile from '@/hooks/redux/profile/useProfile';
import { IconButton, InputForm } from '@/libraries/common';
import ThemeSwitcher from '@/libraries/theme-switcher';
import Image from 'next/image';
import { ReactNode, useRef, useState } from 'react';
import { SideBar, SidebarMenu } from './sidebar';
import clsx from 'clsx';

export function PortalAdminLayout(props: { children: ReactNode }) {
  const { profile } = useProfile();
  const inputSidebar = useRef<HTMLInputElement>(null);
  const [collapsedActive, setCollapsedActive] = useState<{
    sidebar: boolean;
    notification: boolean;
  }>({ sidebar: false, notification: false });

  const menus: SidebarMenu[] = [
    {
      label: 'Favorites',
      items: [
        { label: 'Overview', href: '/admin', isFavorite: true },
        { label: 'Projects', href: '/admin/project', isFavorite: true }
      ]
    },
    {
      label: 'Dashboards',
      items: [
        { label: 'Overview', href: '/admin', icon: 'graph' },
        { label: 'Users', href: '/admin/users', icon: 'profile-2user' },
        { label: 'Jobs', href: '/admin/jobs', icon: 'document-normal' },
        { label: 'Report request', href: '/admin/reports', icon: 'document-forward' }
      ]
    },
    {
      label: 'Pages',
      items: [
        { label: 'Working skills', href: '/admin/skills', icon: 'flash' },
        { label: 'Career portal', href: '/admin/careers', icon: 'briefcase' },
        { label: 'Payment history', href: '/admin/payment-history', icon: 'receipt-search' },
        {
          label: 'Subscription',
          href: '/admin/subscription',
          icon: 'dollar-circle',
          child: [
            {
              label: 'Coupons',
              href: '/admin/subscription/coupons'
            },
            {
              label: 'Top company',
              href: '/admin/subscription/top-company-hiring'
            }
          ]
        },
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

  const onHandleCollapsed = (type: 'sidebar' | 'notification') => {
    const newCollapsedActive = { ...collapsedActive };
    newCollapsedActive[type] = !newCollapsedActive[type];
    setCollapsedActive(newCollapsedActive);
  };

  const onShowSidebar = () => {
    if (inputSidebar && inputSidebar.current) {
      inputSidebar.current.checked = true;
    }
  };

  console.log('newCollapsedActive=====>', collapsedActive);
  return (
    <div className="flex items-start h-screen bg-white">
      {/* input trigger sidebar */}
      <input hidden ref={inputSidebar} type="checkbox" id="admin-sidebar" />

      {/* sidebar */}
      <label
        htmlFor="admin-sidebar"
        className={clsx(
          'admin-sidebar w-[212px] p-4 border-r border-solid border-black border-opacity-15 h-full max-h-screen overflow-y-auto'
        )}>
        {/* avatar */}
        <div className="flex items-center gap-2 p-2">
          <Image
            src={profile.avatarUrl ?? FallbackImage.avatarUrl}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{profile.fullName}</span>
        </div>

        {/* sidebar */}
        <SideBar menus={menus} />
      </label>

      {/* content */}
      <div className="flex-1 h-full">
        {/* header */}
        <div className="flex items-center justify-between bg-white px-7 py-5 border-b border-solid border-black border-opacity-15">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={onShowSidebar}
              iconName="sidebar-right"
              className="relative lg:hidden"
            />
            <IconButton iconName="star" />

            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-black opacity-45">Dashboards</span>
              <span className="text-black opacity-45">/</span>
              <span>Default</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <InputForm
              size="middle"
              classNameWrap="bg-gray-100 max-w-[160px]"
              placeholder="Search"
              iconLeft="search"
            />
            <ThemeSwitcher />
            <IconButton iconName="history" />
            <IconButton iconName="notification" />
            <IconButton
              iconName="sidebar-right"
              onClick={() => onHandleCollapsed('notification')}
            />
          </div>
        </div>
        {props.children}
      </div>

      {/* overlay */}
      <label htmlFor="admin-sidebar" className="admin-sidebar-overlay"></label>
    </div>
  );
}
