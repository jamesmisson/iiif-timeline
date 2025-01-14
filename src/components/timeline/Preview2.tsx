import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimelineItem } from '../../types/TimelineItem';


type PreviewProps = {
  item: TimelineItem;
  position: number;
};

const Preview = ({ item, position }: PreviewProps) => {
  return (
    <Card className={`flex flex-row max-w-2xl overflow-hidden bottom-${position}`}>
      {/* Thumbnail container with fixed width */}
      <div className="flex-none w-36 relative">
        <img
          src={item.title}
          alt={`Cover of ${item.content}`}
          className="object-cover w-full h-full"
        ></img>
      </div>

      {/* Content container that fills remaining space */}
      <div className="flex-1 min-w-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl line-clamp-2">{item.content}</CardTitle>
          <CardDescription className="text-sm">
          {item.start}
          </CardDescription>
        </CardHeader>

        {/* {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          </CardContent>
        )} */}

      </div>
    </Card>
  );
};

export default Preview;
