import "./Timeline.css";
import Preview from "./Preview";
//not sure why the below is giving errors. when fixing the data stuff by adding classNames to timelineItems, can just import the main release, and then try installing types with "npm install --save @types/vis-timeline"
// import {
//   Timeline as Vis,
//   TimelineEventPropertiesResult,
// } from "vis-timeline/standalone";
import { Timeline as Vis } from "vis-timeline/standalone";
import { useRef, useEffect, useState } from "react";
import { TimelineItem } from "../../types/TimelineItem";


//NB the local timeline build has a problem with not making the index.js files. See here: https://github.com/visjs/vis-timeline/issues/521
// have to copy in the relevant index files when built and installed :(

// <p>https://visjs.github.io/vis-timeline/examples/timeline/</p>

// TODO: to dynamically set the axis margin (i.e. y position of items on screen ), access the 'configure: true' controls and set dynamically based on window size
//        can probably also do this just by setting margin value dynamically but I dont understand the nesting of the useRef stuff yet
// TODO: get zero padding off <1000 year labels
// TODO: preload thumbail images with mutationobserver and push to preview component on hover
// use the class option on the items so can get rid of all the custom library code and use cdn
// import @types/
// minimized, default, and half heights with buttons
// resize issue
// get manifest from url params
// return to main build not custom fork
// adapt max zoom level to nature of the item dates
// truncate item short titles
// set zoomMin based on if data is by year, month, day etc.  
// the data conversion step is being triggered at every re render which is wasteful. Need to have this component as a container that does the processing, then a separate component for the timeline which is passed the items as prop

type TimelineProps = {
  timelineItems: TimelineItem[],
  handleManifestChange: any,
  panelSize: number,
  options: Object
};

const Timeline: React.FC<TimelineProps> = ({ timelineItems, handleManifestChange, panelSize, options }) => {

  const [focus, setFocus] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<TimelineItem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredItemClass, setHoveredItemClass] = useState<string | null>(null);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Vis | null>(null);

  const handleNewItem = (newManifestId: string) => {
    handleManifestChange(newManifestId)
  }

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

    // const timelineOptions = {
    //   width: "100%",
    //   height: "100%",
    //   zoomMin: 1000 * 60 * 60 * 24 * 7,
    //   // zoomMin: 1000 * 60 * 60 * 24 * 365,
    //   margin: 20,
    //   // max: new Date(),
    //   showTooltips: false,
    //   // tooltip: {
    //   //   // followMouse: true,
    //   //   delay: 0,
    //   //   // overflowMethod: 'none'
    //   // },
    //   showMajorLabels: false,
    //   dataAttributes: ["id"],
    //   // cluster: true
    // };

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
      setMousePosition({ x: event.clientX, y: event.clientY });
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

  // const toggleMinimize = () => {
  //   if (containerRef.current) {
  //     const visLines = containerRef.current.querySelectorAll(".vis-line");
  //     const visDots = containerRef.current.querySelectorAll(".vis-box");
  //     const zoomButtons = containerRef.current.querySelectorAll(".zoomButtons")

  //     if (minimized) {
  //       // Shrink container and hide elements

  //       visLines.forEach((element) => {
  //         (element as HTMLElement).style.display = "none";
  //       });
  //       visDots.forEach((element) => {
  //         (element as HTMLElement).style.display = "none";
  //       });
  //       zoomButtons.forEach((element) => {
  //         (element as HTMLElement).style.display = "none";
  //       });
  //     } else {
  //       // Restore container size and unhide elements
  //       containerRef.current.style.height = "100px"; // Assuming 100px is the original size
  //       visLines.forEach((element) => {
  //         (element as HTMLElement).style.display = "inline-block"; // Restore display
  //       });
  //       visDots.forEach((element) => {
  //         (element as HTMLElement).style.display = "inline-block"; // Restore display
  //       });
  //       zoomButtons.forEach((element) => {
  //         (element as HTMLElement).style.display = "block"; // Restore display
  //       });
  //     }

  //     // Toggle the button state
  //     // setIsMinimized(!isMinimized);
  //     // maximizeTop();
  //   }
  // };


  return (
    <>
      {hoveredItemClass && previewItem && (<Preview item={previewItem} key={previewItem.id} mousePosition={mousePosition}/>)}

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
};

export default Timeline;
