import { IconName, RenderIcon } from '@/libraries/icons';

type TagProps = {
  content: string;
  color?: string;
  closeIcon?: IconName;
  icon?: IconName;
  onClose?: () => void;
};
export function Tag({ content, color, closeIcon, icon, onClose }: TagProps) {
  return (
    <span>
      {content}
      {(closeIcon || icon) && <RenderIcon name={closeIcon ?? icon} />}
    </span>
  );
}
