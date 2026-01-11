import { IconAvatar } from "../icon-avatar";
import { LogoIcon } from "./logo-icon";

type AvatarBoxProps = {
  checked?: boolean;
  size?: "small" | "xlarge" | "large";
};

export default function AvatarBox({ checked, size }: AvatarBoxProps) {
  return (
    <IconAvatar
      size={size || "xlarge"}
      className="bg-ui-button-neutral shadow-buttons-neutral after:button-neutral-gradient relative mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-xl after:inset-0 after:content-['']"
    >
      {checked && <LogoIcon className="rounded-xl max-w-full h-auto" />}

      <LogoIcon className="rounded-xl max-w-full h-auto" />
    </IconAvatar>
  );
}
