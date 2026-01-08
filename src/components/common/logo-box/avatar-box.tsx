import { IconAvatar } from "../icon-avatar";
import CetoLogo from "../../../assets/images/white-logo.svg";

export default function AvatarBox({ checked }: { checked?: boolean }) {
  return (
    <IconAvatar
      size="xlarge"
      className="bg-ui-button-neutral shadow-buttons-neutral after:button-neutral-gradient relative mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-xl after:inset-0 after:content-['']"
    >
      {checked && (
        <img
          src={CetoLogo}
          alt="Ceto logo"
          className="rounded-xl max-w-full h-auto"
        />
      )}

      <img
        src={CetoLogo}
        className="rounded-xl max-w-full h-auto"
      />
    </IconAvatar>
  );
}
