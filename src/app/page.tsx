"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainContent from "@/components/MainContent";
import LoadCollectionDialog from "@/components/dialogs/LoadCollectionDialog";
import EmbedDialog from "@/components/dialogs/EmbedDialog";
import SettingsDialog from "@/components/dialogs/SettingsDialog"
import Footer from "@/components/Footer";
import { VaultProvider, CollectionContext } from 'react-iiif-vault'
import { minZoomValues } from '../lib/minZoomValues'

function HomeContent() {
  const [isLoadCollectionDialogOpen, setIsLoadCollectionDialogOpen] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [collectionUrl, setCollectionUrl] = useState<string>("");


  const clusterUnit = "items"


  const [timelineOptions, setTimelineOptions] = useState<object>({
    autoResize: false,
    width: "100%",
    height: "100%",
    zoomMin: minZoomValues.YEAR,
    margin: 20,
    showTooltips: false,
    showMajorLabels: false,
    dataAttributes: ["id"],
    //i think this template bit is the route to having more access to item data within the cluster for e.g. nav buttons and thumbnails
    template: (itemData, element, data) => {
    if (data.isCluster) {
      const clusteredIds = data.items;
      element.setAttribute('data-clustered-ids', clusteredIds.map(item => item?.id).join(' '));
return `<div class="cluster-header">${data.items.length} ${clusterUnit}</div>`;
    } else {
      return `<div>${data.content}</div>`;
    }

    },
    cluster: {
      maxItems: 4,
      titleTemplate: "cluster {count} items",
      showStipes: true,
      fitOnDoubleClick: false
    }
  });


  
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEmbedMode = searchParams.get("embed") === "true";
  
  // Check if there's a collection URL in the search parameters when the page loads
  useEffect(() => {
    const urlParam = searchParams.get("c");
    if (urlParam) {
      setCollectionUrl(urlParam);
    } else if (!isEmbedMode) {
      // Only show dialog in non-embed mode when no collection is specified
      setIsLoadCollectionDialogOpen(true);
    }
  }, [searchParams, isEmbedMode]);
  
  const handleSubmitCollection = (url: string) => {
    if (!url) return;
    // Update the URL with the collection parameter
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("c", url);
    router.push(`?${newParams.toString()}`);
    setCollectionUrl(url);
    setIsLoadCollectionDialogOpen(false);
  };
  
  const handleOptionsChange = (newOptions: object) => {
    setTimelineOptions(newOptions);
  };
  
  return (
    <VaultProvider>
      <CollectionContext collection={collectionUrl}>
          <div className="relative flex flex-col h-screen select-none overflow-hidden bg-black">
              <MainContent collectionUrl={collectionUrl} options={timelineOptions} embedMode={isEmbedMode}
              />
            {!isEmbedMode && (
              <Footer
                onLoadCollection={() => setIsLoadCollectionDialogOpen(true)}
                onEmbed={() => setIsEmbedDialogOpen(true)}
                onSettings={() => setIsSettingsDialogOpen(true)}
                collectionUrl={collectionUrl}
              />
            )}
            <LoadCollectionDialog
              isOpen={isLoadCollectionDialogOpen}
              onClose={() => setIsLoadCollectionDialogOpen(false)}
              onLoadCollection={handleSubmitCollection}
            />
            <EmbedDialog
              isOpen={isEmbedDialogOpen}
              onClose={() => setIsEmbedDialogOpen(false)}
              collectionUrl={collectionUrl}
            />
            <SettingsDialog
              isOpen={isSettingsDialogOpen}
              onClose={() => setIsSettingsDialogOpen(false)}
              options={timelineOptions}
              onOptionsChange={handleOptionsChange}
            />
          </div>
      </CollectionContext>
    </VaultProvider>
  );
}

// Loading fallback component
function LoadingFallback() {
  return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
}

// Main page component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}