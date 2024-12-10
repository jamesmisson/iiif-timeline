// this is a simplified version of TimelineMain for Demoing purposes. There is no IIIF Collection, just a premade timelineItems object
// after demoing this should be deleted, along with its render in AppThree.tsx

import "./Timeline.css";
import "../shared/Header.css"
import UV from "../uv/UV";
import { SplitView } from "./SplitView";
import { useState, useEffect, useRef } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import WesternTypographicFirsts from '../../examples/typographicfirsts';



const TimelineMain: React.FC = () => {

  const [manifestIds, setManifestIds] = useState<string[]>(WesternTypographicFirsts.map(item => item.id))
  const [currentManifestId, setCurrentManifestId] = useState<string>(WesternTypographicFirsts[0].id);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(WesternTypographicFirsts);

  const handleManifestChange = (manifestId) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <>
      <header className="collectionHeader">
        <h1 className="collectionTitle">Demo: Western Typographic Firsts</h1>
        {timelineItems.length && <p className="itemCount">{timelineItems.length} items</p>}
    </header>
        <SplitView timelineItems={timelineItems} handleManifestChange={handleManifestChange}
          top={
            <div style={{ height: "100%" }}>
              {manifestIds?.length ? (
                <UV manifestId={currentManifestId} key={currentManifestId} />
              ) : (
                <div>Loading Viewer...</div>
              )}
            </div>
          }
        />
    </>
  );
  
};

export default TimelineMain;

