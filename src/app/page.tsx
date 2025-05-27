"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainContent from "@/components/MainContent";
import LoadCollectionDialog from "@/components/dialogs/LoadCollectionDialog";
import EmbedDialog from "@/components/dialogs/EmbedDialog";
import SettingsDialog from "@/components/dialogs/SettingsDialog";
import Footer from "@/components/Footer";
import { VaultProvider, CollectionContext } from "react-iiif-vault";
import { TimelineOptions } from "@/types/TimelineOptions";
import { defaultTimelineOptions } from "@/lib/defaultTimelineOptions";
import { serializeTimelineOptions, deserializeTimelineOptions } from "@/lib/urlParamUtils";


function HomeContent() {
  const [isLoadCollectionDialogOpen, setIsLoadCollectionDialogOpen] =
    useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [collectionUrl, setCollectionUrl] = useState<string>("");
  const [timelineOptions, setTimelineOptions] = useState<TimelineOptions>(defaultTimelineOptions);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isEmbedMode = searchParams.get("embed") === "true";

  // Check if there's a collection URL in the search parameters when the page loads
  useEffect(() => {
    const urlParam = searchParams.get("c");
        const optionsParam = searchParams.get("opts");

    if (urlParam) {
      setCollectionUrl(urlParam);
    } else if (!isEmbedMode) {
      // Only show dialog in non-embed mode when no collection is specified
      setIsLoadCollectionDialogOpen(true);
    }

    const deserializedOptions = deserializeTimelineOptions(optionsParam || "");
    setTimelineOptions(deserializedOptions);

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

const handleOptionsChange = (newOptions: TimelineOptions) => {
    setTimelineOptions(newOptions);
  
     // Update URL parameters
    const newParams = new URLSearchParams(searchParams.toString());
    const serializedOptions = serializeTimelineOptions(newOptions);
    
    if (serializedOptions) {
      newParams.set("opts", serializedOptions);
    } else {
      // Remove the parameter if options match defaults
      newParams.delete("opts");
    }
    
    // Update the URL without triggering a page reload
    router.push(`?${newParams.toString()}`, { scroll: false });
    
    // Close the settings dialog
    setIsSettingsDialogOpen(false);
  };


  return (
    <VaultProvider>
      <CollectionContext collection={collectionUrl}>
        <div className="relative flex flex-col h-screen select-none overflow-hidden bg-black">
          <MainContent
            collectionUrl={collectionUrl}
            options={timelineOptions}
            embedMode={isEmbedMode}
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
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      Loading...
    </div>
  );
}

// Main page component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
