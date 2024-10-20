'use client';
import { FallbackImage } from '@/constants/common';
import useProfile from '@/hooks/redux/profile/useProfile';
import { IconButton, InputForm } from '@/libraries/common';
import ThemeSwitcher from '@/libraries/theme-switcher';
import Image from 'next/image';
import { ReactNode, useRef, useState } from 'react';
import { SideBar, SidebarMenu } from './sidebar';
import clsx from 'clsx';
import { getFullName } from '@/utils/helpers/common';

export function PortalAdminLayout(props: { children: ReactNode; menus?: SidebarMenu[] }) {
  const { profile } = useProfile();
  const inputSidebar = useRef<HTMLInputElement>(null);
  const [collapsedActive, setCollapsedActive] = useState<{
    sidebar: boolean;
    notification: boolean;
  }>({ sidebar: false, notification: false });

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

  return (
    <div className="flex items-start h-screen bg-white">
      {/* input trigger sidebar */}
      <input hidden ref={inputSidebar} type="checkbox" id="admin-sidebar" />

      {/* sidebar */}
      <label
        htmlFor="admin-sidebar"
        className={clsx(
          'admin-sidebar min-w-[212px] w-[212px] p-4 border-r border-solid border-black border-opacity-15 h-full max-h-screen overflow-y-auto'
        )}
      >
        {/* avatar */}
        <div className="flex items-center gap-2 p-2">
          <Image
            src={profile.avatarUrl ?? FallbackImage.avatarUrl}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{getFullName(profile)}</span>
        </div>

        {/* sidebar */}
        <SideBar menus={props.menus ?? []} />
      </label>

      {/* content */}
      <div className="admin-content flex-1 h-full">
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
        <div className="p-7 portal-content-layout" id="scrollableTarget">
          {props.children}
        </div>
      </div>

      {/* overlay */}
      <label htmlFor="admin-sidebar" className="admin-sidebar-overlay"></label>
    </div>
  );
}
