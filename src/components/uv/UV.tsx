"use client";

import config from "../../config";
import { useEffect, useState } from "react";

type UVProps = {
  overlayHeight: number;
  setOverlayHeight: (height: number) => void;
  manifestId: string;
};

const UV: React.FC<UVProps> = ({ overlayHeight, setOverlayHeight, manifestId }) => {
  const [iframeSrc, setIframeSrc] = useState<string>(manifestId);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newHeight = Math.min(
          Math.max(e.clientY, 50),
          window.innerHeight - 50
        ); // clamp height
        setOverlayHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const newIframe = config.uvUrl + manifestId;
    setIframeSrc(newIframe);
    console.log(newIframe);
  }, [manifestId]);

  return (
    <>
      {/* this layer appears when resizing panels to make sure the click isn't captured by the iframe. might need to move it one layer above to cover timeline too  */}
      {isDragging && (
        <div className="fixed top-0 left-0 w-full h-full z-50 cursor-row-resize" />
      )}
      <div
        id="uvContainer"
        className="absolute top-0 left-0 w-full bg-blue-300 z-10"
        style={{ height: `${overlayHeight}px` }}
      >
        <iframe
          id="uv"
          src={iframeSrc}
          className="flex flex-col flex-1 h-full w-full"
        ></iframe>
        <div
          className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize bg-blue-600"
          onMouseDown={() => setIsDragging(true)}
        />
      </div>
    </>
  );
};

export default UV;
