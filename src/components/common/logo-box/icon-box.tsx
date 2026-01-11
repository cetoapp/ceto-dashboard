import { IconAvatar } from "../icon-avatar";
import { LogoIcon } from "./logo-icon";

type IconBoxProps = {
  size?: "small" | "xlarge" | "large"
}

export default function IconBox({ size }: IconBoxProps) {
  return (
    <IconAvatar
      size={size || "small"}
      className="bg-ui-button-neutral shadow-buttons-neutral size-7 after:button-neutral-gradient relative flex items-center justify-center rounded-[6px] after:inset-0 after:content-['']"
    >
      <LogoIcon className="rounded-[6px] max-w-full h-auto" />
    </IconAvatar>
  );
}
