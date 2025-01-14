import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { FolderPlus, Minus, Rows2 } from "lucide-react";

import FetchIIIF from "./FetchIIIF";
import { Maniiifest } from "maniiifest";
import TimelineMain from "./components/timeline/TimelineMain";
import TimelineMainDemo from "./components/timeline/TimelineMainDemo";

import fixtures from "./Fixtures";

const App4 = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [url, setUrl] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [demoMode, setDemoMode] = useState(false)

  const {
    data: collection,
    isLoading,
    isError,
    error,
  } = useQuery<Maniiifest>({
    queryKey: ["iiif", url],
    queryFn: () => FetchIIIF(url),
    enabled: shouldFetch && !!url,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShouldFetch(true);
    setIsDialogOpen(false);
    console.log("submitted");
    console.log(collection);
    setDemoMode(false)

  };

  const handleUrlSubmit = (submittedUrl: string): void => {
    setShouldFetch(true);
    setIsDialogOpen(false);
    setUrl(submittedUrl);
    setDemoMode(false)
  };

  const handleDemoSubmit = () => {
    setIsDialogOpen(false);
    setDemoMode(true)
    console.log('demo mode')
  }

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset the form when dialog is closed without submission
      setShouldFetch(false);
    }
  };

  
  

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 flex flex-col overflow-hidden">
        {isError && (
          <p className="text-red-600">
            Error accessing Collection: {error.message}
          </p>
        )}

        {isLoading && <p className="text-gray-500">Loading {url}...</p>}

        {demoMode && (
          <div className="flex-1 flex flex-col border-b pb-2">
          <TimelineMainDemo
            minimized={minimized}
          />
        </div>
        )
        }

        {collection && !isLoading && !demoMode && (
          <div className="flex-1 flex flex-col border-b pb-2">
            <TimelineMain
              collectionUrl={url}
              collection={collection}
              minimized={minimized}
            />
          </div>
        )}


      </main>

      <footer className="flex-none">
        <div className="container flex items-center gap-0">
          <Toggle
            aria-label="Toggle timeline view"
            pressed={minimized}
            onPressedChange={setMinimized}
            className="p-3 inline-flex items-center justify-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-5 w-5"
          >
            {minimized ? (
              <Rows2 className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
          </Toggle>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="p-3 w-5 h-5">
                <FolderPlus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-center">IIIF Timeline</DialogTitle>
              </DialogHeader>
              
              <Button
                        onClick={() => handleDemoSubmit()}
                        className="w-full flex bg-green-700 justify-center truncate p-2 m-1"
                      >
                    Demo: Incunabula
                      </Button>
                      <h2 className="text-center">Or load a IIIF Collection</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="url"
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"

                />
                <Button type="submit" className="w-full bg-gray-700" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Load"}
                </Button>
              </form>
              <div>
                <h2 className="text-center">Or select a test fixture</h2>
                <ul>
                  {fixtures.map((fixture, index) => (
                    <li key={index}>
                      <Button
                        onClick={() => handleUrlSubmit(fixture)}
                        className="w-full flex bg-gray-600 justify-normal truncate p-2 m-1"
                      >
                        {fixture}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
};

export default App4;
