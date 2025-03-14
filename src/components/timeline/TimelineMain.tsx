import "./Timeline.css";
import Timeline from "./Timeline";
import UV from "../uv/UV";
import { Maniiifest } from "maniiifest";
import { useState, useEffect, useRef } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import { useQueries } from "@tanstack/react-query";
import FetchTimelineItem from "./FetchTimelineItem";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type TimelineMainProps = {
  collectionUrl: string | null;
  collection: Maniiifest;
  options: Object
};

const TimelineMain: React.FC<TimelineMainProps> = ({
  collectionUrl,
  collection,
  options
}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [manifestIds, setManifestIds] = useState<string[]>([]);
  const [currentManifestId, setCurrentManifestId] = useState<string>("");
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [panelSize, setPanelSize] = useState(25); // Default size

  const bottomPanelRef = useRef<any>(null);
  const topPanelRef = useRef<any>(null);

  const handlePanelResize = (size: number) => {
    setPanelSize(size);
    console.log('heloo?')
    // other resize functions?
  };

  const timelineItemsResult = useQueries({
    queries: manifestIds.map((manifest, index) => ({
      queryKey: ["timeline", collectionUrl, manifest],
      queryFn: () => FetchTimelineItem(manifest, index),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    const timelineItemsSorted = timelineItemsResult.data
      .filter((item): item is TimelineItem => item !== undefined)
      .sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
    setTimelineItems(timelineItemsSorted);
    const manifests = [...collection.iterateCollectionManifest()].map(
      (manifestRef) => manifestRef.id
    );

    setManifestIds(manifests);
    setCurrentManifestId(manifests[0]);
    setIsLoading(false);
    console.log(timelineItemsSorted);
  }, [timelineItemsResult.pending]);

  const handleManifestChange = (manifestId: string) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      {!isLoading ? (
        <ResizablePanelGroup
          direction="vertical"
          className="max-w-full rounded-none"
        >
          <ResizablePanel defaultSize={75} ref={topPanelRef} order={0}>
          <div className="flex h-full items-center justify-center mb-5 pb-4">
                {manifestIds?.length ? (
                  <UV manifestId={currentManifestId} key={currentManifestId} />
                ) : (
                  <div>Loading Viewer...</div>
                )}
            </div>
          </ResizablePanel>

          <ResizableHandle {...({ withHandle: true })} />

          
          <ResizablePanel defaultSize={25} ref={bottomPanelRef} order={1} onResize={(size) => handlePanelResize(size)}
          >
          <div className="flex flex-col h-full w-full">
                {timelineItems?.length ? (
                  <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange} panelSize={panelSize} options={options}/>
                ) : (
                  <div>Loading Timeline...</div>
                )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (


        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TimelineMain;


