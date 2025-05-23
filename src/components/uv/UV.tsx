import config from "../../config";
import { useEffect, useState } from "react";

type UVProps = {
  manifestId: string;
};

const UV: React.FC<UVProps> = ({ manifestId }) => {
  const [iframeSrc, setIframeSrc] = useState<string>(manifestId);

  useEffect(() => {
    const newIframe = config.uvUrl + manifestId;
    setIframeSrc(newIframe);
    console.log(newIframe);
  }, [manifestId]);

  return (
    <div id="uvContainer" className="flex flex-col flex-1 h-full w-full z-10000">
      <iframe id="uv" src={iframeSrc}
      className="flex flex-col flex-1 h-full w-full"
      ></iframe>
    </div>
  );
};

export default UV;
