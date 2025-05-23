"use client";
import "./Timeline.css";
import { TimelineItem } from "@/types/TimelineItem";
import { Timeline as Vis } from "vis-timeline/standalone";
import { useRef, useEffect, useState } from "react";
import Preview from "./Preview";

interface TimelineComponentProps {
  timelineItems: TimelineItem[],
  handleManifestChange: any,
  panelSize: number,
  options: object
}

export default function TimelineComponent({ timelineItems, handleManifestChange, panelSize, options }: TimelineComponentProps) {
  const [focus, setFocus] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<TimelineItem | null>(null);
  const [hoveredItemClass, setHoveredItemClass] = useState<string | null>(null);
  const [hoveredItemRect, setHoveredItemRect] = useState<DOMRect | null>(null);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Vis | null>(null);

  const handleNewItem = (newManifestId: string) => {
    handleManifestChange(newManifestId)
  }

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
    const visibleItems = timelineItems.filter(item => visibleIds.includes(item.id));
    visibleItems.forEach(item => {
      if (item.title) {
        preloadImage(item.title);
      }
    });
  };

  const delayPreload = () => {
    setTimeout(preloadVisibleImages, 100); // Delay slightly to ensure DOM is ready
  };

  delayPreload();
  timelineRef.current.on('rangechanged', preloadVisibleImages);

  return () => {
    timelineRef.current?.off('rangechanged', preloadVisibleImages);
  };
}, [timelineItems]);


  useEffect(() => {
    timelineRef.current?.redraw();
    console.log('panel resized')
  }, [panelSize]);

  useEffect(() => {
    timelineRef.current?.setOptions(options)
  }, [options]);

  useEffect(() => {
    if (!timelineRef.current) initTimeline();
    timelineRef.current?.fit({ animation: false})	
    // newFocus(timelineItems[0].id, true, true, true); //we want the animation turned off here, but that currently causes the bug of items appearing on the far left. Trye setWindow func here instea
  }, [containerRef]);

  const initTimeline = () => {
    if (!containerRef.current) return;
console.log("timelineItems", timelineItems);
    timelineRef.current = new Vis(
      containerRef.current,
      timelineItems,
      options
    );
  };

    //overriding vis-timeline's default styling and tooltips

    function getItemByClassName(className: string | number): TimelineItem {
      return timelineItems.find((item) => item.className === className)!;
    }

    const handleMouseEnter = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      const classList = Array.from(target.classList);
      const itemClass = classList.find((cls) => cls.startsWith("item_"));
      console.log(itemClass)
    
      if (itemClass) {
        const box = document.querySelector('.vis-box.' + itemClass)
        if (box) {
        setHoveredItemRect(box.getBoundingClientRect())
        }
        setHoveredItemClass(itemClass);
        setPreviewItem(getItemByClassName(itemClass));
        const elements = document.querySelectorAll(`.${itemClass}`);
        elements.forEach((element) => {
          element.classList.add('hovered');
        });
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
        element.classList.remove('hovered');
      });
  }};

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
          element.classList.add('vis-selected');
        });
      }); 
      setFocus(id);
    };

    const handleNextFocus = () => {
      // Find the index of the object that has the current focused id
      const currentIndex = timelineItems.findIndex((item) => item.id === focus);
  
      // Determine the next index, looping back if at the end
      const nextIndex = (currentIndex + 1) % timelineItems.length;
      const nextItem = timelineItems[nextIndex].id
  
      newFocus(nextItem, true, true, false);
      handleNewItem(nextItem)
    };

    const handlePreviousFocus = () => {
      // Find the index of the object that has the current focused id
      const currentIndex = timelineItems.findIndex((item) => item.id === focus);
  
      // Determine the previous index, looping back if at the end
      const prevIndex = (currentIndex - 1) % timelineItems.length;
      const prevItem = timelineItems[prevIndex].id
  
      newFocus(prevItem, true, true, false);
      handleNewItem(prevItem)
    };

    const handleFit = () => {
      timelineRef.current?.fit()
    }
  
    const handleZoomIn = () => {
      timelineRef.current?.zoomIn(0.2)
    }
  
    const handleZoomOut = () => {
      timelineRef.current?.zoomOut(0.2)
    }

      //add the eventlisteners to the timeline once loaded
  useEffect(() => {
    // apply mouseover events to items
    const elements = document.querySelectorAll(".vis-box, .vis-dot, .vis-line");
    elements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter as EventListener);
      element.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    //click item event listener
    timelineRef.current?.on(
      "click",
      function (properties: any) {
        if (properties.item) {
          newFocus(properties.item, false, false, false);
          setPreviewItem(null);
          handleNewItem(properties.item)
        }
      }
    );

    // Cleanup event listeners on unmount
    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter as EventListener);
        element.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      });
    };
  }, [timelineRef]);

  
  return (
    <>
      {hoveredItemClass && previewItem && hoveredItemRect && (<Preview item={previewItem} key={previewItem.id} itemPosition={hoveredItemRect}/>)}

      <div id="timelineContainer" ref={containerRef} className="timelineContainer">

        <div className="menu">
          <div className="zoomButtons">
            <input type="button" className="zoomButton" id="zoomIn" onClick={handleZoomIn}/>
            <input type="button" className="zoomButton" id="zoomOut" onClick={handleZoomOut}/>
            <input type="button" className="zoomButton" id="fit" onClick={handleFit}/>
          </div>
          <div className="navButtons">
            <div className="navButtonContainer" id="left">
              <input type="button" className="navButton" id="moveLeft" onClick={handlePreviousFocus} />
            </div>
            <div className="navButtonContainer" id="right">
              <input type="button" className="navButton" id="moveRight" onClick={handleNextFocus} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}