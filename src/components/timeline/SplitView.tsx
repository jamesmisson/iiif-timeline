import React, { createRef, useEffect, useState } from "react";
import Timeline from './Timeline'

const MIN_HEIGHT = 75;

interface SplitViewProps {
  top: React.ReactElement;
  className?: string;
  timelineItems: any;
  handleManifestChange: any;
}

const TopPane: React.FunctionComponent<{
    children: any
  topHeight: number | undefined;
  setTopHeight: (value: number) => void;
  dragging: boolean
}> = ({ children, topHeight, setTopHeight, dragging }) => {
  const topRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (topRef.current) {
      if (!topHeight) {
        setTopHeight(topRef.current.clientHeight);
        
        return;
      }

      topRef.current.style.height = `${topHeight}px`;
      topRef.current.style.border = "border: rgb(255, 255, 255) solid 1px;";
    }
  }, [topRef, topHeight, setTopHeight]);


  // dragging is used here to prevent the chrome bug that doesnt allow dragging over iframes. remove when UV component is replaced with none iframe version */

  return <div ref={topRef} className={"topPane " + dragging}>{children}</div>;
};

export const SplitView: React.FunctionComponent<SplitViewProps> = ({
  top,
  className,
  timelineItems,
  handleManifestChange
  }) => {
  const [topHeight, setTopHeight] = useState<number>(600); //should calc this value instead
  const [separatorYPosition, setSeparatorYPosition] = useState<undefined | number>(undefined);
  const [dragging, setDragging] = useState(false);

  const splitPaneRef = createRef<HTMLDivElement>();

  const maximizeTop = () => {
  // to minimize the timeline through the minimize button, we instead have to maximize the uv pane
  // set timeline height here:
  const newTimelineHeight = 120
  if (splitPaneRef.current) {
    const splitPaneHeight = splitPaneRef.current.getBoundingClientRect().height;
    console.log('splitpane height:', splitPaneHeight)
    const newTopHeight = splitPaneHeight - newTimelineHeight
    setTopHeight(newTopHeight);
    console.log('maximizeTop triggered, new topheight:', newTopHeight)
    }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setSeparatorYPosition(e.clientY);
    setDragging(true);

  };

  const onTouchStart = (e: React.TouchEvent) => {
    setSeparatorYPosition(e.touches[0].clientY);
    setDragging(true);

  };

  const onMove = (clientY: number) => {
    if (dragging && topHeight && separatorYPosition) {
      const newTopHeight = topHeight + clientY - separatorYPosition;
      setSeparatorYPosition(clientY);

      if (newTopHeight < MIN_HEIGHT) {
        setTopHeight(MIN_HEIGHT);
        return;
      }

      if (splitPaneRef.current) {
        const splitPaneHeight = splitPaneRef.current.clientHeight;

        if (newTopHeight > splitPaneHeight - MIN_HEIGHT) {
          setTopHeight(splitPaneHeight - MIN_HEIGHT);
          return;
        }
      }

      setTopHeight(newTopHeight);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    onMove(e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    onMove(e.touches[0].clientY);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });
  

  return (
    <div className={`splitView ${className ?? ""}`} ref={splitPaneRef}>
      <TopPane topHeight={topHeight} setTopHeight={setTopHeight} dragging={dragging}>
        {top}
        </TopPane>
      <div
        className="divider-hitbox"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}
      >
        <div className="divider" />
      </div>
      <div className="bottomPane">
            <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
                {timelineItems?.length ? (
                  <Timeline timelineItems={timelineItems} handleManifestChange={handleManifestChange} maximizeTop={maximizeTop}/>
                ) : (
                  <div>Loading Timeline...</div>
                )}
            </div>
        </div>
      </div>
  );
};
