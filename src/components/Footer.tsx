"use client";
import FooterButton from "./ui/FooterButton";
import { useCollection } from 'react-iiif-vault';
import { getValue } from "@iiif/helpers";

interface FooterProps {
  onLoadCollection: () => void;
  onEmbed: () => void;
  onSettings: () => void;
  collectionUrl: string;
}

export default function Footer({
  onLoadCollection,
  onEmbed,
  onSettings,
  collectionUrl,
}: FooterProps) {

    const collection = useCollection({ id: collectionUrl });


  return (
    <footer className="h-[30px] bg-black text-white">
      <div className="container mx-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          {collection && (
            <span
              className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
            >
              {getValue(collection.label)}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <FooterButton
            onClick={onLoadCollection}
            title="Load Collection"
            label="Load Collection"
          >
            C
          </FooterButton>
          {collectionUrl && (
            <FooterButton onClick={onEmbed} title="Embed" label="Embed">
              E
            </FooterButton>

          )}
          <FooterButton
            onClick={onSettings} title="Settings" label="Settings">
              S
          </FooterButton>
        </div>
      </div>
    </footer>
  );
}
