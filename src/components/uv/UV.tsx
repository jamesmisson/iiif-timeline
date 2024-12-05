import "./uv.css";
import config from "../../config"

type UVProps = {
    manifestUrl: string,
  };

const UV: React.FC<UVProps> = ({ manifestUrl }) => {

    return (
        <iframe
            id="uv"
            src={config.uvUrl + manifestUrl}
        >
        </iframe>

    )
  }
  
  export default UV