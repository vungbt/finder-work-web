/* eslint-disable @typescript-eslint/no-explicit-any */
import RCTooltip from 'rc-tooltip';
import { ReactNode } from 'react';
import 'rc-tooltip/assets/bootstrap.css';

type TooltipProps = {
  title: ReactNode | (() => React.ReactNode);
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  children: any;
  trigger?: ('hover' | 'click' | 'focus')[];
};

export const Tooltip = ({
  title,
  placement = 'top',
  children,
  trigger = ['hover']
}: TooltipProps) => {
  return (
    <RCTooltip overlay={title} placement={placement} trigger={trigger}>
      {children}
    </RCTooltip>
  );
};

Tooltip.displayName = 'TooltipWithRef';
