'use client';
import React, { useState } from 'react';

type CollapseSectionProps = {
  renderHeader: (
    isExpand: boolean,
    onToggle: (e: React.MouseEvent<HTMLDivElement>) => void
  ) => React.ReactElement;
  children: React.ReactNode;
  initialValue?: boolean;
  maxHeight?: string;
  expandable?: boolean;
  header: string;
};

export const CollapseSection: React.FC<CollapseSectionProps> = ({
  renderHeader,
  children,
  initialValue = true,
  maxHeight = '100%',
  expandable = true,
  header
}) => {
  const [isExpand, setIsExpand] = useState(initialValue);

  const onToggleOption = (e: React.MouseEvent<HTMLDivElement>) => {
    if (expandable) {
      e.stopPropagation();
      e.preventDefault();
      setIsExpand(!isExpand);
    }
  };

  return (
    <div className="border-avocado-hover p-4 rounded-lg shadow-sm mt-5">
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggleOption}>
        <div className="text-lg font-medium text-gray-700">{header}</div>
        <div className="items-end"> {renderHeader(isExpand, onToggleOption)}</div>
      </div>
      {expandable && (
        <div
          className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
            isExpand ? 'max-h-full' : 'max-h-0'
          }`}
          style={{
            maxHeight: isExpand ? maxHeight : '0'
          }}
        >
          <div className="mt-2">{children}</div>
        </div>
      )}
    </div>
  );
};
