"use client";
import { useEffect, useState } from "react";
import FooterButton from "./ui/FooterButton";
import { useVault, useCollection } from 'react-iiif-vault'


interface FooterProps {
  onLoadCollection: () => void;
  onEmbed: () => void;
  collectionUrl: string;
}

export default function Footer({
  onLoadCollection,
  onEmbed,
  collectionUrl,
}: FooterProps) {


  return (
    <footer className="h-[30px] bg-black text-white">
      <div className="container mx-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          {collectionUrl && (
            <span
              className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
              title={collectionUrl}
            >
              {collectionUrl}
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
        </div>
      </div>
    </footer>
  );
}
