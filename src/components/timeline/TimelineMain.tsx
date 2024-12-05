import "./Timeline.css";
import Header from "../shared/Header";
import Timeline from "./Timeline";
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
      {timelineItems.length ? (
        <Timeline timelineItems={timelineItems} />
      ) : (
        <div>Loading Timeline...</div>
      )}
    </>
  );
};

export default TimelineMain;
