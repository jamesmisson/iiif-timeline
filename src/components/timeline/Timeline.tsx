import "./Timeline.css";
import Preview from "./Preview";
import UniversalViewer from "../uv/UVNext";
// import UV from "../uv/UV";
// import UVViewerAdvanced from "../uv/UVViewerAdvanced";
//not sure why the below is giving errors. when fixing the data stuff by adding classNames to timelineItems, can just import the main release, and then try installing types with "npm install --save @types/vis-timeline"
import {
  Timeline as Vis,
  TimelineEventPropertiesResult,
} from "vis-timeline/standalone";
import { useRef, useEffect, useState } from "react";
import { TimelineItem } from "../../types/TimelineItem";
import { LiaWindowMinimize, LiaWindowMaximize } from "react-icons/lia";



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
  maximizeTop: any,
};

const Timeline: React.FC<TimelineProps> = ({ timelineItems, handleManifestChange, maximizeTop }) => {

  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<TimelineItem | null>(null);
  const [timelineHeight, setTimelineHeight] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Vis | null>(null);

  const handleNewItem = (newManifestId) => {
    handleManifestChange(newManifestId)
  }

  // Function to update height
  const updateHeight = () => {
    if (containerRef.current) {
      setTimelineHeight(containerRef.current.offsetHeight); // Update height
    }
  };

  useEffect(() => {
    // Initial height update
    updateHeight();

    // Create a ResizeObserver to monitor size changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!timelineRef.current) initTimeline();
    newFocus(timelineItems[0].id, true, true, true); //we want the animation turned off here, but that currently causes the bug of items appearing on the far left. Trye setWindow func here instea
  }, [containerRef]);

  const initTimeline = () => {
    if (!containerRef.current) return;

    const timelineOptions = {
      width: "100%",
      height: "100%",
      zoomMin: 1000 * 60 * 60 * 24 * 7,
      // zoomMin: 1000 * 60 * 60 * 24 * 365,
      margin: 20,
      // max: new Date(),
      showTooltips: false,
      // tooltip: {
      //   // followMouse: true,
      //   delay: 0,
      //   // overflowMethod: 'none'
      // },
      showMajorLabels: false,
      dataAttributes: ["id"],
      // configure: true,
    };

    timelineRef.current = new Vis(
      containerRef.current,
      timelineItems,
      timelineOptions
    );
  };

  //overriding vis-timeline's default styling and tooltips, refactor out or add to vistimeline fork?
  //DON'T ACTUALLY NEED TO ADJUST THE SOURCE CODE AND ADD THE OTHER BITS, CAN JUST ADD A CLASSNAME IN THE ITEMS!! THIS WILL APPLY IT TO LINE AND DOT.
  // box line and dot now have classnames of form item_1, item_2 etc.

  function getItemByClassName(className: string | number): TimelineItem {
    return timelineItems.find((item) => item.className === className);
  }

  const showPreview = (id: TimelineItem) => {
    setPreviewItem(id);
  };

  const hidePreview = () => setPreviewItem(null);

  //function to add mouse hover event to item elements
  const handleMouseEnter = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const classList = Array.from(target.classList); // Get the classList of the hovered element as an array
    const itemClass = classList.find((cls) => cls.startsWith("item_"));

    if (itemClass) {
      const elements = document.getElementsByClassName(itemClass);
      Array.from(elements).forEach((element) => {
        element.classList.add("hovered");
      });
      showPreview(getItemByClassName(itemClass));
    }
  };

  // Function to handle when the mouse leaves a box element
  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const classList = Array.from(target.classList);
    const itemClass = classList.find((cls) => cls.startsWith("item_"));

    if (itemClass) {
      const elements = document.getElementsByClassName(itemClass);
      Array.from(elements).forEach((element) => {
        element.classList.remove("hovered");
      });
    }

    hidePreview();
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
      timelineRef.current.focus(id, { animation: animate, zoom: zoom });
    }

    const elements = document.querySelectorAll(`[data-id="${id}"]`);
    elements.forEach((element) => {
      element.classList.add("vis-selected");
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
    setManifestUrl(nextItem)
  };

  const handlePreviousFocus = () => {
    // Find the index of the object that has the current focused id
    const currentIndex = timelineItems.findIndex((item) => item.id === focus);

    // Determine the previous index, looping back if at the end
    const prevIndex = (currentIndex - 1) % timelineItems.length;
    const prevItem = timelineItems[prevIndex].id

    newFocus(prevItem, true, true, false);
    handleNewItem(prevItem)
    setManifestUrl(prevItem)
  };

  const handleFit = () => {
    timelineRef.current.fit()
  }

  const handleZoomIn = () => {
    timelineRef.current.zoomIn(0.2)
  }

  const handleZoomOut = () => {
    timelineRef.current.zoomOut(0.2)
  }

  //this useEffect is to add the eventlisteners to the timeline once loaded
  useEffect(() => {
    // apply mouseover events to items
    const elements = document.querySelectorAll(".vis-box, .vis-dot, .vis-line");
    elements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    //click item event listener
    timelineRef.current.on(
      "click",
      function (properties: TimelineEventPropertiesResult) {
        if (properties.item) {
          newFocus(properties.item, false, false, false);
          setManifestUrl(properties.item);
          setPreviewItem(null);
          handleNewItem(properties.item)
        }
      }
    );

    // Cleanup event listeners on unmount
    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [timelineRef]);

  const toggleMinimize = () => {
    if (containerRef.current) {
      const visLines = containerRef.current.querySelectorAll(".vis-line");
      const visDots = containerRef.current.querySelectorAll(".vis-box");
      const zoomButtons = containerRef.current.querySelectorAll(".zoomButtons")

      if (!isMinimized) {
        // Shrink container and hide elements

        visLines.forEach((element) => {
          (element as HTMLElement).style.display = "none";
        });
        visDots.forEach((element) => {
          (element as HTMLElement).style.display = "none";
        });
        zoomButtons.forEach((element) => {
          (element as HTMLElement).style.display = "none";
        });
      } else {
        // Restore container size and unhide elements
        containerRef.current.style.height = "100px"; // Assuming 100px is the original size
        visLines.forEach((element) => {
          (element as HTMLElement).style.display = "inline-block"; // Restore display
        });
        visDots.forEach((element) => {
          (element as HTMLElement).style.display = "inline-block"; // Restore display
        });
        zoomButtons.forEach((element) => {
          (element as HTMLElement).style.display = "block"; // Restore display
        });
      }

      // Toggle the button state
      setIsMinimized(!isMinimized);
      maximizeTop();
    }
  };


  return (
    <>
      {previewItem && <Preview item={previewItem} key={previewItem.id} position={timelineHeight + 46}/>}
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
      <div id="bottomButtons">
      <div onClick={toggleMinimize} style={{ cursor: "pointer" }}>
      {isMinimized ? <LiaWindowMinimize size={20} /> : <LiaWindowMaximize size={20} />} {/* Toggle between icons */}
    </div>
        {/* <button>A</button>
        <button>B</button>
        <button>C</button> */}
      </div>
    </>
  );
};

export default Timeline;
