import { clx } from "@medusajs/ui";
import { Transition } from "motion/react";
import CetoLogo from "../../../assets/images/avatar.svg";

type LogoBoxProps = {
  className?: string;
  checked?: boolean;
  containerTransition?: Transition;
  pathTransition?: Transition;
};

export const LogoBox = ({
  className,
  checked,
  containerTransition = {
    duration: 0.8,
    delay: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  },
  pathTransition = {
    duration: 0.8,
    delay: 0.6,
    ease: [0.1, 0.8, 0.2, 1.01],
  },
}: LogoBoxProps) => {
  return (
    <div
      className={clx(
        "size-14 bg-ui-button-neutral shadow-buttons-neutral relative flex items-center justify-center rounded-xl",
        "after:button-neutral-gradient after:inset-0 after:content-['']",
        className
      )}
    >
      {checked && (
        <img
          src={CetoLogo}
          alt="Ceto logo"
          className="rounded-[10px] w-[240px] h-auto"
        />
      )}
      <img
        src={CetoLogo}
        alt="Ceto logo"
        className="rounded-[10px] w-[240px] h-auto"
      />
    </div>
  );
};
