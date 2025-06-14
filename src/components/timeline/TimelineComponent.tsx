"use client";
import "./Timeline.css";
import { TimelineItem } from "@/types/TimelineItem";
import { Timeline as Vis } from "vis-timeline/standalone";
import { useRef, useEffect, useState } from "react";
import { useCollection } from "react-iiif-vault";
import { getValue } from "@iiif/helpers";
import Preview from "./Preview";
import ControlsButton from "../ui/ControlsButton";
import {
  highlightItem,
  styleSelectedItem,
  checkForItemCluster,
} from "../../lib/timelineHelpers";
import { Fit, Previous, Next, ZoomIn, ZoomOut } from "@/assets/icons";

interface TimelineComponentProps {
  overlayHeight: number;
  embedMode: boolean;
  collectionUrl: string;
  timelineItems: TimelineItem[];
  handleManifestChange: any;
  options: object;
  currentManifestId: string;
}

export default function TimelineComponent({
  overlayHeight,
  embedMode,
  collectionUrl,
  timelineItems,
  handleManifestChange,
  options,
  currentManifestId,
}: TimelineComponentProps) {
  const [previewItem, setPreviewItem] = useState<TimelineItem | null>(null);
  const [hoveredItemClass, setHoveredItemClass] = useState<string | null>(null);
  const [hoveredItemRect, setHoveredItemRect] = useState<DOMRect | null>(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  const footerHeight = embedMode ? 0 : 30;
  const availableHeight = window.innerHeight - overlayHeight - footerHeight;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Vis | null>(null);

  const collection = useCollection({ id: collectionUrl });
  const label = getValue(collection?.label);
  const itemCount = collection?.items?.length;

  const imageCache = new Map<string, boolean>();

  function preloadImage(url: string) {
    if (imageCache.get(url)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => imageCache.set(url, true);
  }

  const initTimeline = () => {
    if (!containerRef.current) return;
    timelineRef.current = new Vis(containerRef.current, timelineItems, options);
  };

  useEffect(() => {
    timelineRef.current?.setOptions(options);
    console.log(options);
  }, [options]);

  // initiate timeline
  useEffect(() => {
    if (!timelineRef.current) {
      initTimeline();
      // Wait for timeline to fully render before manipulating it
      setTimeout(() => {
        const dataRange = timelineRef.current?.getItemRange();
        if (dataRange?.min && dataRange.max) {
          const range = dataRange.max.getTime() - dataRange.min.getTime();
          const padding = range * 0.4;

          timelineRef.current?.setWindow(
            new Date(dataRange.min.getTime() - padding),
            new Date(dataRange.max.getTime() + padding),
            { animation: false }
          );
        }

        // Initialize focus with first item
        if (timelineItems.length > 0) {
          const firstItemId = timelineItems[0].id;
          newFocus(firstItemId);
        }
      }, 100);
    }
  }, [containerRef, timelineItems]);

  useEffect(() => {
    // Add click event listener
    timelineRef.current?.on("click", function (properties: any) {
      if (properties.item) {
        if (properties.isCluster) {
          document
            .querySelectorAll(".hovered")
            .forEach((el) => el.classList.remove("hovered"));
          setPreviewItem(null);

          //sometimes the mouse clicks on a parent or child element of the div with the data-clustered-ids. This gets round that but should fix it so the target is always right
          let clusteredItems;
          const parentAttr =
            properties.event.target.parentElement?.getAttribute(
              "data-clustered-ids"
            );
          const targetAttr =
            properties.event.target?.getAttribute("data-clustered-ids");
          const childAttr =
            properties.event.target.firstElementChild?.getAttribute(
              "data-clustered-ids"
            );

          if (parentAttr) {
            clusteredItems = parentAttr.split(" ");
          } else if (targetAttr) {
            clusteredItems = targetAttr.split(" ");
          } else if (childAttr) {
            clusteredItems = childAttr.split(" ");
          }

          //fit all items from the cluster
          timelineRef.current?.focus(clusteredItems, {
            animation: { duration: 400 },
          });
          setTimeout(() => {
            newFocus(clusteredItems[0]);
          }, 410);
        } else {
          setPreviewItem(null);
          newFocus(properties.item);
        }
      }
    });
  }, [timelineRef]);

  useEffect(() => {
    // add on rangechange listener for preloading images and styling new clusters

    const onRangeChange = () => {
      //preload images for visible items
      const preloadVisibleImages = () => {
        const visibleIds = timelineRef.current!.getVisibleItems() as string[];
        const visibleItems = timelineItems.filter((item) =>
          visibleIds.includes(item.id)
        );
        visibleItems.forEach((item) => {
          if (item.title) {
            preloadImage(item.title);
          }
        });
      };

      const delayPreload = () => {
        setTimeout(preloadVisibleImages, 100); // Delay slightly to ensure DOM is ready
      };

      delayPreload();

      // check if the current selected item has become part of a cluster when the user zooms out. if so,  style the cluster accordingly
      console.log("range changed", currentManifestId);
      const cluster = checkForItemCluster(currentManifestId);
      if (cluster) {
        console.log(
          "current manifest is this and was found in a cluster",
          currentManifestId
        );
        styleSelectedItem(cluster);
      } else {
        styleSelectedItem(currentManifestId);
      }
    };

    timelineRef.current?.on("rangechange", onRangeChange);

    return () => {
      timelineRef.current?.off("rangechange", onRangeChange);
    };
  }, [timelineRef, currentManifestId]);

  //add item hover listeners
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(".vis-item");
      if (elements.length === 0) return;

      elements.forEach((element) => {
        element.removeEventListener(
          "mouseenter",
          handleMouseEnter as EventListener
        );
        element.removeEventListener(
          "mouseleave",
          handleMouseLeave as EventListener
        );

        element.addEventListener(
          "mouseenter",
          handleMouseEnter as EventListener
        );
        element.addEventListener(
          "mouseleave",
          handleMouseLeave as EventListener
        );
      });
    });

    const container = containerRef.current;
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  //overriding vis-timeline's default styling and tooltips

  function getItemByClassName(className: string | number): TimelineItem {
    return timelineItems.find((item) => item.className === className)!;
  }

  //mouse in/out of box element

  const handleMouseEnter = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const classList = Array.from(target.classList);
    const itemClass = classList.find((cls) => cls.startsWith("item_"));

    if (itemClass && containerRef.current) {
      const box = document.querySelector(".vis-box." + itemClass);
      const containerBox = containerRef.current.getBoundingClientRect();

      if (box) {
        const boxRect = box.getBoundingClientRect();

        // Convert to coordinates relative to timeline container
        const relativeRect = {
          top: boxRect.top - containerBox.top,
          left: boxRect.left - containerBox.left,
          width: boxRect.width,
          height: boxRect.height,
          right: boxRect.right - containerBox.left,
          bottom: boxRect.bottom - containerBox.top,
        } as DOMRect;

        setHoveredItemRect(relativeRect);
      }

      highlightItem(itemClass);
      setHoveredItemClass(itemClass);
      setPreviewItem(getItemByClassName(itemClass));
    } else if (!itemClass && containerRef.current) {
      highlightItem(target);
    }
  };

  const handleMouseLeave = (): void => {
    setHoveredItemClass(null);
    document
      .querySelectorAll(".hovered")
      .forEach((el) => el.classList.remove("hovered"));
  };

  //nav functions

  const focusLockRef = useRef(false);

  const newFocus = (
    id: string
    // center: boolean,
    // animate: boolean,
    // zoom: boolean,
  ) => {
    //applies styling, changes current manifest in UV, re-fits timeline range
    if (focusLockRef.current) return;

    // lock the function otherwise quick clicking can make concurrent calls and end up with two 'vis-selected' items
    focusLockRef.current = true;

    document.querySelectorAll(".hovered").forEach((el) => {
      el.classList.remove("hovered");
    });

    const applyStyles = () => {
      styleSelectedItem(id);
      focusLockRef.current = false;
    };

    //ignore other parameters for now, can add them in when sort out the user settings. below is a first attempt.
    //  if (center && animate) {
    //   handleManifestChange(id)
    //     timelineRef.current?.focus(id, { animation: { duration: 200 }, zoom });
    //     setTimeout(applyStyles, 210);
    //   } else {
    //     if (center) {
    //       handleManifestChange(id)
    //       timelineRef.current?.focus(id, { animation: false, zoom });
    //     }
    //     // Use requestAnimationFrame to ensure DOM updates are complete
    //     requestAnimationFrame(() => {
    //       setTimeout(applyStyles, 410);
    //     });
    //   }

    handleManifestChange(id);
    applyStyles();
  };

  const handleNextFocus = () => {
    // Find the index of the object that has the current focused id
    const currentIndex = timelineItems.findIndex(
      (item) => item.id === currentManifestId
    );
    console.log("current index", currentIndex);

    // Determine the next index, looping back if at the end
    //add logic for if its a cluster somewhere here
    const nextIndex = (currentIndex + 1) % timelineItems.length;
    const nextItem = timelineItems[nextIndex].id;
    newFocus(nextItem);
    handleManifestChange(nextItem);
  };

  const handlePreviousFocus = () => {
    // Find the index of the object that has the current focused id
    const currentIndex = timelineItems.findIndex(
      (item) => item.id === currentManifestId
    );

    // Determine the previous index, looping back if at the end
    const prevIndex =
      (currentIndex - 1 + timelineItems.length) % timelineItems.length;
    const prevItem = timelineItems[prevIndex].id;

    newFocus(prevItem);
    handleManifestChange(prevItem);
  };

  //menu buttom functions

  const handleFit = () => {
    timelineRef.current?.fit();
  };

  const handleZoomIn = () => {
    timelineRef.current?.zoomIn(0.2);
  };

  const handleZoomOut = () => {
    timelineRef.current?.zoomOut(0.2);
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isInsideMenuArea = e.clientY > rect.bottom - availableHeight;
        setIsMenuHovered(isInsideMenuArea);
      }}
      onMouseLeave={() => setIsMenuHovered(false)}
    >
      <div
        id="timelineContainer"
        ref={containerRef}
        className={`timelineContainer ${
          embedMode ? "bottom-0" : "bottom-[30px]"
        }`}
      >
        {hoveredItemClass && previewItem && hoveredItemRect && (
          <Preview
            item={previewItem}
            key={previewItem.id}
            itemPosition={hoveredItemRect}
          />
        )}
      </div>

      <div
        className="menu absolute bottom-0 left-0 w-full z-0 pointer-events-none overflow-y-hidden"
        style={{ height: `${availableHeight}px` }}
      >
        <div
          className={`title m-2 w-fit relative z-10 text-white fade ${
            isMenuHovered ? "visible" : ""
          }`}
        >
          <div className="flex items-center">
            {label && (
              <span className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                {label}
              </span>
            )}
            {itemCount && (
              <>
                <span className="mx-4 h-4 w-px bg-gray-600" />
                <span className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                  {itemCount} items
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className={`zoom-buttons relative z-10 fade w-fit ${
            isMenuHovered ? "visible" : ""
          }`}
        >
          <ControlsButton label="Zoom In" onClick={handleZoomIn}>
            <ZoomIn />
          </ControlsButton>
          <ControlsButton label="Zoom Out" onClick={handleZoomOut}>
            <ZoomOut />
          </ControlsButton>
          <ControlsButton label="Fit Items" onClick={handleFit}>
            <Fit />
          </ControlsButton>
        </div>

        <div className="nav-buttons w-full h-full pointer-events-none">
          <div
            className="navButtonContainer z-1 absolute left-0 top-0 w-[50px] h-full bg-gradient-to-r from-black to-transparent flex items-center justify-center pointer-events-auto"
            id="left"
          >
            <div className={`fade ${isMenuHovered ? "visible" : ""}`}>
              <ControlsButton label="Previous" onClick={handlePreviousFocus}>
                <Previous />
              </ControlsButton>
            </div>
          </div>

          <div
            className="navButtonContainer z-5 absolute right-0 top-0 w-[50px] h-full bg-gradient-to-l from-black to-transparent flex items-center justify-center pointer-events-auto"
            id="right"
          >
            <div className={`fade ${isMenuHovered ? "visible" : ""}`}>
              <ControlsButton label="Next" onClick={handleNextFocus}>
                <Next />
              </ControlsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
