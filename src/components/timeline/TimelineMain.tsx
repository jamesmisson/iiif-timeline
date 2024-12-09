import "./Timeline.css";
import Header from "../shared/Header";
import Timeline from "./Timeline";
import UV from "../uv/UV";
import { SplitView } from "./SplitView";
import { Maniiifest } from "maniiifest";
import { useState, useEffect } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import { useQueries } from "@tanstack/react-query";
import FetchTimelineItem from "./FetchTimelineItem";

type TimelineMainProps = {
  collectionUrl: string | null;
  collection: Maniiifest;
};

const TimelineMain: React.FC<TimelineMainProps> = ({ collectionUrl, collection }) => {

  const manifestIds = [...collection.iterateCollectionManifest()].map(
    (manifestRef) => manifestRef.id
  );
  const [currentManifestId, setCurrentManifestId] = useState(manifestIds[0]);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

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
    console.log(timelineItemsSorted);
  }, [timelineItemsResult.pending]);

  const handleManifestChange = (manifestId) => {
    setCurrentManifestId(manifestId);
    console.log("manifestId changes:", manifestId)
  };

  return (
    <>
    <Header collection={collection} />

      <div style={{ height: '50%' }}>
    {manifestIds.length ? (
      // <div>{currentManifestId}</div>
      <UV manifestId={currentManifestId} />
    ) : (
      <div>Loading Viewer...</div>
    )}
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', flex: '1', height: '100%' }}>
    {timelineItems.length ? (
      <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange} />
    ) : (
      <div>Loading Timeline...</div>
    )}
  </div>




    {/* <SplitView
          top={<div style={{height: "100%"}}>
            {manifestIds.length ? (
            <UV manifestId={currentManifestId} />
          ) : (
            <div>Loading Viewer...</div>
          )}</div>}
          bottom={<div style={{display: "flex", flexDirection: "column", flex: "1", height: "100%"}}>{timelineItems.length ? (
            <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange}/>
          ) : (
            <div>Loading Timeline...</div>
          )}</div>}
        /> */}
    {/* <div id="container" >
    {manifestUrls.length ? (
      <UV manifestUrl={manifestUrls[0]} />
    ) : (
      <div>Loading Timeline...</div>
    )}
    <div id="splitter">x</div>
    {timelineItems.length ? (
      <Timeline timelineItems={timelineItems} />
    ) : (
      <div>Loading Timeline...</div>
    )}
    </div> */}
    </>
  );
};

export default TimelineMain;

