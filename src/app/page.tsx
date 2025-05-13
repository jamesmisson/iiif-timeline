// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainContent from "@/components/MainContent";
import LoadCollectionDialog from "@/components/dialogs/LoadCollectionDialog";
import EmbedDialog from "@/components/dialogs/EmbedDialog";
import Footer from "@/components/Footer";

import { VaultProvider, CollectionContext } from 'react-iiif-vault'
import { Main } from "next/document";

export default function Home() {
  const [isLoadCollectionDialogOpen, setIsLoadCollectionDialogOpen] =
    useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [collectionUrl, setCollectionUrl] = useState<string>("");



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

  // Function to handle loading a collection from the dialog
  const handleSubmitCollection = (url: string) => {
    if (!url) return;
    // Update the URL with the collection parameter
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("c", url);
    router.push(`?${newParams.toString()}`);
    setCollectionUrl(url);
    setIsLoadCollectionDialogOpen(false);
  };



  return (
    <VaultProvider>
            <CollectionContext collection={collectionUrl}>
            <div className="h-screen flex flex-col bg-black text-white">

            <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col border-b pb-2">

            <MainContent collectionUrl={collectionUrl} />
            </div>

      {!isEmbedMode && (
        <Footer
          onLoadCollection={() => setIsLoadCollectionDialogOpen(true)}
          onEmbed={() => setIsEmbedDialogOpen(true)}
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
    </main>
    </div>
    </CollectionContext>

    </VaultProvider>
  );
}
