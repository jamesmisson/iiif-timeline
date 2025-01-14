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
  minimized: boolean;
};

const TimelineMain: React.FC<TimelineMainProps> = ({
  collectionUrl,
  collection,
  minimized,
}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const [manifestIds, setManifestIds] = useState<string[]>([]);
  const [currentManifestId, setCurrentManifestId] = useState<string>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const bottomPanelRef = useRef(null);
  const topPanelRef = useRef(null);

  const handleResize = (size) => {
    if (bottomPanelRef.current) {
      bottomPanelRef.current.resize(size); // Call the resize method
    }
    if (topPanelRef.current) {
      topPanelRef.current.resize(100 - size); // Call the resize method
    }
  };

  useEffect(() => {
    if (minimized) {
    handleResize(7)
    } else {
      handleResize(25)
    }
  }, [minimized])

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

  const handleManifestChange = (manifestId) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      {!isLoading ? (
        <ResizablePanelGroup
          direction="vertical"
          className="max-w-full rounded-none"
        >
          <ResizablePanel defaultSize={75} ref={topPanelRef}>
          <div className="flex h-full items-center justify-center mb-2">
                {manifestIds?.length ? (
                  <UV manifestId={currentManifestId} key={currentManifestId} />
                ) : (
                  <div>Loading Viewer...</div>
                )}
            </div>
          </ResizablePanel>

          <ResizableHandle {...(!minimized && { withHandle: true })} />

          
          <ResizablePanel defaultSize={25} ref={bottomPanelRef}>
          <div className="flex flex-col h-full w-full">
                {timelineItems?.length ? (
                  <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange} minimized={minimized}/>
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


