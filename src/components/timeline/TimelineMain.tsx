import "./Timeline.css";
import Header from "../shared/Header";
import Timeline from "./Timeline";
import UV from "../uv/UV";
import { SplitView } from "./SplitView";
import { Maniiifest } from "maniiifest";
import { useState, useEffect, useRef } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import { useQueries } from "@tanstack/react-query";
import FetchTimelineItem from "./FetchTimelineItem";

type TimelineMainProps = {
  collectionUrl: string | null;
  collection: Maniiifest;
};

const TimelineMain: React.FC<TimelineMainProps> = ({ collectionUrl, collection }) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true)

  const [manifestIds, setManifestIds] = useState<string[]>([])
  const [currentManifestId, setCurrentManifestId] = useState<string>([]);
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

    const manifests = [...collection.iterateCollectionManifest()].map(
      (manifestRef) => manifestRef.id
    );

    setManifestIds(manifests)
    setCurrentManifestId(manifests[0])
    setIsLoading(false)
    console.log(timelineItemsSorted)
  }, [timelineItemsResult.pending]);

  const handleManifestChange = (manifestId) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <>
      <Header collection={collection} />
      {!isLoading ? (
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
      ) : (
        <p>Loading data, please wait...</p>
      )}
    </>
  );
  
};

export default TimelineMain;

