import "./uv.css";
import config from "../../config"
import { useEffect, useState } from "react";

type UVProps = {
    manifestId: string,
  };

const UV: React.FC<UVProps> = ({ manifestId }) => {
  const [iframeSrc, setIframeSrc] = useState<string>(manifestId)

  useEffect(() => {
    const newIframe = config.uvUrl + manifestId
    setIframeSrc(newIframe);
    console.log(newIframe)
  }, [manifestId]);

    return (
      <div id="uvContainer">
        <iframe
            id="uv"
            src={iframeSrc}
        >
        </iframe>
      </div>
    )
  }
  
  export default UV