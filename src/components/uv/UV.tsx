import "./uv.css";
import config from "../../config"

type UVProps = {
    manifestUrl: string,
  };

const UV: React.FC<UVProps> = ({ manifestUrl }) => {

    return (
      <div id="uvContainer">
        <iframe
            id="uv"
            src={config.uvUrl + manifestUrl}
        >
        </iframe>
      </div>
    )
  }
  
  export default UV