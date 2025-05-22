import React, { useState } from "react";

interface FooterButtonProps {
  // eslint-disable-next-line no-unused-vars
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const FooterButton: React.FC<FooterButtonProps> = ({
  onClick,
  title,
  label,
  disabled = false,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTooltip(false);
    onClick(event);
  };

  return (
    <div className="relative inline-block h-[30px]">
      {/* Tooltip positioned above the button */}
      {title && (
        <div
          role="tooltip"
          className={`absolute left-1/2 bottom-[38px] transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white px-2 py-1 text-sm rounded-none z-[9999] pointer-events-none transition-all duration-200 ease-in-out
            ${showTooltip ? "opacity-100 translate-y-0 visible delay-300" : "opacity-0 translate-y-1 invisible delay-0"}`}
        >
          {title}
          <div className="absolute w-2 h-2 bg-gray-800 rotate-45 bottom-[-4px] left-1/2 -ml-1 transition-all" />
        </div>
      )}

<button
  type="button"
  aria-label={label}
  disabled={disabled}
  onClick={handleClick}
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
  onFocus={() => setShowTooltip(true)}
  onBlur={() => setShowTooltip(false)}
  className={`footer-button group w-[30px] h-[30px] p-0 inline-flex items-center justify-center border-none bg-transparent z-[1000] transition-colors duration-120 ease-in-out
    ${disabled ? "cursor-default opacity-60 hover:bg-transparent" : "cursor-pointer hover:bg-gray-700"}`}
>
  <div
    className={`w-full h-full transition-colors duration-120 ease-in-out
      ${disabled ? "opacity-20 text-white" : "text-white group-hover:text-cyan-300"}`}
  >
    {children}
  </div>
</button>

    </div>
  );
};

export default FooterButton;
