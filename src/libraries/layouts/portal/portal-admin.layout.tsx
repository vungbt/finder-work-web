'use client';
import { InputForm } from '@/libraries/common';
import Image from 'next/image';
import { ReactNode } from 'react';

export function PortalAdminLayout(props: { children: ReactNode }) {
  return (
    <div className="flex items-start h-screen bg-white">
      {/* sidebar */}
      <div className="w-[212px] p-4">
        {/* avatar */}
        <div>
          <Image
            src="https://res.cloudinary.com/dgxciqlts/image/upload/v1709873667/assets/avatar-1_r0wv7q.webp"
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div className="mt-10">Sidebar</div>
      </div>
      <div className="border border-solid flex-1 h-full">
        {/* header */}
        <div className="flex items-center justify-between bg-white">
          <span>Dashboard</span>

          <InputForm className="bg-gray-100" iconLeft="search" />
        </div>
        {props.children}
      </div>
    </div>
  );
}
