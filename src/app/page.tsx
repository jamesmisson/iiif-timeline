"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainContent from "@/components/MainContent";
import LoadCollectionDialog from "@/components/dialogs/LoadCollectionDialog";
import EmbedDialog from "@/components/dialogs/EmbedDialog";
import SettingsDialog from "@/components/dialogs/SettingsDialog"
import Footer from "@/components/Footer";
import { VaultProvider, CollectionContext } from 'react-iiif-vault'

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
    zoomMin: 1000 * 60 * 60 * 24 * 7,
    // zoomMin: 1000 * 60 * 60 * 24 * 365,
    margin: 20,
    // max: new Date(),
    showTooltips: false,
    // tooltip: {
    // // followMouse: true,
    // delay: 0,
    // // overflowMethod: 'none'
    // },
    showMajorLabels: false,
    dataAttributes: ["id"],
    template: (itemData, element, data) => {
      if (data.isCluster) {
        return `<span class="cluster-header">${data.items.length} ${clusterUnit} </div>`;
      } else {
        return `<div>${data.content}</div>`;
        console.log('template item data:', itemData)
                console.log('template element:', element)

      }
    },
    cluster: {
      maxItems: 4,
      titleTemplate: "cluster {count} items",
      showStipes: true
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
        <div className="h-screen flex flex-col bg-black text-white">
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col pb-2">
              <MainContent collectionUrl={collectionUrl} options={timelineOptions}
              />
            </div>
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
          </main>
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