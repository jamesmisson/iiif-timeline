import "./Timeline.css";
import Timeline from "./Timeline";
import UV from "../uv/UV";
import { Maniiifest } from "maniiifest";
import { useState, useEffect, useRef } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import { useQueries } from "@tanstack/react-query";
import FetchTimelineItem from "./FetchTimelineItem";

import WesternTypographicFirsts from '../../examples/typographicfirsts';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type TimelineMainProps = {
  minimized: boolean;
};

const TimelineMain: React.FC<TimelineMainProps> = ({
  minimized,
}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const [manifestIds, setManifestIds] = useState<string[]>(WesternTypographicFirsts.map(item => item.id));
  const [currentManifestId, setCurrentManifestId] = useState<string>(["https://norman.hrc.utexas.edu/notDM/objectManifest/p15878coll100v3/3980"]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(WesternTypographicFirsts);

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



  const handleManifestChange = (manifestId) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
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
    </div>
  );
};

export default TimelineMain;


