import "./Preview.css";
import { TimelineItem } from '../../types/TimelineItem';

type PreviewProps = {
    item: TimelineItem,
    position: number
  };

const Preview: React.FC<PreviewProps> = ({ item, position }) => {

  console.log("Preview position:", position);

  return (
    <div id="preview" className="card" style={{bottom: `${position}px`}}>
        <img src={item.title} alt="Thumbnail" className="thumbnail"></img>
        <ul>
            <li>{item.content}</li>
            <li>{item.start}</li>
            <li>Other metadata drawn from manifest</li>
        </ul>
    </div>
  )
}

export default Preview
