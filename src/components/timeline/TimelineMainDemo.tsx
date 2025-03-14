import "./Timeline.css";
import Timeline from "./Timeline";
import UV from "../uv/UV";
import { useState, useEffect, useRef } from "react";
import WesternTypographicFirsts from "../../examples/typographicfirsts"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type TimelineMainProps = {
  options: Object;
};


const TimelineMain: React.FC<TimelineMainProps> = ({ options
}) => {
  const [currentManifestId, setCurrentManifestId] = useState<string>("https://norman.hrc.utexas.edu/notDM/objectManifest/p15878coll100v3/3980");
  const [panelSize, setPanelSize] = useState<number>(50)
  const bottomPanelRef = useRef<any>(null);
  const topPanelRef = useRef<any>(null);

  const timelineItems = WesternTypographicFirsts
  const manifestIds = WesternTypographicFirsts.map(item => item.id)

  const handleManifestChange = (manifestId: string) => {
    setCurrentManifestId(manifestId);
  };

  const handleResize = (size: number) => {
    setPanelSize(size)
    console.log('new panel size ', size)
  }

  return (
    <div className="flex-1 h-full overflow-hidden">
        <ResizablePanelGroup
          direction="vertical"
          className="max-w-full rounded-none"
        >
          <ResizablePanel defaultSize={75} ref={topPanelRef} order={2}>
          <div className="flex h-full items-center justify-center mb-2 pb-3">
                {manifestIds?.length ? (
                  <UV manifestId={currentManifestId} key={currentManifestId} />
                ) : (
                  <div>Loading Viewer...</div>
                )}
            </div>
          </ResizablePanel>

          <ResizableHandle {...({ withHandle: true })} />

          
          <ResizablePanel defaultSize={25} ref={bottomPanelRef} order={2} onResize={(size) => handleResize(size)}>
          <div className="flex flex-col h-full w-full">
                {timelineItems?.length ? (
                  <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange} panelSize={panelSize} options={options}/>
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


