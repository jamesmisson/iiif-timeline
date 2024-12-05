import React, { useEffect, useRef } from "react";

// Types for UV (if you don't have the official types, we'll use `any`)
declare global {
  interface Window {
    UV: any; // UV.js is global, so we declare it as `any` for TypeScript compatibility
  }
}

interface UVViewerProps {
  manifestUrl: string;
  timelineSize: string;
}

const UVViewerAdvanced: React.FC<UVViewerProps> = ({ manifestUrl }) => {
  const uvContainerRef = useRef<HTMLDivElement>(null);

  const resize = () => {
    if (uvContainerRef.current) {
      // Ensure the container takes the size of its parent
      const parentElement = uvContainerRef.current.parentElement;
  
      if (parentElement) {
        // Use the parent's dimensions
        const { width, height } = parentElement.getBoundingClientRect();
        uvContainerRef.current.style.width = `${width}px`;
        uvContainerRef.current.style.height = `${height}px`;
      }
    }
  };

  useEffect(() => {
    if (!window.UV || !uvContainerRef.current) return;
    console.log(window.UV)

    const urlAdapter = new window.UV.IIIFURLAdapter(true);
    const data = urlAdapter.getInitialData({
      embedded: true,
    });
    console.log(data)

    const uv = window.UV.init(uvContainerRef.current, data);

    const configUrl = urlAdapter.get("config");
    if (configUrl) {
      uv.on("configure", function ({ config, cb }: { config: string; cb: Function }) {
        cb(
          new Promise((resolve) => {
            fetch(configUrl)
              .then((response) => response.json())
              .then(resolve);
          })
        );
      });
    }

    const observer = new MutationObserver(() => {
      resize();
    });
  
    const parentElement = uvContainerRef.current?.parentElement;
  
    if (parentElement) {
      observer.observe(parentElement, { attributes: true, childList: true, subtree: true });
    }
  
    // Attach window resize event
    window.addEventListener("resize", resize);

    // Initial resize
    resize();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      // resizeObserver.disconnect(); // Stop observing when the component unmounts
    };
  }, [manifestUrl]); // Rerun effect when `manifestUrl` changes

  return <div id="uv" className="uv" ref={uvContainerRef}></div>;
};

export default UVViewerAdvanced;
