import { TimelineItem } from '../../types/TimelineItem';

type PreviewProps = {
  item: TimelineItem;
  mousePosition: { x: number; y: number };
};

const Preview: React.FC<PreviewProps> = ({ item, mousePosition }) => {
  return (
    <div
      id="preview"
      className="absolute fade-in-1"
      style={{
        top: mousePosition.y,
        left: mousePosition.x,
        transform: "translate(-0%, -100%)", // Center the preview at the mouse position
        zIndex: 9999
      }}
    >
      <img
        src={item.title}
        alt="Thumbnail"
      />
    </div>
  );
};

export default Preview
