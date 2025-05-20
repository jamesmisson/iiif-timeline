"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoadCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onLoadCollection: (url: string) => void;
}

export default function LoadCollectionDialog({
  isOpen,
  onClose,
  onLoadCollection,
}: LoadCollectionDialogProps) {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      new URL(inputUrl);
      setIsValidUrl(true);
      onLoadCollection(inputUrl);
    } catch (err) {
      console.log(err)
      setIsValidUrl(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px] rounded-none">
        <DialogHeader>
          <DialogTitle>Load IIIF Collection</DialogTitle>
          <DialogDescription>
            Enter a URL to a IIIF Collection to display it in the timeline.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="collection-url">Collection URL</Label>
            <Input
              id="collection-url"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setIsValidUrl(true);
              }}
              placeholder="https://example.org/iiif/collection/manifest.json"
              className={!isValidUrl ? "border-red-500" : ""}
            />
            {!isValidUrl && (
              <p className="text-red-500 text-sm">Please enter a valid URL</p>
            )}
          </div>

          <div className="py-2">
            <h3 className="font-medium mb-2">Example Collections:</h3>
            <ul className="list-disc pl-5 space-y-1">
          <li>
            <button 
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setInputUrl('https://jamesmisson.github.io/iiif-timeline/lotus_sutra.json')}
            >
              BL IDP: Saddharmapundarikasutra (Lotus Sutra)
            </button>
          </li>
                    <li>
            <button 
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setInputUrl('https://jamesmisson.github.io/iiif-timeline/idp_dated_colophons.json')}
            >
              BL IDP: Colophons with year/month/date
            </button>
          </li>
          <li>
            <button 
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setInputUrl('https://norman.hrc.utexas.edu/notDM/collectionManifest/p15878coll1v3')}
            >
              UTexas
            </button>
          </li>
          <li>
            <button 
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setInputUrl('https://api.dc.library.northwestern.edu/api/v2/collections/ba35820a-525a-4cfa-8f23-4891c9f798c4?as=iiif')}
            >
              Northwestern
            </button>
            </li>
            <li>
            <button 
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setInputUrl('https://iiif.io/api/cookbook/recipe/0230-navdate/navdate-collection.json')}
            >
              Cookbook Navdate Collection
            </button>
            </li>

            <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://digital.lib.utk.edu/assemble/collection/collections/rfta')}
    >
      UTK RFTA Collection
    </button>
  </li>
  <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://digital.lib.utk.edu/assemble/collection/collections/rftaart')}
    >
      UTK RFTA Art Collection
    </button>
  </li>
  <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://digital.lib.utk.edu/assemble/collection/collections/insurancena')}
    >
      UTK Insurance NA Collection
    </button>
  </li>
  <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://raw.githubusercontent.com/IIIF-Commons/parser/main/fixtures/presentation-3/wellcome-collection.json')}
    >
      Wellcome Collection (IIIF Commons Fixture)
    </button>
  </li>
  <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://iiif.io/api/cookbook/recipe/0068-newspaper/newspaper_title-collection.json')}
    >
      Cookbook Newspaper Title Collection
    </button>
  </li>
  <li>
    <button 
      type="button"
      className="text-blue-500 hover:underline"
      onClick={() => setInputUrl('https://iiif.wellcomecollection.org/presentation/b19974760_1')}
    >
      Wellcome Collection (Presentation API)
    </button>
  </li>
        </ul>
      </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} className="rounded-none">
              Cancel
            </Button>
            <Button
            className="rounded-none"
            type="submit">Load Collection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}