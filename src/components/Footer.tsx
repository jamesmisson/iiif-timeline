"use client";
import FooterButton from "./ui/FooterButton";
import { useCollection } from 'react-iiif-vault';
import { getValue } from "@iiif/helpers";
import { Folder, Settings, Share } from '../assets/icons'

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
    const label = getValue(collection?.label);
    const itemCount = collection?.items?.length
    // const requiredStatement = collection?.requiredStatement

  return (
    <footer className="h-[30px] bg-[rgb(33,33,33)] text-white">
      <div className="w-full px-4 flex flex-row justify-between items-center">
        <div className="flex items-center">
          {label && (
            <span
              className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
            >
              {label}
            </span>
          )}
          {itemCount && (
            <>     <span className="mx-4 h-4 w-px bg-gray-600" />
                      <span
              className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
            >
              {itemCount} items
            </span> 
            </>
          )}
        </div>

        <div className="buttons flex items-center">
          <FooterButton
            onClick={onLoadCollection}
            title="Load Collection"
            label="Load Collection"
            
          >
            <Folder />
          </FooterButton>
          {collectionUrl && (
            <FooterButton onClick={onEmbed} title="Share" label="Share">
              <Share />
            </FooterButton>

          )}
          <FooterButton
            onClick={onSettings} title="Settings" label="Settings">
              <Settings />
          </FooterButton>
        </div>
      </div>
    </footer>
  );
}
