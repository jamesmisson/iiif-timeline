import React, { createRef, useEffect, useState } from "react";

const MIN_HEIGHT = 75;

interface SplitViewProps {
  top: React.ReactElement;
  bottom: React.ReactElement;
  className?: string;
}

const TopPane: React.FunctionComponent<{
    children: any
  topHeight: number | undefined;
  setTopHeight: (value: number) => void;
}> = ({ children, topHeight, setTopHeight }) => {
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

  return <div ref={topRef} className="topPane">{children}</div>;
};

export const SplitView: React.FunctionComponent<SplitViewProps> = ({
  top,
  bottom,
  className
}) => {
  const [topHeight, setTopHeight] = useState<undefined | number>(404); //set to calculated half width
  const [separatorYPosition, setSeparatorYPosition] = useState<
    undefined | number
  >(undefined);
  const [dragging, setDragging] = useState(false);

  const splitPaneRef = createRef<HTMLDivElement>();

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
      <TopPane topHeight={topHeight} setTopHeight={setTopHeight}>
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
      <div className="bottomPane">{bottom}</div>
    </div>
  );
};
