import "./Preview.css";
import { TimelineItem } from '../../types/TimelineItem';

type PreviewProps = {
    item: TimelineItem
  };

const Preview: React.FC<PreviewProps> = ({ item }) => {
  return (
    <div id="preview" className="card">
        <img src={item.title} alt="Thumbnail" className="thumbnail"></img>
        <ul>
            <li>{item.content}</li>
            <li>{item.start}</li>
        </ul>
    </div>
  )
}

export default Preview
