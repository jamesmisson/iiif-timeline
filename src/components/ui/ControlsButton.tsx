import React from "react";

interface ControlsButtonProps {
  // eslint-disable-next-line no-unused-vars
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const ControlsButton: React.FC<ControlsButtonProps> = ({
  onClick,
  label,
  disabled = false,
  children,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(event);
  };

  return (
    <div className="relative inline-block h-[30px]">

<button
  type="button"
  aria-label={label}
  disabled={disabled}
  onClick={handleClick}
  className={`controls-button group w-[30px] h-[30px] p-0 inline-flex items-center justify-center border-none bg-transparent z-[1000] transition-colors duration-120 ease-in-out
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

export default ControlsButton;
