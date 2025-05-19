"use client";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, CopyIcon } from "lucide-react";

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collectionUrl: string | null;
}

export default function EmbedDialog({
  isOpen,
  onClose,
  collectionUrl,
}: EmbedDialogProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate the absolute URL for embedding
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = collectionUrl ?
    `${baseUrl}/iiif-timeline/?c=${encodeURIComponent(collectionUrl)}&embed=true` :
    baseUrl;

  // Generate iframe code with a reasonable default size
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-none">
        <DialogHeader>
          <DialogTitle>Embed Timeline</DialogTitle>
          <DialogDescription>
            Copy this code to embed the timeline on your website.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="iframe-code">Embed Code</Label>
            <div className="relative">
              <Input
                id="iframe-code"
                ref={inputRef}
                value={iframeCode}
                readOnly
                className="pr-10 font-mono text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-green-500 text-sm">Copied to clipboard!</p>
            )}
          </div>
          {/* ... rest of your dialog content ... */}
        </div>
      </DialogContent>
    </Dialog>
  );
}