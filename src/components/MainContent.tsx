"use client";
import { useEffect, useState } from "react";
import TimelineComponent from "@/components/timeline/TimelineComponent";
import UV from "./uv/UV";
import { useVault } from "react-iiif-vault";
import { TimelineItem } from "@/types/TimelineItem";
import { createTimelineItems } from "@/lib/collection2Timeline";
import { minZoomValues } from "../lib/minZoomValues";
import { TimelineOptions } from "@/types/TimelineOptions";

interface MainContentProps {
  collectionUrl: string;
  options: TimelineOptions;
  embedMode: boolean;
}

export default function MainContent({
  collectionUrl,
  options,
  embedMode,
}: MainContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentManifestId, setCurrentManifestId] = useState<string>("");
  // const [panelSize, setPanelSize] = useState(25); // Default size
  const [overlayHeight, setOverlayHeight] = useState(0.5 * window.innerHeight);
  const [updatedOptions, setUpdatedOptions] = useState(options);

  const vault = useVault();

  

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      try {
        setIsLoading(true);
        setError(null);
        const collection = await vault.loadCollection(collectionUrl);

        if (!collection) {
          throw new Error(
            "No collection loaded. Click 'Load Collection' to get started."
          );
        }

        const { items, minZoomLevel } = await createTimelineItems(
          collection,
          vault
        );
        setUpdatedOptions({
          ...options,
          zoomMin: minZoomValues[minZoomLevel],
        });
        if (isMounted) setTimelineItems(items);
        console.log("first item:", items[0].id);
        setCurrentManifestId(items[0].id);
      } catch (err) {
        if (isMounted)
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [collectionUrl, vault]);

useEffect(() => {
  setUpdatedOptions(prev => ({ ...options, zoomMin: prev.zoomMin }));
}, [options]);

  const handleManifestChange = (manifestId: string) => {
    setCurrentManifestId(manifestId);
  };

  return (
    <>
      <UV
        overlayHeight={overlayHeight}
        setOverlayHeight={setOverlayHeight}
        manifestId={currentManifestId}
        key={currentManifestId}
      />

      <div className="flex-1 overflow-y-auto z-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xl">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
            {error}
          </div>
        ) : !isLoading && timelineItems ? (
          <TimelineComponent
            overlayHeight={overlayHeight}
            embedMode={embedMode}
            collectionUrl={collectionUrl}
            timelineItems={timelineItems}
            handleManifestChange={handleManifestChange}
            options={updatedOptions}
            currentManifestId={currentManifestId}
          />
        ) : (
          // <div>
          //     <ul>
          //     {timelineItems.map((item) => (
          //       <li key={item.id} style={{ backgroundImage: `url(${item.title})`, backgroundSize: 'cover', padding: '1em', margin: '1em 0' }}>
          //         <strong>{item.content}</strong> — <em>{item.start}</em>
          //       </li>
          //     ))}
          //   </ul>
          // {/* <UV /> */}
          // {/* <TimelineComponent collectionUrl={collectionUrl} /> */}
          // </div>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              No collection loaded. Click Load Collection to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
