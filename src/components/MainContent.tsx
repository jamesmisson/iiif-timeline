"use client";
import { useEffect, useState, useRef } from "react";
import TimelineComponent from "@/components/timeline/TimelineComponent";
import UV from "./uv/UV";
import { useVault } from "react-iiif-vault";
import { TimelineItem } from "@/types/TimelineItem";
import { createTimelineItems } from "@/lib/collection2Timeline";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface MainContentProps {
  collectionUrl: string;
  options: object;
}

export default function MainContent({ collectionUrl, options }: MainContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentManifestId, setCurrentManifestId] = useState<string>("");
  const [panelSize, setPanelSize] = useState(25); // Default size

  const bottomPanelRef = useRef(null);
  const topPanelRef = useRef(null);

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

        const items = await createTimelineItems(collection, vault);
        if (isMounted) setTimelineItems(items);
        console.log('first item:', items[0].id)
        setCurrentManifestId(items[0].id)
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

  const handleManifestChange = (manifestId: string) => {
    setCurrentManifestId(manifestId);
  };

  const handlePanelResize = (size: number) => {
    setPanelSize(size);
    // other resize functions?
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          {error}
        </div>
      ) : !isLoading && timelineItems ? (
        <ResizablePanelGroup
          direction="vertical"
          className="max-w-full rounded-none"
        >
          <ResizablePanel defaultSize={75} ref={topPanelRef} order={0}>
          <div className="flex h-full items-center justify-center mb-5 pb-4">
              {timelineItems?.length ? (
                <UV manifestId={currentManifestId} key={currentManifestId} />
              ) : (
                <div>Loading Viewer...</div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle {...{ withHandle: true }} />

          <ResizablePanel
            defaultSize={25}
            ref={bottomPanelRef}
            order={1}
            onResize={(size) => handlePanelResize(size)}
          >
            <div className="flex flex-col h-full w-full">
              {timelineItems?.length ? (
                <TimelineComponent
                  timelineItems={timelineItems}
                  handleManifestChange={handleManifestChange}
                  panelSize={panelSize}
                  options={options}
                />
              ) : (
                <div>Loading Timeline...</div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
  );
}
