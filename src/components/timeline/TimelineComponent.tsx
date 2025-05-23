"use client";
import "./Timeline.css";
import { TimelineItem } from "@/types/TimelineItem";
import { Timeline as Vis } from "vis-timeline/standalone";
import { useRef, useEffect, useState } from "react";
import { useCollection } from "react-iiif-vault";
import { getValue } from "@iiif/helpers";
import Preview from "./Preview";
import FooterButton from "../ui/FooterButton";

interface TimelineComponentProps {
  collectionUrl: string;
  timelineItems: TimelineItem[];
  handleManifestChange: any;
  panelSize: number;
  options: object;
}

export default function TimelineComponent({
  collectionUrl,
  timelineItems,
  handleManifestChange,
  panelSize,
  options,
}: TimelineComponentProps) {
  const [focus, setFocus] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<TimelineItem | null>(null);
  const [hoveredItemClass, setHoveredItemClass] = useState<string | null>(null);
  const [hoveredItemRect, setHoveredItemRect] = useState<DOMRect | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Vis | null>(null);

  const collection = useCollection({ id: collectionUrl });
  const label = getValue(collection?.label);
  const itemCount = collection?.items?.length;
  // const requiredStatement = collection?.requiredStatement

  const handleNewItem = (newManifestId: string) => {
    handleManifestChange(newManifestId);
  };

  const imageCache = new Map<string, boolean>();

  function preloadImage(url: string) {
    if (imageCache.get(url)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => imageCache.set(url, true);
  }

  useEffect(() => {
    if (!timelineRef.current) return;

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
    timelineRef.current.on("rangechanged", preloadVisibleImages);

    return () => {
      timelineRef.current?.off("rangechanged", preloadVisibleImages);
    };
  }, [timelineItems]);

  // useEffect(() => {
  //   timelineRef.current?.redraw();
  //   console.log('panel resized')
  // }, [panelSize]);

  useEffect(() => {
    timelineRef.current?.setOptions(options);
  }, [options]);

  useEffect(() => {
    if (!timelineRef.current) initTimeline();
    timelineRef.current?.fit({ animation: false });
    // newFocus(timelineItems[0].id, true, true, true); //we want the animation turned off here, but that currently causes the bug of items appearing on the far left. Trye setWindow func here instea
  }, [containerRef]);

  const initTimeline = () => {
    if (!containerRef.current) return;
    console.log("timelineItems", timelineItems);
    timelineRef.current = new Vis(containerRef.current, timelineItems, options);
  };

  //overriding vis-timeline's default styling and tooltips

  function getItemByClassName(className: string | number): TimelineItem {
    return timelineItems.find((item) => item.className === className)!;
  }

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

      setHoveredItemClass(itemClass);
      setPreviewItem(getItemByClassName(itemClass));

      document
        .querySelectorAll(`.${itemClass}`)
        .forEach((el) => el.classList.add("hovered"));
    }
  };

  // Function to handle when the mouse leaves a box element
  const handleMouseLeave = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const classList = Array.from(target.classList);
    const itemClass = classList.find((cls) => cls.startsWith("item_"));

    if (itemClass) {
      setHoveredItemClass(null);
      const elements = document.querySelectorAll(`.${itemClass}`);
      elements.forEach((element) => {
        element.classList.remove("hovered");
      });
    }
  };

  //functions for adjusting focus on button clicks

  const newFocus = (
    id: string,
    center: boolean,
    animate: boolean,
    zoom: boolean
  ) => {
    // Remove the 'vis-selected' class from all elements
    document.querySelectorAll(".vis-selected").forEach((el) => {
      el.classList.remove("vis-selected");
    });

    if (center) {
      timelineRef.current?.focus(id, { animation: animate, zoom: zoom });
    }
    const elements = document.querySelectorAll(`[data-id="${id}"]`);
    elements.forEach((element) => {
      element.classList.add("vis-selected");
      const classList = Array.from(element.classList);
      const itemClass = classList.find((cls) => cls.startsWith("item_"));
      const elements = document.querySelectorAll(`.${itemClass}`);
      elements.forEach((element) => {
        element.classList.add("vis-selected");
      });
    });
    setFocus(id);
  };

  const handleNextFocus = () => {
    // Find the index of the object that has the current focused id
    const currentIndex = timelineItems.findIndex((item) => item.id === focus);

    // Determine the next index, looping back if at the end
    const nextIndex = (currentIndex + 1) % timelineItems.length;
    const nextItem = timelineItems[nextIndex].id;

    newFocus(nextItem, true, true, false);
    handleNewItem(nextItem);
  };

  const handlePreviousFocus = () => {
    // Find the index of the object that has the current focused id
    const currentIndex = timelineItems.findIndex((item) => item.id === focus);

    // Determine the previous index, looping back if at the end
    const prevIndex = (currentIndex - 1) % timelineItems.length;
    const prevItem = timelineItems[prevIndex].id;

    newFocus(prevItem, true, true, false);
    handleNewItem(prevItem);
  };

  const handleFit = () => {
    timelineRef.current?.fit();
  };

  const handleZoomIn = () => {
    timelineRef.current?.zoomIn(0.2);
  };

  const handleZoomOut = () => {
    timelineRef.current?.zoomOut(0.2);
  };

  //add the eventlisteners to the timeline once loaded
  useEffect(() => {
    // apply mouseover events to items
    const elements = document.querySelectorAll(".vis-box, .vis-dot, .vis-line");
    elements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter as EventListener);
      element.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    //click item event listener
    timelineRef.current?.on("click", function (properties: any) {
      if (properties.item) {
        newFocus(properties.item, false, false, false);
        setPreviewItem(null);
        handleNewItem(properties.item);
      }
    });

    // Cleanup event listeners on unmount
    return () => {
      elements.forEach((element) => {
        element.removeEventListener(
          "mouseenter",
          handleMouseEnter as EventListener
        );
        element.removeEventListener(
          "mouseleave",
          handleMouseLeave as EventListener
        );
      });
    };
  }, [timelineRef]);

  return (
    <div className="wrapper h-full">
            <div
        id="timelineContainer"
        ref={containerRef}
        className="timelineContainer"
      >
        {hoveredItemClass && previewItem && hoveredItemRect && (
          <Preview
            item={previewItem}
            key={previewItem.id}
            itemPosition={hoveredItemRect}
          />
        )}
      </div>
      <div className="wrapper h-full">
        <div className="menu group relative w-full z-[9999] h-full pointer-events-none">
          <div className="title m-2 relative z-10">
            <div className="flex items-center">
              {label && (
                <span className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                  {label}
                </span>
              )}
              {itemCount && (
                <>
                  {" "}
                  <span className="mx-4 h-4 w-px bg-gray-600" />
                  <span className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                    {itemCount} items
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="zoomButtons w-auto pointer-events-auto relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <FooterButton
              title="Zoom In"
              label="Zoom In"
              onClick={handleZoomIn}
            >
              +
            </FooterButton>
            <FooterButton
              title="Zoom Out"
              label="Zoom Out"
              onClick={handleZoomOut}
            >
              -
            </FooterButton>
            <FooterButton title="Fit" label="Fit Items" onClick={handleFit}>
              []
            </FooterButton>
          </div>
          <div className="navButtons w-full h-full border-red-300 pointer-events-none">
            <div
              className="navButtonContainer absolute left-0 top-0 w-[50px] h-full bg-gradient-to-r from-black to-transparent flex items-center justify-center pointer-events-auto"
              id="left"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <FooterButton
                  title="Previous"
                  label="Previous"
                  onClick={handlePreviousFocus}
                >
                  ‹
                </FooterButton>
              </div>
            </div>
            <div
              className="navButtonContainer absolute right-0 top-0 w-[50px] h-full bg-gradient-to-l from-black to-transparent flex items-center justify-center pointer-events-auto"
              id="right"
            >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">

              <FooterButton title="Next" label="Next" onClick={handleNextFocus}>
                ›
              </FooterButton>
              </div>
            </div>
          </div>
        </div>

        <div
          id="timelineContainer"
          ref={containerRef}
          className="timelineContainer"
        >
          {hoveredItemClass && previewItem && hoveredItemRect && (
            <Preview
              item={previewItem}
              key={previewItem.id}
              itemPosition={hoveredItemRect}
            />
          )}
        </div>
      </div>


    </div>
  );
}
