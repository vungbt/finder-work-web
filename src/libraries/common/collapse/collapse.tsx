'use client';

import { CollapseSection, IconButton } from '@/libraries/common';

export type WorkExperienceSectionProps = {
  index: number;
  remove: (index: number) => void;
  children: React.ReactNode;
  header: string;
};

export const Collapse: React.FC<WorkExperienceSectionProps> = ({
  index,
  remove,
  children,
  header
}) => {
  return (
    <CollapseSection
      header={`${header} ${index + 1}`}
      renderHeader={(isExpand, onToggle) => (
        <div onClick={onToggle} className="flex flex-1 items-center gap-2">
          {isExpand ? (
            <IconButton type="button" iconName="chevron-up" />
          ) : (
            <IconButton type="button" iconName="chevron-down" />
          )}
          <IconButton
            className="!w-5 !h-5 text-danger-200"
            type="button"
            iconName="trash-solid"
            onClick={() => remove(index)}
          />
        </div>
      )}
      initialValue={true}
      expandable
    >
      <div className="mt-2">{children}</div>
    </CollapseSection>
  );
};
