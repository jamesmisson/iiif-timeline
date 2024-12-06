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

  const [uvHeight, setUvHeight] = useState<undefined | number>(undefined);

  const manifestUrls = [...collection.iterateCollectionManifest()].map(
    (manifestRef) => manifestRef.id
  );

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const timelineItemsResult = useQueries({
    queries: manifestUrls.map((manifestUrl, index) => ({
      queryKey: ["timeline", collectionUrl, manifestUrl],
      queryFn: () => FetchTimelineItem(manifestUrl, index),
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

  return (
    <>
    <Header collection={collection} />
    <SplitView
          top={<div style={{height: "100%"}}>
            {manifestUrls.length ? (
            <UV manifestUrl={manifestUrls[0]} />
          ) : (
            <div>Loading Viewer...</div>
          )}</div>}
          bottom={<div style={{display: "flex", flexDirection: "column", flex: "1", height: "100%"}}>{timelineItems.length ? (
            <Timeline timelineItems={timelineItems} />
          ) : (
            <div>Loading Timeline...</div>
          )}</div>}
        />
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

