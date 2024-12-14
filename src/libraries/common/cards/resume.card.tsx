import { Resume } from '@/configs/graphql/generated';
import { RenderIcon } from '@/libraries/icons';
import { getAvatar } from '@/utils/helpers/common';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers/formatter';

type ResumeCardProps = {
  item: Resume;
};

export function ResumeCard({ item }: ResumeCardProps) {
  return (
    <div className=" flex flex-1 h-full w-full p-4   gap-3 relative z-[1] rounded-2xl shadow-md bg-gray-200">
      <div>
        <Image
          width={120}
          height={120}
          alt="resume-card"
          src={item.thumbnail?.url || getAvatar()}
          className="rounded-s"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-gray-500 my-3"> Created at: {formatDate(item.createdAt)}</p>
        <div className="flex flex-1 gap-5">
          <RenderIcon name="trash-solid" className="!w-7 !h-7 text-danger-200" />
          <RenderIcon name="eye" className="!w-7 !h-7 text-info" />
          <RenderIcon name="download-document" className="!w-7 !h-7 text-info" />
        </div>
      </div>
    </div>
  );
}
